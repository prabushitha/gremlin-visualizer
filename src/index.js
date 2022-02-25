import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import { Provider } from 'react-redux';
import { App } from './App';
import { useDispatch } from "react-redux";
import { gremlinReducer, graphReducer, optionReducer } from "./slices";

const rootReducer = combineReducers({
  graph: graphReducer,
  gremlin: gremlinReducer,
  option: optionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: [logger]
});

export const useAppDispatch = () => useDispatch();

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
