import React from 'react';
import {connect} from 'react-redux';
import vis from 'vis-network';
import { ACTIONS } from '../../constants';

class NetworkGraph extends React.Component{
  componentDidMount() {
    const data = {
      nodes: this.props.nodeHolder,
      edges: this.props.edgeHolder
    };
    const network = new vis.Network(this.refs.myRef, data, this.props.networkOptions);

    network.on('selectNode', (params) => {
      const nodeId = params.nodes && params.nodes.length > 0 ? params.nodes[0] : null;
      this.props.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: nodeId });
    });

    network.on("selectEdge", (params) => {
      const edgeId = params.edges && params.edges.length === 1 ? params.edges[0] : null;
      const isNodeSelected = params.nodes && params.nodes.length > 0;
      if (!isNodeSelected && edgeId !== null) {
        this.props.dispatch({ type: ACTIONS.SET_SELECTED_EDGE, payload: edgeId });
      }
    });

    this.props.dispatch({ type: ACTIONS.SET_NETWORK, payload: network });
  }

  render(){
    return (<div ref={'myRef'} className={'mynetwork'} />);
  }
}

export const NetworkGraphComponent = connect((state)=>{
  return {
    nodeHolder: state.graph.nodeHolder,
    edgeHolder: state.graph.edgeHolder,
    networkOptions: state.options.networkOptions
  };
})(NetworkGraph);