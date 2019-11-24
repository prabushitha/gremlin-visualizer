import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';

import { reducer as gremlinReducer } from './reducers/gremlinReducer';
import { reducer as graphReducer } from './reducers/graphReducer';
import { reducer as optionReducer } from './reducers/optionReducer';
import { App } from './App';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({ gremlin: gremlinReducer, graph: graphReducer, options: optionReducer });

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(createLogger()))
);

//6. Render react element
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
