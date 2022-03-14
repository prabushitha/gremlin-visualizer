import { extractEdgesAndNodes } from './utils';
import {optionActions, graphActions} from '../slices';


export const onFetchQuery = (result, query, oldNodeLabels, dispatch) => {

  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(result.data, oldNodeLabels);

  const newNodes = nodes.map(node => {
    return { ...node, properties: { age: node.properties.age[0], name: node.properties.name[0]  } }
  })



  dispatch(graphActions.addNodes(newNodes));
  dispatch(graphActions.addEdges(edges));
  dispatch(optionActions.addQueryHistory(query));
  dispatch(optionActions.setNodeLabels(nodeLabels));
};