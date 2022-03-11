import { extractEdgesAndNodes } from './utils';
import {optionActions, graphActions} from '../slices';


export const onFetchQuery = (result, query, oldNodeLabels, dispatch) => {
  console.log(result.data)
  console.log(oldNodeLabels)
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(result.data, oldNodeLabels);
  console.log(edges)
  dispatch(graphActions.addNodes(nodes));
  dispatch(graphActions.addEdges(edges));
  dispatch(optionActions.addQueryHistory(query));
  dispatch(optionActions.setNodeLabels(nodeLabels));
};