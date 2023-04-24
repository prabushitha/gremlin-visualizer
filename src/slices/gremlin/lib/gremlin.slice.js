import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const GREMLIN_FEATURE_KEY = "gremlin";
export const gremlinAdapter = createEntityAdapter();

export const initialState = {
  host: 'localhost',
  port: '8182',
  query: '',
  error: null
};

export const gremlinSlice = createSlice({
  name: GREMLIN_FEATURE_KEY,
  initialState: initialState,
  reducers: {

    setHost: (state, {payload}) => {
      state.host = payload;
    },

    setPort: (state, {payload}) => {
      state.port = payload;
    },

    setQuery: (state, {payload}) => {
      state.query = payload;
    },

    setError: (state, {payload}) => {
      state.error = payload;
    },
  }
});

export const gremlinReducer = gremlinSlice.reducer;
export const gremlinActions = gremlinSlice.actions;
