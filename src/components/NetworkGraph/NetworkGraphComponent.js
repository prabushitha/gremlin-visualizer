import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import vis from 'vis-network';
import { graphActions, graphSelector } from '../../slices/graph'
import { optionDataSelector } from '../../slices/option';

export const NetworkGraph = () => {
  const dispatch = useDispatch()
  const { nodeHolder, edgeHolder } = useSelector(graphSelector)
  const { networkOptions } = useSelector(optionDataSelector)

  const myRef = useRef(null)

  useEffect(() => {
    const data = {
      nodes: nodeHolder,
      edges: edgeHolder
    };
    const network = new vis.Network(myRef.current, data, networkOptions); 

    network.on('selectNode', (params) => {
      const nodeId = params.nodes && params.nodes.length > 0 ? params.nodes[0] : null;
      dispatch(graphActions.setSelectedNode(nodeId))
    });

    network.on("selectEdge", (params) => {
      const edgeId = params.edges && params.edges.length === 1 ? params.edges[0] : null;
      const isNodeSelected = params.nodes && params.nodes.length > 0;
      if (!isNodeSelected && edgeId !== null) {
        dispatch(graphActions.setSelectedEdge(edgeId))
      }
    });
    dispatch(graphActions.setNetwork(network))
  }, [])

  return (
    <div ref={myRef} className={'mynetwork'} />
  )
}
