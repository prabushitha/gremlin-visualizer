import React from 'react';
import { Grid } from '@material-ui/core';
import { NetworkGraphComponent } from './components/NetworkGraph/NetworkGraphComponent';
import { HeaderComponent } from './components/Header/HeaderComponent';
import { DetailsComponent } from './components/Details/DetailsComponent';
import {HeaderComponentFun} from './components/Header/HeaderComponentFun';
import { NetworkGraphComponentFun } from './components/NetworkGraph/NetworkGraphComponentFun';



export const App = () => {
  return (
    <div>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12}>
            <HeaderComponentFun />
          </Grid>
          <Grid item xs={12} sm={9} md={9}>
            <NetworkGraphComponentFun />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <DetailsComponent />
          </Grid>
        </Grid>

      </div>
  )
}

export default App