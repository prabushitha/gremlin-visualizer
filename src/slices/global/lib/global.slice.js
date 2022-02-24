import { ActionReducerMapBuilder, createEntityAdapter, createSlice, createAsyncThunk } from "@reduxjs/toolkit";



export const GLOBAL_FEATURE_KEY = "global";
export const globalAdapter = createEntityAdapter();

export const initialGlobalState = {
  user: null,
  operatorData: {
    loadingStatus: Status.NEW,
    error: null,
    data: {
      deviceId: null,
      operatorId: null
    }
  }
};

export const globalSlice = createSlice({
  name: GLOBAL_FEATURE_KEY,
  initialState: initialGlobalState,
  reducers: {
    setAuth: (state, { payload }) => {
      state.user = payload
    },
  },
});

export const globalReducer = globalSlice.reducer;
export const globalActions = globalSlice.actions;
