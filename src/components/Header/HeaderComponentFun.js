import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { ACTIONS, QUERY_ENDPOINT, COMMON_GREMLIN_ERROR } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';
import { graphSelector } from '../../slices/graph'
import { graphActions } from '../../slices/graph'
import { gremlinActions } from '../../../slices/gremlin/lib/gremlin.slice';
import { gremlinDataSelector } from '../../../slices/gremlin/lib/gremlin.selector';

const HeaderFun = ((props) => {

  const dispatch = useDispatch();
  const { nodes, edges } = useSelector(graphSelector)
  const {host, port, query, error} = useSelector(gremlinDataSelector);

  const onHostChanged = (event) => {
    dispatch(gremlinActions.setHost(event.target.value))
    // props.dispatch({ type: ACTIONS.SET_HOST, payload: event.target.value });
  }
  
  const onPortChanged = (event) => {
    dispatch(gremlinActions.setPort(event.target.value))
    // props.dispatch({ type: ACTIONS.SET_PORT, payload: event.target.value });
  }
  
  const onQueryChanged = (event) => {
    dispatch(gremlinActions.setQuery(event.target.value))
    // props.dispatch({ type: ACTIONS.SET_QUERY, payload: event.target.value });
  }

  const clearGraph = () => {
    dispatch(graphActions.clearGraph())
    // props.dispatch({ type: ACTIONS.CLEAR_GRAPH });
    props.dispatch({ type: ACTIONS.CLEAR_QUERY_HISTORY });
  }

  const sendQuery = (e) => {
    dispatch(gremlinActions.setError(null))
    // props.dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    axios.post(
      QUERY_ENDPOINT,
      { host: host, port: port, query: query, nodeLimit: props.nodeLimit },
      { headers: { 'Content-Type': 'application/json' } }
    ).then((response) => {
      onFetchQuery(response, query, props.nodeLabels, props.dispatch);
    }).catch((error) => {
      dispatch(gremlinActions.setError(COMMON_GREMLIN_ERROR))
      // props.dispatch({ type: ACTIONS.SET_ERROR, payload: COMMON_GREMLIN_ERROR });
    });
  }
  return (
    <div className={'header'}>
      <form noValidate autoComplete="off">
        <TextField value={host} onChange={onHostChanged} id="standard-basic" label="host" style={{ width: '10%' }} />
        <TextField value={port} onChange={onPortChanged} id="standard-basic" label="port" style={{ width: '10%' }} />
        <TextField value={query} onChange={onQueryChanged} id="standard-basic" label="gremlin query" style={{ width: '60%' }} />
        <Button variant="contained" color="primary" onClick={sendQuery} style={{ width: '150px' }} >Execute</Button>
        <Button variant="outlined" color="secondary" onClick={clearGraph} style={{ width: '150px' }} >Clear Graph</Button>
      </form>
      <br />
      <div style={{ color: 'red' }}>{error}</div>
    </div>

  )
})


export const HeaderComponentFun = connect((state) => {
  return {
    // nodes: state.graph.nodes,
    // edges: state.graph.edges,
    // host: state.gremlin.host,
    // port: state.gremlin.port,
    // query: state.gremlin.query,
    // error: state.gremlin.error,
    nodeLabels: state.options.nodeLabels,
    nodeLimit: state.options.nodeLimit
  };
})(HeaderFun);



