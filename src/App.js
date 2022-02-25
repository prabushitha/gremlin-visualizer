import React from 'react';
import { Grid } from '@material-ui/core';
import { HeaderFun } from './components/Header/HeaderComponentFun';
import { NetworkGraphFun } from './components/NetworkGraph/NetworkGraphComponentFun';
import { DetailsFun } from './components/Details/DetailsComponentFun';

export const App = () => {
  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12}>
          <HeaderFun />
        </Grid>
        <Grid item xs={12} sm={9} md={9}>
          <NetworkGraphFun />
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <DetailsFun />
        </Grid>
      </Grid>

    </div>
  )
}

export default App