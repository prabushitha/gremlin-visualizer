import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import _ from 'lodash';

export const OPTION_FEATURE_KEY = "option";
export const optionAdapter = createEntityAdapter();

export const initialState = {
  nodeLabels: [],
  queryHistory: JSON.parse(localStorage.getItem('queryHistory')),
  isPhysicsEnabled: true,
  nodeLimit: 100,
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

export const optionSlice = createSlice({
  name: OPTION_FEATURE_KEY,
  initialState: initialState,
  reducers: {

    setIsPhysicsEnabled: (state, action) => {
      state.isPhysicsEnabled = _.get(action, 'payload', true);
    },

    addQueryHistory: (state, { payload }) => {
      let oldLocalStorage = JSON.parse(localStorage.getItem('queryHistory'))
      const data = [payload]
      if (oldLocalStorage) data.push(...oldLocalStorage)
      const uniqueData = Array.from(new Set(data))
      localStorage.setItem('queryHistory', JSON.stringify(uniqueData))

      state.queryHistory = uniqueData;
    },

    clearQueryHistory: (state) => {
      state.queryHistory = [];
      localStorage.removeItem('queryHistory');
    },

    setNodeLabels: (state, action) => {
      state.nodeLabels = _.get(action, 'payload', []);
    },

    addNodeLabel: (state, { payload }) => {
      state.nodeLabels = [...state.queryHistory, payload].push({});
    },

    editNodeLabel: (state, { payload }) => {
      const editIndex = payload.id;
      const editedNodeLabel = payload.nodeLabel;
      if (state.nodeLabels[editIndex]) state.nodeLabels = [...state.nodeLabels.slice(0, editIndex), editedNodeLabel, ...state.nodeLabels.slice(editIndex + 1)];
    },

    removeNodeLabel: (state, { payload }) => {
      const removeIndex = payload;
      if (removeIndex < state.nodeLabels.length) state.nodeLabels = [...state.nodeLabels.slice(0, removeIndex), ...state.nodeLabels.slice(removeIndex + 1)];
    },

    setNodeLimit: (state, { payload }) => {
      state.nodeLimit = payload;
    },

  }
});

export const optionReducer = optionSlice.reducer;
export const optionActions = optionSlice.actions;
