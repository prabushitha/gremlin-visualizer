import { extractEdgesAndNodes } from './utils';
import axios from "axios";
import { ACTIONS, COMMON_GREMLIN_ERROR, QUERY_ENDPOINT } from '../constants';

export const onFetchQuery = (result, query, oldNodeLabels, dispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(result.data, oldNodeLabels);
  dispatch({ type: ACTIONS.ADD_NODES, payload: nodes });
  dispatch({ type: ACTIONS.ADD_EDGES, payload: edges });
  dispatch({ type: ACTIONS.SET_NODE_LABELS, payload: nodeLabels });
  dispatch({ type: ACTIONS.ADD_QUERY_HISTORY, payload: query });
};

export const traverseNode = (nodeId, direction, props) => {
  const query = `g.V('${nodeId}').${direction}()`;
  console.log(JSON.stringify({ host: props.host, port: props.port, query: query, nodeLimit: props.nodeLimit },
    ))
  axios.post(
    QUERY_ENDPOINT,
    { 
      host: props.host, 
      port: props.port, 
      query: query, 
      nodeLimit: props.nodeLimit,
      auth: window.localStorage.getItem('google_session'),
     },
    { headers: { 'Content-Type': 'application/json' } 
  }
  ).then((response) => {
    onFetchQuery(response, query, props.nodeLabels, props.dispatch);
  }).catch((error) => {
    props.dispatch({ type: ACTIONS.SET_ERROR, payload: COMMON_GREMLIN_ERROR });
  });
}