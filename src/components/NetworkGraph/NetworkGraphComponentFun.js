import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import vis from 'vis-network';
import { ACTIONS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { graphSelector } from '../../slices/graph'
import { graphActions } from '../../slices/graph'



const NetworkGraphFun = (props) => {
  const dispatch = useDispatch()
  const { nodeHolder, edgeHolder } = useSelector(graphSelector)

  const myRef = useRef(null)

  useEffect(() => {
    const data = {
      nodes: nodeHolder,
      edges: edgeHolder
    };

    const network = new vis.Network(myRef.current, data, props.networkOptions); //this do usuniecia?

    network.on('selectNode', (params) => {
      const nodeId = params.nodes && params.nodes.length > 0 ? params.nodes[0] : null;
      dispatch(graphActions.setSelectedNode(nodeId))
      // props.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: nodeId });
    });

    network.on("selectEdge", (params) => {
      const edgeId = params.edges && params.edges.length === 1 ? params.edges[0] : null;
      const isNodeSelected = params.nodes && params.nodes.length > 0;
      if (!isNodeSelected && edgeId !== null) {
        dispatch(graphActions.setSelectedEdge(edgeId))
        // props.dispatch({ type: ACTIONS.SET_SELECTED_EDGE, payload: edgeId });
      }
    });

    dispatch(graphActions.setNetwork(network))
    // props.dispatch({ type: ACTIONS.SET_NETWORK, payload: network });
  }, [])

  return (
    <div ref={myRef} className={'mynetwork'} />
  )
}


export const NetworkGraphComponentFun = connect((state) => {
  return {
    // nodeHolder: state.graph.nodeHolder,
    // edgeHolder: state.graph.edgeHolder,
    networkOptions: state.options.networkOptions
  };
})(NetworkGraphFun);