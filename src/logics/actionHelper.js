import { extractEdgesAndNodes } from './utils';
import {optionActions, graphActions} from '../slices';


export const onFetchQuery = (result, query, oldNodeLabels, dispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(result.data, oldNodeLabels);
  dispatch(graphActions.addNodes(nodes));
  dispatch(graphActions.addEdges(edges));
  dispatch(optionActions.addQueryHistory(query));
  dispatch(optionActions.setNodeLabels(nodeLabels));
};