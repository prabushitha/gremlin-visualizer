import { ActionReducerMapBuilder, createEntityAdapter, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vis from 'vis-network';
import _ from 'lodash';
import { ACTIONS } from '../constants';
import { getDiffNodes, getDiffEdges, findNodeById } from '../logics/utils';


export const GLOBAL_FEATURE_KEY = "graph";
export const globalAdapter = createEntityAdapter();

export const initialGraphState = {
  network: null,
  nodeHolder: new vis.DataSet([]),
  edgeHolder: new vis.DataSet([]),
  nodes: [],
  edges: [],
  selectedNode: {},
  selectedEdge: {},
};



export const globalSlice = createSlice({
  name: GLOBAL_FEATURE_KEY,
  initialState: initialGlobalState,
  reducers: {
    clearGraph: (state, { payload }) => {
      state.nodeHolder.clear();
      state.edgeHolder.clear();
      state.nodes = []
      state.edges = []
      state.selectedNode = {}
      state.selectedEdge = {}
    },

    setNetwork: (state, { payload }) => {
      state.network = payload
    },

    addNodes: (state, { payload }) => {
      const newNodes = getDiffNodes(action.payload, state.nodes);
      const nodes = [...state.nodes, ...newNodes];
      state.nodeHolder.add(newNodes);
      state.nodex = nodes
    },

    addEdges: (state, { payload }) => {
      const newEdges = getDiffEdges(payload, state.edges);
      const edges = [...state.edges, ...newEdges];
      state.edgeHolder.add(newEdges);
      state.edges = edges

    },

    setSelectedNode: (state, { payload }) => {
      const nodeId = action.payload;
      let selectedNode = {};
      if (nodeId !== null) {
        selectedNode = findNodeById(state.nodes, nodeId);
      }
      state.selectedNode = selectedNode
      state.selectedEdge = {}
    },

    setSelectedEdge: (state, { payload }) => {
      const edgeId = action.payload;
      let selectedEdge = {};
      if (edgeId !== null) {
        selectedEdge = findNodeById(state.edges, edgeId);
      }
      state.selectedEdge = selectedEdge
      state.selectedNode = {}
    },

    refreshNodeLabels: (state, { payload }) => {
      const nodeLabelMap = _.mapValues(_.keyBy(action.payload, 'type'), 'field');
      _.map(state.nodes, node => {
        if (node.type in nodeLabelMap) {
          const field = nodeLabelMap[node.type];
          const label = node.properties[field];
          state.nodeHolder.update({ id: node.id, label: label });
          return { ...node, label };
        }
        return node;
      });
    },
  },
});

export const graphReducer = graphSlice.reducer;
export const graphActions = graphSlice.actions;
