const express = require('express');
const bodyParser = require('body-parser');
const gremlin = require('gremlin');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors({ credentials: true, }));

app.use(bodyParser.json());

const dataProcessingFunction = (obj) => {

  if (obj instanceof Map) return dataProcessingFunction(Object.fromEntries(obj))

  if (Array.isArray(obj)) {
    const newObj = obj.map((el) => el instanceof Map ? dataProcessingFunction(Object.fromEntries(el)) : el)

    if (newObj[0] instanceof Map) {
      return dataProcessingFunction(newObj)
    }
    return newObj

  } else if (typeof obj === 'object') {

    for (let prop in obj) {

      if (obj[prop][0] instanceof Map) {
        obj[prop] = dataProcessingFunction(obj[prop][0])
      }

      else if (obj[prop] instanceof Map) {
        obj[prop] = dataProcessingFunction(obj[prop])
      }

      else if (Array.isArray(obj[prop])) {
        obj[prop] = obj[prop].map((el) => dataProcessingFunction(el))
      }
    }
  }

  return obj
}


const nodesToJson = (nodeList) => dataProcessingFunction(nodeList)


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
    .then((result) => res.send(nodesToJson(result._items)))
    .catch((err) => next(err));

});

app.listen(port, () => console.log(`Simple gremlin-proxy server listening on port ${port}!`));