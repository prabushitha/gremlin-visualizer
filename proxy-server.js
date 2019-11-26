const express = require('express');
const bodyParser = require('body-parser');
const gremlin = require('gremlin');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors({
  credentials: true,
}));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {

  res.send('Hello World!');
});



function mapToObj(inputMap) {
  let obj = {};

  inputMap.forEach((value, key) => {
    obj[key] = value
  });

  return obj;
}

function arrayOfMapToObjects(arr) {
  return arr.map((ele) => mapToObj(ele));
}

function edgesToJson(edgeList) {
  return edgeList.map(
    edge => ({
      id: edge.get('id'),
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
      id: node.get('id'),
      label: node.get('label'),
      properties: mapToObj(node.get('properties')),
      edges: edgesToJson(node.get('edges'))
    })
  );
}

function makeQuery(query) {
  return `${query}.dedup().as('node').project('id', 'label', 'properties', 'edges').by(__.id()).by(__.label()).by(__.valueMap().by(__.unfold())).by(__.outE().project('id', 'from', 'to', 'label', 'properties').by(__.id()).by(__.select('node').id()).by(__.inV().id()).by(__.label()).by(__.valueMap().by(__.unfold())).fold())`;
}

app.post('/query', (req, res, next) => {
  const host = req.body.host;
  const port = req.body.port;
  const query = req.body.query;

  const client = new gremlin.driver.Client(`ws://${host}:${port}/gremlin`, { traversalSource: 'g', mimeType: 'application/json' });

  client.submit(makeQuery(query), {})
    .then((result) => res.send(nodesToJson(result._items)))
    .catch((err) => next(err));

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));