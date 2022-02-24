import React from 'react';
import { connect } from 'react-redux';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  List,
  ListItem,
  ListItemText,
  TextField,
  Fab,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  FormControlLabel,
  Switch,
  Divider,
  Tooltip
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import _ from 'lodash';
import { JsonToTable } from 'react-json-to-table';
import { ACTIONS, COMMON_GREMLIN_ERROR, QUERY_ENDPOINT } from '../../constants';
import axios from "axios";
import { onFetchQuery} from '../../logics/actionHelper';
import { stringifyObjectValues} from '../../logics/utils';

const DetailsFun = () => {
  return (
    <div className={'details'}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Query History</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <List dense={true}>
                  {this.generateList(this.props.queryHistory)}
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Settings</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Tooltip title="Automatically stabilize the graph" aria-label="add">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.props.isPhysicsEnabled}
                          onChange={() => { this.onTogglePhysics(!this.props.isPhysicsEnabled); }}
                          value="physics"
                          color="primary"
                        />
                      }
                      label="Enable Physics"
                    />
                    </Tooltip>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Tooltip title="Number of maximum nodes which should return from the query. Empty or 0 has no restrictions." aria-label="add">
                      <TextField label="Node Limit" type="Number" variant="outlined" value={this.props.nodeLimit} onChange={event => {
                        const limit = event.target.value;
                        this.onEditNodeLimit(limit)
                      }} />
                    </Tooltip>

                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography>Node Labels</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <List dense={true}>
                      {this.generateNodeLabelList(this.props.nodeLabels)}
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Fab variant="extended" color="primary" size="small" onClick={this.onRefresh.bind(this)}>
                      <RefreshIcon />
                      Refresh
                    </Fab>
                    <Fab variant="extended" size="small" onClick={this.onAddNodeLabel.bind(this)}>
                      <AddIcon />
                      Add Node Label
                    </Fab>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          {hasSelected &&
          <Grid item xs={12} sm={12} md={12}>
            <h2>Information: {selectedHeader}</h2>
            {selectedHeader === 'Node' &&
            <Grid item xs={12} sm={12} md={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={6}>
                  <Fab variant="extended" size="small" onClick={() => this.onTraverse(selectedId, 'out')}>
                    Traverse Out Edges
                    <ArrowForwardIcon/>
                  </Fab>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <Fab variant="extended" size="small" onClick={() => this.onTraverse(selectedId, 'in')}>
                    Traverse In Edges
                    <ArrowBackIcon/>
                  </Fab>
                </Grid>
              </Grid>
            </Grid>
            }
            <Grid item xs={12} sm={12} md={12}>
              <Grid container>
                <Table aria-label="simple table">
                  <TableBody>
                    <TableRow key={'type'}>
                      <TableCell scope="row">Type</TableCell>
                      <TableCell align="left">{String(selectedType)}</TableCell>
                    </TableRow>
                    <TableRow key={'id'}>
                      <TableCell scope="row">ID</TableCell>
                      <TableCell align="left">{String(selectedId)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <JsonToTable json={selectedProperties}/>
              </Grid>
            </Grid>
          </Grid>
          }
        </Grid>
      </div>
  )
}

export const DetailsComponentFun = connect((state)=>{
  return {
    host: state.gremlin.host,
    port: state.gremlin.port,
    network: state.graph.network,
    selectedNode: state.graph.selectedNode,
    selectedEdge: state.graph.selectedEdge,
    queryHistory: state.options.queryHistory,
    nodeLabels: state.options.nodeLabels,
    nodeLimit: state.options.nodeLimit,
    isPhysicsEnabled: state.options.isPhysicsEnabled
  };
})(DetailsFun);