import React from 'react';
import { connect } from 'react-redux';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { ACTIONS, QUERY_ENDPOINT, COMMON_GREMLIN_ERROR } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';
import { useDispatch, useSelector } from 'react-redux';
import { graphSelector } from '../../slices/graph'
import { graphActions } from '../../slices/graph'



const HeaderFun = ((props) => {
  const dispatch = useDispatch()
  const data, { nodes, edges } = useSelector(graphSelector)

  const onHostChanged = (event) => {

    props.dispatch({ type: ACTIONS.SET_HOST, payload: event.target.value });
  }

  const onPortChanged = (event) => {
    props.dispatch({ type: ACTIONS.SET_PORT, payload: event.target.value });
  }

  const onQueryChanged = (event) => {
    props.dispatch({ type: ACTIONS.SET_QUERY, payload: event.target.value });
  }

  const clearGraph = () => {
    dispatch(graphActions.clearGraph())
    // props.dispatch({ type: ACTIONS.CLEAR_GRAPH });
    props.dispatch({ type: ACTIONS.CLEAR_QUERY_HISTORY });
  }

  const sendQuery = (e) => {
    console.log(e.target)
    props.dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    axios.post(
      QUERY_ENDPOINT,
      { host: props.host, port: props.port, query: props.query, nodeLimit: props.nodeLimit },
      { headers: { 'Content-Type': 'application/json' } }
    ).then((response) => {
      onFetchQuery(response, props.query, props.nodeLabels, props.dispatch);
    }).catch((error) => {
      props.dispatch({ type: ACTIONS.SET_ERROR, payload: COMMON_GREMLIN_ERROR });
    });
  }
  return (
    <div className={'header'}>
      <form noValidate autoComplete="off">
        <TextField value={props.host} onChange={onHostChanged} id="standard-basic" label="host" style={{ width: '10%' }} />
        <TextField value={props.port} onChange={onPortChanged} id="standard-basic" label="port" style={{ width: '10%' }} />
        <TextField value={props.query} onChange={onQueryChanged} id="standard-basic" label="gremlin query" style={{ width: '60%' }} />
        <Button variant="contained" color="primary" onClick={sendQuery} style={{ width: '150px' }} >Execute</Button>
        <Button variant="outlined" color="secondary" onClick={clearGraph} style={{ width: '150px' }} >Clear Graph</Button>
      </form>
      <br />
      <div style={{ color: 'red' }}>{props.error}</div>
    </div>

  )
})


export const HeaderComponentFun = connect((state) => {
  return {
    host: state.gremlin.host,
    port: state.gremlin.port,
    query: state.gremlin.query,
    error: state.gremlin.error,
    // nodes: state.graph.nodes,
    // edges: state.graph.edges,
    nodeLabels: state.options.nodeLabels,
    nodeLimit: state.options.nodeLimit
  };
})(HeaderFun);



