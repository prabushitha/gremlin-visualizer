const express = require('express');
const bodyParser = require('body-parser');
const gremlin = require('gremlin');
const cors = require('cors');
const app = express();
const port = 3001;
const gremlinSV4 = require('gremlin-aws-sigv4');
const { OAuth2Client } = require('google-auth-library');


// Override error handler function FROM gremlin-aws-sigv4 to avoid throwing an exception that cannot be caught
class AWSConnection extends gremlinSV4.driver.AwsSigV4DriverRemoteConnection {
  _errorHandler(error) {
    try {
      super._errorHandler(error);
    } catch(e) {
      return;
    }
  }
}

app.use(cors({
  credentials: true,
}));

// parse application/json
app.use(bodyParser.json());

function mapToObj(inputMap) {
  let obj = {};
  inputMap.forEach((value, key) => {
    obj[key] = value
  });

  return obj;
}

function mapNeptuneEdge(edge) {
  return {
    id: typeof edge['id'] !== "string" ? JSON.stringify(edge['id']) : edge['id'],
    from: edge['from'],
    to: edge['to'],
    label: edge['label'],
    properties: edge['properties'],
  }
}

function mapNeptuneNode(node) {
  return {
    id: node['id'],
    label: node['label'],
    properties: node['properties'],
    edges: edgesToJson(node['edges'], 'neptune')
  }
}

function mapGremlinNode(node) {
  return {
    id: node.get('id'),
    label: node.get('label'),
    properties: mapToObj(node.get('properties')),
    edges: edgesToJson(node.get('edges'), 'gremlin')
  }
}

function mapGremlinEdge(edge) {
  return {
    id: typeof edge.get('id') !== "string" ? JSON.stringify(edge.get('id')) : edge.get('id'),
    from: edge.get('from'),
    to: edge.get('to'),
    label: edge.get('label'),
    properties: mapToObj(edge.get('properties')),
  }
}

function edgesToJson(edgeList, mode) {
  return edgeList.map( edge => mode == 'neptune' ? mapNeptuneEdge(edge) : mapGremlinEdge(edge));
}
function nodesToJson(nodeList, mode) {
  return nodeList.map( node => mode == 'neptune' ? mapNeptuneNode(node) : mapGremlinNode(node));
}

function makeQuery(query, nodeLimit) {
  const nodeLimitQuery = !isNaN(nodeLimit) && Number(nodeLimit) > 0 ? `.limit(${nodeLimit})`: '';
  return `${query}${nodeLimitQuery}.dedup().as('node').project('id', 'label', 'properties', 'edges').by(__.id()).by(__.label()).by(__.valueMap().by(__.unfold())).by(__.outE().project('id', 'from', 'to', 'label', 'properties').by(__.id()).by(__.select('node').id()).by(__.inV().id()).by(__.label()).by(__.valueMap().by(__.unfold())).fold())`;
}


function checkAuthentication(auth) {
  return new Promise((resolve, _) => {
    // Resole to ture (authenticate) if there's no Google Client ID 
    if (!process.env.GOOGLE_CLIENT_ID)  {
      resolve(true);
      return;
    }

    let googleSession = JSON.parse(auth);
    if (!googleSession.clientId || !googleSession.credential) {
      resolve(false);
      return;
    }
    // Using our own google client ID ensures that we *only* accept Google Id tokens that
    // are valid for our application
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    client.verifyIdToken({
      idToken: googleSession.credential,
      audience: process.env.GOOGLE_CLIENT_ID}).then(ticket => {
        resolve(true);
        return;
      }).catch(err=> {
        resolve(false)
      })
  })
}

function performQuery(req, res, next) {
  const gremlinHost = req.body.host;
  const gremlinPort = req.body.port;
  const nodeLimit = req.body.nodeLimit;
  const query = req.body.query;
  const use_aws_neptune = req.body.host.includes('neptune.amazonaws.com');
  const complete_query = makeQuery(query, nodeLimit);
  console.log("Performing query:", complete_query);

  if (use_aws_neptune) {
    const connection = new AWSConnection(
      gremlinHost, gremlinPort, { secure: true, autoReconnect: true },
      // connected callback
      () => {
        connection.submit(complete_query).then(r => {
          let json = nodesToJson(r.traversers, 'neptune')
          res.send(json)
        }).catch(err => {
          console.log("Error submitting request:")
          console.log(err);
          next(err);
        });
      }, 
    );
  }
  else {
    const url = `ws://${gremlinHost}:${gremlinPort}/gremlin`;
    const client = new gremlin.driver.Client(url, { traversalSource: 'g', mimeType: 'application/json' });
    client.submit(makeQuery(query, nodeLimit), {})
      .then((result) => res.send(nodesToJson(result._items)))
      .catch((err) => { console.log(err); next(err) })
  }
}

app.post('/query', (req, res, next) => {
  checkAuthentication(req.body.auth).then(isAuth => {
    if (!isAuth)  {
      res.sendStatus(401);    
    }
    else {
      performQuery(req, res, next);
    }
  });

});

// Makes the app less brittle so that it doesn't crash when there's a timeout or a request error
app.on('uncaughtException', (err) => {
  console.log('Error while processing request')
  console.log(err);
  next(err)
})

app.listen(port, () => console.log(`Simple gremlin-proxy server listening on port ${port}!`));
