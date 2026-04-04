import { useEffect, useRef } from "react";
import * as d3 from "d3";
import _ from "lodash";
import { GraphColors } from "@/app/visualize/core/defaultGraphColors";
import {
  MarkDirectedEdgeProps,
  MarkEdgeProps,
  MarkNodeProps,
  Markings,
  SimulationEdge,
  SimulationNode,
} from "@/app/visualize/core/graphTypes";
import {
  applyDirectedEdgeMark,
  applyNodeMark,
  GraphHandleRefs,
  resetGraphMarks,
} from "../utils/graphHandleUtils";

type UseGraphHandleParams = {
  defaultMarkings: Markings;
  colors: GraphColors;
  edges: SimulationEdge[];
  simulationRef: { current: d3.Simulation<SimulationNode, undefined> | null };
  refs: Omit<GraphHandleRefs, "markingsRef">;
  initialSelectedNode: string | null;
};

export function useGraphHandle({
  defaultMarkings,
  colors,
  edges,
  simulationRef,
  refs,
  initialSelectedNode,
}: UseGraphHandleParams) {
  const markingsRef = useRef<Markings>(_.cloneDeep(defaultMarkings));
  const selectedNodeRef = useRef<string | null>(initialSelectedNode);

  useEffect(() => {
    markingsRef.current = _.cloneDeep(defaultMarkings);
  }, [defaultMarkings]);

  useEffect(() => {
    selectedNodeRef.current = initialSelectedNode;
  }, [initialSelectedNode]);

  const graphRefs: GraphHandleRefs = {
    markingsRef,
    ...refs,
  };

  function getDefaultMarkings() {
    return _.cloneDeep(defaultMarkings);
  }

  function getMarkings() {
    return _.cloneDeep(markingsRef.current);
  }

  function markNode({
    nodeId,
    nodeColor = colors.markedNodeFill,
    strokeColor = colors.markedNodeStroke,
    nodeLabelColor = colors.markedNodeLabel,
  }: MarkNodeProps) {
    applyNodeMark(graphRefs, {
      nodeId,
      nodeColor,
      strokeColor,
      nodeLabelColor,
    });
  }

  function markDirectedEdge({
    sourceId,
    destinationId,
    edgeColor = colors.markedEdge,
    edgeLabelColor = colors.markedEdgeLabel,
    edgeHeadColor = colors.markedEdgeHead,
  }: MarkDirectedEdgeProps) {
    applyDirectedEdgeMark(graphRefs, {
      sourceId,
      destinationId,
      edgeColor,
      edgeLabelColor,
      edgeHeadColor,
    });
  }

  function markEdge({
    sourceId,
    destinationId,
    directed = true,
    edgeColor = colors.markedEdge,
    edgeLabelColor = colors.markedEdgeLabel,
    edgeHeadColor = colors.markedEdgeHead,
  }: MarkEdgeProps) {
    if (directed) {
      markDirectedEdge({
        sourceId,
        destinationId,
        edgeColor,
        edgeLabelColor,
        edgeHeadColor,
      });
    } else {
      markDirectedEdge({
        sourceId,
        destinationId,
        edgeColor,
        edgeLabelColor,
        edgeHeadColor,
      });
      markDirectedEdge({
        sourceId: destinationId,
        destinationId: sourceId,
        edgeColor,
        edgeLabelColor,
        edgeHeadColor,
      });
    }
  }

  function setMarkings(markingsToApply: Markings) {
    markingsRef.current = _.cloneDeep(markingsToApply);

    for (const [nodeId, nodeMarkings] of Object.entries(
      markingsToApply.nodes,
    )) {
      markNode({
        nodeId,
        nodeColor: nodeMarkings.fill,
        strokeColor: nodeMarkings.stroke,
        nodeLabelColor: nodeMarkings.label,
      });
    }

    for (const [sourceId, edge] of Object.entries(markingsToApply.edges)) {
      for (const [destinationId, edgeMarkings] of Object.entries(edge)) {
        markEdge({
          sourceId,
          destinationId,
          edgeColor: edgeMarkings.fill,
          edgeHeadColor: edgeMarkings.head,
          edgeLabelColor: edgeMarkings.label,
        });
      }
    }
  }

  function selectNode(nodeId: string) {
    if (selectedNodeRef.current && selectedNodeRef.current !== nodeId) {
      markNode({
        nodeId: selectedNodeRef.current,
        nodeColor: colors.nodeFill,
        nodeLabelColor: colors.nodeLabel,
        strokeColor: colors.nodeStroke,
      });
    }

    markNode({
      nodeId,
      nodeColor: colors.markedNodeFill,
      nodeLabelColor: colors.markedNodeLabel,
      strokeColor: colors.markedNodeStroke,
    });

    selectedNodeRef.current = nodeId;
  }

  function getSelectedNode() {
    return selectedNodeRef.current;
  }

  function resetMarks() {
    resetGraphMarks(graphRefs, colors, getDefaultMarkings());
  }

  function transpose() {
    for (const edge of edges) {
      [edge.source, edge.target] = [edge.target, edge.source];
    }

    simulationRef.current?.force(
      "link",
      d3
        .forceLink<SimulationNode, SimulationEdge>(edges)
        .id((d) => d.id)
        .distance(150),
    );
    simulationRef.current?.alpha(0).restart();
  }

  return {
    markingsRef,
    selectedNodeRef,
    getDefaultMarkings,
    getMarkings,
    setMarkings,
    markNode,
    markDirectedEdge,
    markEdge,
    resetMarks,
    transpose,
    selectNode,
    getSelectedNode,
  };
}
