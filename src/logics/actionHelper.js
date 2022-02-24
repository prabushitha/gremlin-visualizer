import { extractEdgesAndNodes } from './utils';
import { ACTIONS } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import {graphActions} from '../slices/graph'


export const onFetchQuery = (result, query, oldNodeLabels, dispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(result.data, oldNodeLabels);
  dispatch(graphActions.addNodes(nodes))
  // dispatch({ type: ACTIONS.ADD_NODES, payload: nodes });
  dispatch(graphActions.addEdges(edges))
  // dispatch({ type: ACTIONS.ADD_EDGES, payload: edges });
  dispatch({ type: ACTIONS.SET_NODE_LABELS, payload: nodeLabels });
  dispatch({ type: ACTIONS.ADD_QUERY_HISTORY, payload: query });
};