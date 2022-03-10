const express = require('express');
const bodyParser = require('body-parser');
const gremlin = require('gremlin');
const cors = require('cors');
const { isObject } = require('lodash');
const app = express();
const port = 3001;
let newObjArr
app.use(cors({
  credentials: true,
}));

// parse application/json
app.use(bodyParser.json());

function mapToObj(inputMap) {

  console.log('map to object')
  console.log(inputMap)

  let obj = {};

  inputMap.forEach((value, key) => {
    obj[key] = Object.fromEntries(value)
    console.log(value)
  });

  // console.log(obj)
  // const newObj = Object.entries(obj)
  // console.log(newObj)

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

const dataProcessingFunction = (obj) => {
  console.log('--- new object ---')
  
  if (obj instanceof Map) {
    return dataProcessingFunction(Object.fromEntries(obj))
  }

  if (Array.isArray(obj)) {
    console.log(obj)
    if (obj instanceof Map) {
      return dataProcessingFunction(Object.fromEntries(obj))
    }
  }

  if (typeof (obj) === 'object') {
    for (let el in obj) {
      console.log('property')
      console.log(obj[el])
      if (Array.isArray(obj[el])) {
        if (obj[el][0] instanceof Map) {
          console.log('^^^ property array-map ^^^')
          obj[el] = (Object.fromEntries(obj[el][0]))
        }
      }
    }
  }

  // console.log(obj)

  // if (obj[el] instanceof Map){

  return obj
}


function nodesToJson(nodeList) {

  console.log(nodeList)
  console.log('^^^^^^^^^^^^^ Original data ^^^^^^^^^^^^^^^^')

  newObjArr = nodeList.map(el => {
    return dataProcessingFunction(el)
  })

  console.log('############## Data processed ############')
  // console.log(newObjArr)
  // console.log(newObjArr[0].properties)



  // console.log('*************')

  return newObjArr

  return nodeList.map(
    node => {
      return ({
        id: node.get('id'),
        label: node.get('label'),
        properties: mapToObj(node.get('properties')),
        edges: edgesToJson(node.get('edges'))
      })
    }
  );
}

function makeQuery(query, nodeLimit) {
  const nodeLimitQuery = !isNaN(nodeLimit) && Number(nodeLimit) > 0 ? `.limit(${nodeLimit})` : '';
  return `${query}${nodeLimitQuery}.dedup().as('node')
  .project('id', 'label', 'properties', 'edges')
  .by(__.id())
  .by(__.label())
  .by(properties().group().by(key).by(union(__.value(),__.valueMap()).fold()).fold())
  .by(__.outE()
    .project('id', 'from', 'to', 'label', 'properties')
    .by(__.id())
    .by(__.select('node').id())
    .by(__.inV().id())
    .by(__.label())
    .by(__.valueMap()
    .by(__.unfold())
  )
  .fold())`;
}

app.post('/query', (req, res, next) => {
  const gremlinHost = req.body.host;
  const gremlinPort = req.body.port;
  const nodeLimit = req.body.nodeLimit;
  const query = req.body.query;


  const client = new gremlin.driver.Client(`ws://${gremlinHost}:${gremlinPort}/gremlin`, { traversalSource: `${query.split('.')[0]}`, mimeType: 'application/json' });

  client.submit(makeQuery(query, nodeLimit), {})
    .then((result) => {
      console.log(result._items)
      // console.log(newObjArr)
      return res.send(nodesToJson(result._items))
    })
    .catch((err) => next(err));

});

app.listen(port, () => console.log(`Simple gremlin-proxy server listening on port ${port}!`));