import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { globalReducer } from './slices/global'
import { graphReducer } from './slices/graph'
import { gremlinReducer } from "./slices/gremlin";
import { optionReducer } from "./slices/option";



const rootReducer = combineReducers({
  global: globalReducer,
  graph: graphReducer,
  gremlin: gremlinReducer,
  option: optionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export const useAppDispatch = () => useDispatch();

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
