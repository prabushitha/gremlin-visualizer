import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Tooltip,
  Button
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import _ from 'lodash';
import { JsonToTable } from 'react-json-to-table';
import {  COMMON_GREMLIN_ERROR, QUERY_ENDPOINT } from '../../constants';
import axios from "axios";
import { onFetchQuery } from '../../logics/actionHelper';
import { stringifyObjectValues } from '../../logics/utils';
import { graphSelector, graphActions } from '../../slices/graph'
import { gremlinDataSelector, gremlinActions } from '../../slices/gremlin'
import { optionDataSelector, optionActions } from '../../slices/option';


export const Details = () => {
  const dispatch = useDispatch()
  const { network, selectedNode, selectedEdge } = useSelector(graphSelector)
  const { queryHistory, nodeLabels, nodeLimit, isPhysicsEnabled } = useSelector(optionDataSelector)

  let hasSelected = false;
  let selectedType = null;
  let selectedId = null;
  let selectedProperties = null;
  let selectedHeader = null;

  if (!_.isEmpty(selectedNode)) {
    hasSelected = true;
    selectedType = _.get(selectedNode, 'type');
    selectedId = _.get(selectedNode, 'id');
    selectedProperties = _.get(selectedNode, 'properties');
    stringifyObjectValues(selectedProperties);
    selectedHeader = 'Node';
  } else if (!_.isEmpty(selectedEdge)) {
    hasSelected = true;
    selectedType = _.get(selectedEdge, 'type');
    selectedId = _.get(selectedEdge, 'id');
    selectedProperties = _.get(selectedEdge, 'properties');
    selectedHeader = 'Edge';
    stringifyObjectValues(selectedProperties);
  }

  const { host, port, query: queryGlobal } = useSelector(gremlinDataSelector);

  const onAddNodeLabel = () => dispatch(optionActions.addNodeLabel())

  const onEditNodeLabel = (index, nodeLabel) => dispatch(optionActions.editNodeLabel({ id: index, nodeLabel }))

  const onRemoveNodeLabel = (index) => dispatch(optionActions.removeNodeLabel(index))

  const onEditNodeLimit = (limit) => dispatch(optionActions.setNodeLiminit(limit));

  const onRefresh = () => dispatch(graphActions.refreshNodeLabels(nodeLabels));

  const onClearQueryHistory = () => dispatch(optionActions.clearQueryHistory());

  const onQueryClick = (text) => dispatch(gremlinActions.setQuery(text));

  const onTraverse = (nodeId, direction) => {
    const traversal=queryGlobal.split('(')
    const query = `${traversal[0]}('${nodeId}').${direction}()`;
    axios.post(
      QUERY_ENDPOINT,
      { host: host, port: port, query: query, nodeLimit: nodeLimit },
      { headers: { 'Content-Type': 'application/json' } })
      .then((response) => onFetchQuery(response, query, nodeLabels, dispatch))
      .catch((error) => dispatch(gremlinActions.setError(COMMON_GREMLIN_ERROR)));
  }

  const onTogglePhysics = (enabled) => {
    dispatch(optionActions.setIsPhysicsEnabled(enabled));

    if (network) {
      const edges = {
        smooth: {
          type: enabled ? 'dynamic' : 'continuous'
        }
      };
      network.setOptions({ physics: enabled, edges });
    }
  }

  const generateList = (list) => {
    let key = 0;
    return list && list.map(value => {
      key = key + 1;
      return React.cloneElement((
        <ListItem>
          <ListItemText
            onClick={() => onQueryClick(value)}
            primary={value}
            style={{ cursor: 'pointer' }}
          />
        </ListItem>
      ), {
        key
      })
    });
  }

  const generateNodeLabelList = (nodeLabels) => {
    let index = -1;
    return nodeLabels && nodeLabels.map((nodeLabel, i) => {
      nodeLabel = Object.assign([], nodeLabel);
      index = index + 1;
      nodeLabel['index'] = index;
      return React.cloneElement((
        <ListItem>
          <TextField id="standard-basic" label="Node Type" InputLabelProps={{ shrink: true }} value={nodeLabel.type} onChange={event => {
            const type = event.target.value;
            const field = nodeLabel.field;
            onEditNodeLabel(nodeLabel.index, { type, field })
          }}
          />
          <TextField id="standard-basic" label="Label Field" InputLabelProps={{ shrink: true }} value={nodeLabel.field} onChange={event => {
            const field = event.target.value;
            const type = nodeLabel.type;
            onEditNodeLabel(nodeLabel.index, { type, field })
          }} />
          <IconButton aria-label="delete" size="small" onClick={() => onRemoveNodeLabel(nodeLabel.index)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ListItem>
      ), { key: index })
    });
  }



  return (
    <div className={'details'}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography>Query History</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{
                'overflowY': 'auto',
                'overflowX': 'hidden',
                'maxHeight': '200px'
              }}
            >
              <List dense={true}>
                <Button variant="contained" color="primary" onClick={onClearQueryHistory} style={{ 'width': '100px' }} >Clear</Button>
                {generateList(queryHistory)}
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography>Settings</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                  <Tooltip title="Automatically stabilize the graph" aria-label="add">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isPhysicsEnabled}
                          onChange={() => { onTogglePhysics(!isPhysicsEnabled); }}
                          value="physics"
                          color="primary" />
                      }
                      label="Enable Physics" />
                  </Tooltip>
                  <Divider />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Tooltip title="Number of maximum nodes which should return from the query. Empty or 0 has no restrictions." aria-label="add">
                    <TextField label="Node Limit" type="Number" variant="outlined" value={nodeLimit} onChange={event => {
                      const limit = event.target.value;
                      onEditNodeLimit(limit)
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
                    {generateNodeLabelList(nodeLabels)}
                  </List>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Fab variant="extended" color="primary" size="small" onClick={onRefresh}>
                    <RefreshIcon />
                    Refresh
                  </Fab>
                  <Fab variant="extended" size="small" onClick={onAddNodeLabel}>
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
                    <Fab variant="extended" size="small" onClick={() => onTraverse(selectedId, 'out')}>
                      Traverse Out Edges
                      <ArrowForwardIcon />
                    </Fab>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <Fab variant="extended" size="small" onClick={() => onTraverse(selectedId, 'in')}>
                      Traverse In Edges
                      <ArrowBackIcon />
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
                <JsonToTable json={selectedProperties} />
              </Grid>
            </Grid>
          </Grid>
        }
      </Grid>
    </div>
  )
}
