import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { QUERY_ENDPOINT, COMMON_GREMLIN_ERROR } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';
import { optionDataSelector, gremlinDataSelector, gremlinActions, graphSelector, graphActions } from '../../slices';

export const Header = (() => {

  const dispatch = useDispatch();

  const { nodeLabels, nodeLimit } = useSelector(optionDataSelector);
  const { host, port, query, error } = useSelector(gremlinDataSelector);

  const onHostChanged = (event) => dispatch(gremlinActions.setHost(event.target.value))

  const onPortChanged = (event) => dispatch(gremlinActions.setPort(event.target.value))

  const onQueryChanged = (event) => dispatch(gremlinActions.setQuery(event.target.value))

  const clearGraph = () => {
    dispatch(graphActions.clearGraph());
  }

  const sendQuery = (e) => {
    dispatch(gremlinActions.setError(null))
    axios.post(
      QUERY_ENDPOINT,
      { host: host, port: port, query: query, nodeLimit: nodeLimit },
      { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        return onFetchQuery(response, query, nodeLabels, dispatch)
      })
      .catch((error) => dispatch(gremlinActions.setError(COMMON_GREMLIN_ERROR)))
  }

  return (
    <div className='header'>
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