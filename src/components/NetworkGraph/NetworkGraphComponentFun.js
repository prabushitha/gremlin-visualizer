import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import vis from 'vis-network';
import { ACTIONS } from '../../constants';



const NetworkGraphFun = (props) => {
  const myRef = useRef(null)

  useEffect(() => {
    const data = {
      nodes: props.nodeHolder,
      edges: props.edgeHolder
    };

    const network = new vis.Network(myRef.current, data, props.networkOptions); //this do usuniecia?

    network.on('selectNode', (params) => {
      const nodeId = params.nodes && params.nodes.length > 0 ? params.nodes[0] : null;
      props.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: nodeId });
    });

    network.on("selectEdge", (params) => {
      const edgeId = params.edges && params.edges.length === 1 ? params.edges[0] : null;
      const isNodeSelected = params.nodes && params.nodes.length > 0;
      if (!isNodeSelected && edgeId !== null) {
        props.dispatch({ type: ACTIONS.SET_SELECTED_EDGE, payload: edgeId });
      }
    });

    props.dispatch({ type: ACTIONS.SET_NETWORK, payload: network });
  }, [])

  return (
    <div ref={myRef} className={'mynetwork'} />
  )
}


export const NetworkGraphComponentFun = connect((state) => {
  return {
    nodeHolder: state.graph.nodeHolder,
    edgeHolder: state.graph.edgeHolder,
    networkOptions: state.options.networkOptions
  };
})(NetworkGraphFun);