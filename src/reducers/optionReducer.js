import _ from 'lodash';
import { ACTIONS } from '../constants';

const initialState = {
  nodeLabels: [],
  queryHistory: [],
  isPhysicsEnabled: true,
  networkOptions: {
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -26,
        centralGravity: 0.005,
        springLength: 230,
        springConstant: 0.18,
        avoidOverlap: 1.5
      },
      maxVelocity: 40,
      solver: 'forceAtlas2Based',
      timestep: 0.35,
      stabilization: {
        enabled: true,
        iterations: 50,
        updateInterval: 25
      }
    },
    configure: function(option, path) {
      if (path.indexOf("smooth") !== -1 || option === "smooth") {
        return true;
      }
      return false;
    },
    nodes: {
      shape: "dot",
      size: 20,
      borderWidth: 2,
      font: {
        size: 11
      }
    },
    edges: {
      width: 2,
      font: {
        size: 11
      },
      smooth: {
        type: 'dynamic'
      }
    }
  }
};

export const reducer =  (state=initialState, action)=>{
  switch (action.type){
    case ACTIONS.SET_IS_PHYSICS_ENABLED: {
      const isPhysicsEnabled = _.get(action, 'payload', true);
      return { ...state, isPhysicsEnabled };
    }
    case ACTIONS.ADD_QUERY_HISTORY: {
      return { ...state, queryHistory: [ ...state.queryHistory, action.payload] }
    }
    case ACTIONS.CLEAR_QUERY_HISTORY: {
      return { ...state, queryHistory: [] }
    }
    case ACTIONS.SET_NODE_LABELS: {
      const nodeLabels = _.get(action, 'payload', []);
      return { ...state, nodeLabels };
    }
    case ACTIONS.ADD_NODE_LABEL: {
      const nodeLabels = [...state.nodeLabels, {}];
      return { ...state, nodeLabels };
    }
    case ACTIONS.EDIT_NODE_LABEL: {
      const editIndex = action.payload.id;
      const editedNodeLabel = action.payload.nodeLabel;

      if (state.nodeLabels[editIndex]) {
        const nodeLabels = [...state.nodeLabels.slice(0, editIndex), editedNodeLabel, ...state.nodeLabels.slice(editIndex+1)];
        return { ...state, nodeLabels };
      }
      return state;
    }
    case ACTIONS.REMOVE_NODE_LABEL: {
      const removeIndex = action.payload;
      if (removeIndex < state.nodeLabels.length) {
        const nodeLabels = [...state.nodeLabels.slice(0, removeIndex), ...state.nodeLabels.slice(removeIndex+1)];
        return { ...state, nodeLabels };
      }
      return state;
    }
    default:
      return state;
  }
};
