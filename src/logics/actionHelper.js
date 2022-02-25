import { extractEdgesAndNodes } from './utils';
import { useDispatch, useSelector } from 'react-redux';
import {optionActions, graphActions} from '../slices';


export const onFetchQuery = (result, query, oldNodeLabels, dispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(result.data, oldNodeLabels);
  dispatch(graphActions.addNodes(nodes));
  dispatch(graphActions.addEdges(edges));
  dispatch(optionActions.addQueryHistory(query));
  dispatch(optionActions.setNodeLabels(nodeLabels));
};