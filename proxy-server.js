const express = require('express');
const bodyParser = require('body-parser');
const gremlin = require('gremlin');
const cors = require('cors');
const app = express();
const port = 3001;
const gremlinSV4 = require('gremlin-aws-sigv4');


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

function edgesToJson(edgeList) {
  return edgeList.map(
    edge => ({
      id: typeof edge.get('id') !== "string" ? JSON.stringify(edge.get('id')) : edge.get('id'),
      from: edge.get('from'),
      to: edge.get('to'),
      label: edge.get('label'),
      properties: mapToObj(edge.get('properties')),
    })
  );
}

function nodesToJson(nodeList) {
  return nodeList.map(
    node => ({
      id: node['id'],
      label: node['label'],
      properties: node['properties'],
      edges: edgesToJson(node['edges'])
    })
  );
}

function makeQuery(query, nodeLimit) {
  const nodeLimitQuery = !isNaN(nodeLimit) && Number(nodeLimit) > 0 ? `.limit(${nodeLimit})`: '';
  return `${query}${nodeLimitQuery}.dedup().as('node').project('id', 'label', 'properties', 'edges').by(__.id()).by(__.label()).by(__.valueMap().by(__.unfold())).by(__.outE().project('id', 'from', 'to', 'label', 'properties').by(__.id()).by(__.select('node').id()).by(__.inV().id()).by(__.label()).by(__.valueMap().by(__.unfold())).fold())`;
}

app.post('/query', (req, res, next) => {
  const gremlinHost = req.body.host;
  const gremlinPort = req.body.port;
  const nodeLimit = req.body.nodeLimit;
  const query = req.body.query;
  const use_aws_neptune = req.body.host.includes('neptune.amazonaws.com');
  
  if (use_aws_neptune) {
    const connection = new gremlinSV4.driver.AwsSigV4DriverRemoteConnection(
      gremlinHost, 8182, { secure: true },
      // connected callback
      () => {
        connection.submit(makeQuery(query, nodeLimit)).then(r => {
          let json = nodesToJson(r.traversers)          
          res.send(json)
        })
      },
    );
  }
  else {
    const url = `wss://${gremlinHost}:${gremlinPort}/gremlin`;
    const client = new gremlin.driver.Client(url, { traversalSource: 'g', mimeType: 'application/json' });
    client.submit(makeQuery(query, nodeLimit), {})
      .then((result) => res.send(nodesToJson(result._items)))
      .catch((err) => {console.log(err);next(err) })
  }
});

app.listen(port, () => console.log(`Simple gremlin-proxy server listening on port ${port}!`));