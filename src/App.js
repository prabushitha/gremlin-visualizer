import React from 'react';
import { Grid } from '@material-ui/core';
import { Header } from './components/Header/HeaderComponent';
import { NetworkGraph } from './components/NetworkGraph/NetworkGraphComponent';
import { Details } from './components/Details/DetailsComponent';

export const App = () => {
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12}>
          <Header />
        </Grid>
        <Grid item xs={12} sm={9} md={9}>
          <NetworkGraph />
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Details />
        </Grid>
      </Grid>
    </>
  )
}

export default App