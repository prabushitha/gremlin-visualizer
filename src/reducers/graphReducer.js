import vis from 'vis-network';
import _ from 'lodash';
import { ACTIONS } from '../constants';
import { getDiffNodes, getDiffEdges, findNodeById } from '../logics/utils';

const initialState = {
  network: null,
  nodeHolder: new vis.DataSet([]),
  edgeHolder: new vis.DataSet([]),
  nodes: [],
  edges: [],
  selectedNode: {},
  selectedEdge: {},
};

export const reducer =  (state=initialState, action)=>{
  switch (action.type){
    case ACTIONS.CLEAR_GRAPH: {
      state.nodeHolder.clear();
      state.edgeHolder.clear();

      return { ...state, nodes: [], edges: [], selectedNode:{}, selectedEdge: {} };
    }
    case ACTIONS.SET_NETWORK: {
      return { ...state, network: action.payload };
    }
    case ACTIONS.ADD_NODES: {
      const newNodes = getDiffNodes(action.payload, state.nodes);
      const nodes = [...state.nodes, ...newNodes];
      state.nodeHolder.add(newNodes);
      return { ...state, nodes };
    }
    case ACTIONS.ADD_EDGES: {
      const newEdges = getDiffEdges(action.payload, state.edges);
      const edges = [...state.edges, ...newEdges];
      state.edgeHolder.add(newEdges);
      return { ...state, edges };
    }
    case ACTIONS.SET_SELECTED_NODE: {
      const nodeId = action.payload;
      let selectedNode = {};
      if (nodeId !== null) {
        selectedNode = findNodeById(state.nodes, nodeId);
      }
      return { ...state, selectedNode, selectedEdge: {} };
    }
    case ACTIONS.SET_SELECTED_EDGE: {
      const edgeId = action.payload;
      let selectedEdge = {};
      if (edgeId !== null) {
        selectedEdge = findNodeById(state.edges, edgeId);
      }
      return { ...state, selectedEdge, selectedNode: {} };
    }
    case ACTIONS.REFRESH_NODE_LABELS: {
      const nodeLabelMap =_.mapValues( _.keyBy(action.payload, 'type'), 'field');
      _.map(state.nodes, node => {
        if (node.type in nodeLabelMap) {
          const field = nodeLabelMap[node.type];
          const label = node.properties[field];
          state.nodeHolder.update({id:node.id, label: label});
          return {...node, label };
        }
        return node;
      });
      return state;
    }
    default:
      return state;
  }
};
