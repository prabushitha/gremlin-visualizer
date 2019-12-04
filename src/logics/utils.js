import _ from 'lodash';

const selectRandomField = (obj) => {
  let firstKey;
  for (firstKey in obj) break;
  return firstKey;
};

export const getDiffNodes = (newList, oldList) => {
  return _.differenceBy(newList, oldList, (node) => node.id);
};

export const getDiffEdges = (newList, oldList) => {
  return _.differenceBy(newList, oldList, (edge) => `${edge.from},${edge.to}`);
};

export const extractEdgesAndNodes = (nodeList, nodeLabels=[]) => {
  let edges = [];
  const nodes = [];

  const nodeLabelMap =_.mapValues( _.keyBy(nodeLabels, 'type'), 'field');

  _.forEach(nodeList, (node) => {
    const type = node.label;
    if (!nodeLabelMap[type]) {
      const field = selectRandomField(node.properties);
      const nodeLabel = { type, field };
      nodeLabels.push(nodeLabel);
      nodeLabelMap[type] = field;
    }
    const labelField = nodeLabelMap[type];
    const label = labelField in node.properties ? node.properties[labelField] : type;
    nodes.push({ id: node.id, label: String(label), group: node.label, properties: node.properties, type });

    edges = edges.concat(_.map(node.edges, edge => ({ ...edge, type: edge.label, arrows: { to: { enabled: true, scaleFactor: 0.5 } } })));
  });

  return { edges, nodes, nodeLabels }
};

export const findNodeById = (nodeList, id) => {
  return _.find(nodeList, node => node.id === id);
};

export const stringifyObjectValues = (obj) => {
  _.forOwn(obj, (value, key) => {
    if (!_.isString(value)) {
      obj[key] = JSON.stringify(value);
    }
  });
};
