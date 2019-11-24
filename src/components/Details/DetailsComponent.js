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
  TableCell
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import _ from 'lodash';
import { JsonToTable } from 'react-json-to-table';
import { ACTIONS } from '../../constants';

class Details extends React.Component {

  onAddNodeLabel() {
    this.props.dispatch({ type: ACTIONS.ADD_NODE_LABEL });
  }

  onEditNodeLabel(index, nodeLabel) {
    this.props.dispatch({ type: ACTIONS.EDIT_NODE_LABEL, payload: { id: index, nodeLabel } });
  }

  onRemoveNodeLabel(index) {
    this.props.dispatch({ type: ACTIONS.REMOVE_NODE_LABEL, payload: index });
  }

  onRefresh() {
    this.props.dispatch({ type: ACTIONS.REFRESH_NODE_LABELS, payload: this.props.nodeLabels });
  }

  generateList(list) {
    let key = 0;
    return list.map(value => {
      key = key+1;
      return React.cloneElement((
        <ListItem>
          <ListItemText
            primary={value}
          />
        </ListItem>
      ), {
        key
      })
    });
  }

  generateNodeLabelList(nodeLabels) {
    let index = -1;
    return nodeLabels.map( nodeLabel => {
      index = index+1;
      return React.cloneElement((
        <ListItem>
          <TextField id="standard-basic" label="Node Type" value={nodeLabel.type} onChange={event => {
            const type = event.target.value;
            const field = nodeLabel.field;
            this.onEditNodeLabel(index, { type, field })
          }}
          />
          <TextField id="standard-basic" label="Label Field" value={nodeLabel.field} onChange={event => {
            const field = event.target.value;
            const type = nodeLabel.type;
            this.onEditNodeLabel(index, { type, field })
          }}/>
          <IconButton aria-label="delete" size="small" onClick={() => this.onRemoveNodeLabel(index)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ListItem>
      ), {
        key: index+1
      })
    });
  }

  render(){
    const hasSelected = !_.isEmpty(this.props.selectedNode) || !_.isEmpty(this.props.selectedEdge);

    const selectedType = (this.props.selectedNode && this.props.selectedNode.type) || (this.props.selectedEdge && this.props.selectedEdge.type);
    const selectedId = (this.props.selectedNode && this.props.selectedNode.id) || (this.props.selectedEdge && this.props.selectedEdge.id);
    const selectedProperties = (this.props.selectedNode && this.props.selectedNode.properties) || (this.props.selectedEdge && this.props.selectedEdge.properties);
    return (
      <div className={'details'}>
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
            <Typography>Node Labels</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={12}>
                <List dense={true}>
                  {this.generateNodeLabelList(this.props.nodeLabels || {})}
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
        {hasSelected && <h2>Information</h2>}
        {hasSelected && <Table aria-label="simple table">
          <TableBody>
            <TableRow key={'type'}>
              <TableCell component="right" scope="row">Type</TableCell>
              <TableCell align="left">{selectedType}</TableCell>
            </TableRow>
            <TableRow key={'id'}>
              <TableCell component="right" scope="row">ID</TableCell>
              <TableCell align="left">{selectedId}</TableCell>
            </TableRow>
          </TableBody>
        </Table>}
        {hasSelected && <JsonToTable json={selectedProperties} />}

      </div>
    );
  }
}

export const DetailsComponent = connect((state)=>{
  return {
    selectedNode: state.graph.selectedNode,
    selectedEdge: state.graph.selectedEdge,
    queryHistory: state.options.queryHistory,
    nodeLabels: state.options.nodeLabels
  };
})(Details);