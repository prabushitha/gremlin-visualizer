import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import vis from 'vis-network';
import _ from 'lodash';

import { getDiffNodes, getDiffEdges, findNodeById } from '../../../logics/utils'

export const GRAPH_FEATURE_KEY = "graph";
export const graphAdapter = createEntityAdapter();

export const initialGraphState = {
  network: null,
  nodeHolder: new vis.DataSet([]),
  edgeHolder: new vis.DataSet([]),
  nodes: [],
  edges: [],
  selectedNode: {},
  selectedEdge: {},
};

export const graphSlice = createSlice({
  name: GRAPH_FEATURE_KEY,
  initialState: initialGraphState,
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

      const newNodes = getDiffNodes(payload, state.nodes);
      
      const nodes = [...state.nodes, ...newNodes];
      state.nodeHolder.add(newNodes);
      state.nodes = nodes
    },

    addEdges: (state, { payload }) => {
      console.log(payload)
      const newEdges = getDiffEdges(payload, state.edges);
      const edges = [...state.edges, ...newEdges];
      state.edgeHolder.add(newEdges);
      state.edges = edges

    },

    setSelectedNode: (state, { payload }) => {
      const nodeId = payload;
      let selectedNode = {};
      console.log(payload)
      if (nodeId !== null) {
        selectedNode = findNodeById(state.nodes, nodeId);
      }
      state.selectedNode = selectedNode
      state.selectedEdge = {}
    },

    setSelectedEdge: (state, { payload }) => {
      const edgeId = payload;
      let selectedEdge = {};
      if (edgeId !== null) {
        selectedEdge = findNodeById(state.edges, edgeId);
      }
      state.selectedEdge = selectedEdge
      state.selectedNode = {}
    },

    refreshNodeLabels: (state, { payload }) => {
      const nodeLabelMap = _.mapValues(_.keyBy(payload, 'type'), 'field');
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
