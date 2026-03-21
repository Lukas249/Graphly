"use client";

import { useImperativeHandle, useRef, RefObject, useMemo } from "react";
import * as d3 from "d3";
import _ from "lodash";
import {
  Edge,
  Node,
  GraphHandle,
  Markings,
  SimulationNode,
  SimulationEdge,
} from "./core/graphTypes";
import { GraphColors, graphColors } from "./core/defaultGraphColors";
import { useGraphHandle } from "./graph-visualization/hooks/useGraphHandle";
import { useGraphSimulation } from "./graph-visualization/hooks/useGraphSimulation";

export default function GraphVisualization({
  graphNodes,
  graphEdges,
  ref,
  className,
  customColors = graphColors,
  isNodeSelectionEnabled = true,
}: {
  graphNodes: Node[];
  graphEdges: Edge[];
  ref: RefObject<GraphHandle | null>;
  className?: string;
  customColors?: Partial<GraphColors>;
  isNodeSelectionEnabled: boolean;
}) {
  const nodes: SimulationNode[] = _.cloneDeep(graphNodes);
  const edges: SimulationEdge[] = _.cloneDeep(graphEdges);

  const colors = useMemo(
    () => ({ ...graphColors, ...customColors }),
    [customColors],
  );

  for (const edge of edges) {
    edge.source = edge.source.id as Node & (string | number | SimulationNode);
    edge.target = edge.target.id as Node & (string | number | SimulationNode);
  }

  const reverseEdgeSet = useMemo(
    () =>
      new Set(graphEdges.map((edge) => `${edge.source.id}::${edge.target.id}`)),
    [graphEdges],
  );

  const defaultMarkings: Markings = useMemo(() => {
    const currentDefaultMarkings: Markings = {
      nodes: {},
      edges: {},
    };

    for (const node of graphNodes) {
      currentDefaultMarkings.nodes[node.id] = {
        fill: colors.nodeFill,
        stroke: colors.nodeStroke,
        label: colors.nodeLabel,
      };
    }

    for (const edge of graphEdges) {
      if (!currentDefaultMarkings.edges[edge.source.id])
        currentDefaultMarkings.edges[edge.source.id] = {};
      if (!currentDefaultMarkings.edges[edge.target.id])
        currentDefaultMarkings.edges[edge.target.id] = {};

      currentDefaultMarkings.edges[edge.source.id][edge.target.id] = {
        fill: colors.edge,
        head: colors.edgeHead,
        label: colors.edgeLabel,
      };
      currentDefaultMarkings.edges[edge.target.id][edge.source.id] = {
        fill: colors.edge,
        head: colors.edgeHead,
        label: colors.edgeLabel,
      };
    }

    return currentDefaultMarkings;
  }, [graphNodes, graphEdges, colors]);

  const svgRef = useRef<SVGSVGElement>(null);

  const nodesRef =
    useRef<
      d3.Selection<d3.BaseType | SVGCircleElement, Node, SVGGElement, unknown>
    >(null);
  const nodesLabelRef =
    useRef<
      d3.Selection<d3.BaseType | SVGTextElement, Node, SVGGElement, unknown>
    >(null);
  const edgesRef =
    useRef<
      d3.Selection<d3.BaseType | SVGPathElement, Edge, SVGGElement, unknown>
    >(null);
  const edgesHeadRef =
    useRef<d3.Selection<SVGPathElement, Edge, SVGDefsElement, unknown>>(null);
  const edgesLabelsTextPathRef =
    useRef<d3.Selection<SVGTextPathElement, Edge, SVGGElement, unknown>>(null);

  const simulationRef = useRef<d3.Simulation<SimulationNode, undefined>>(null);

  const {
    selectedNodeRef,
    getDefaultMarkings,
    getMarkings,
    setMarkings,
    markNode,
    markEdge,
    resetMarks,
    transpose,
    selectNode,
    getSelectedNode,
  } = useGraphHandle({
    defaultMarkings,
    colors,
    edges,
    simulationRef,
    refs: {
      nodesRef,
      nodesLabelRef,
      edgesRef,
      edgesHeadRef,
      edgesLabelsTextPathRef,
    },
    initialSelectedNode: graphNodes.length > 0 ? graphNodes[0].id : null,
  });

  useGraphSimulation({
    svgRef,
    nodes,
    edges,
    colors,
    reverseEdgeSet,
    isNodeSelectionEnabled,
    selectNode,
    selectedNodeRef,
    simulationRef,
    nodesRef,
    nodesLabelRef,
    edgesRef,
    edgesHeadRef,
    edgesLabelsTextPathRef,
  });

  useImperativeHandle(ref, () => ({
    markNode,
    markEdge,
    resetMarks,
    transpose,
    getMarkings,
    setMarkings,
    getDefaultMarkings,
    getSelectedNode,
    selectNode,
  }));

  return <svg className={className} ref={svgRef}></svg>;
}
