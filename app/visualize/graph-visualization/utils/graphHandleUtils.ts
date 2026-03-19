import * as d3 from "d3";
import { GraphColors } from "../../core/defaultGraphColors";
import { Edge, Markings, Node } from "../../core/GraphTypes";

type RefLike<T> = { current: T };

type NodeSelection = d3.Selection<
  d3.BaseType | SVGCircleElement,
  Node,
  SVGGElement,
  unknown
>;

type NodeLabelSelection = d3.Selection<
  d3.BaseType | SVGTextElement,
  Node,
  SVGGElement,
  unknown
>;

type EdgeSelection = d3.Selection<
  d3.BaseType | SVGPathElement,
  Edge,
  SVGGElement,
  unknown
>;

type EdgeHeadSelection = d3.Selection<
  SVGPathElement,
  Edge,
  SVGDefsElement,
  unknown
>;

type EdgeLabelPathSelection = d3.Selection<
  SVGTextPathElement,
  Edge,
  SVGGElement,
  unknown
>;

export type GraphHandleRefs = {
  markingsRef: RefLike<Markings>;
  nodesRef: RefLike<NodeSelection | null>;
  nodesLabelRef: RefLike<NodeLabelSelection | null>;
  edgesRef: RefLike<EdgeSelection | null>;
  edgesHeadRef: RefLike<EdgeHeadSelection | null>;
  edgesLabelsTextPathRef: RefLike<EdgeLabelPathSelection | null>;
};

export function applyNodeMark(
  refs: GraphHandleRefs,
  {
    nodeId,
    nodeColor,
    strokeColor,
    nodeLabelColor,
  }: {
    nodeId: string;
    nodeColor: string;
    strokeColor: string;
    nodeLabelColor: string;
  },
) {
  refs.markingsRef.current.nodes[nodeId] = {
    fill: nodeColor,
    stroke: strokeColor,
    label: nodeLabelColor,
  };

  refs.nodesRef.current
    ?.filter((d) => d.id === nodeId)
    .transition()
    .duration(300)
    .attr("fill", nodeColor)
    .attr("stroke", strokeColor);

  refs.nodesLabelRef.current
    ?.filter((d) => d.id === nodeId)
    .attr("fill", nodeLabelColor);
}

export function applyDirectedEdgeMark(
  refs: GraphHandleRefs,
  {
    sourceId,
    destinationId,
    edgeColor,
    edgeLabelColor,
    edgeHeadColor,
  }: {
    sourceId: string;
    destinationId: string;
    edgeColor: string;
    edgeLabelColor: string;
    edgeHeadColor: string;
  },
) {
  if (!refs.markingsRef.current.edges[sourceId]) {
    refs.markingsRef.current.edges[sourceId] = {};
  }

  refs.markingsRef.current.edges[sourceId][destinationId] = {
    fill: edgeColor,
    head: edgeHeadColor,
    label: edgeHeadColor,
  };

  refs.edgesRef.current
    ?.filter((d) => d.source.id === sourceId && d.target.id === destinationId)
    .transition()
    .duration(300)
    .attr("stroke", edgeColor);

  refs.edgesLabelsTextPathRef.current
    ?.filter((d) => d.source.id === sourceId && d.target.id === destinationId)
    .transition()
    .duration(300)
    .attr("fill", edgeLabelColor);

  refs.edgesHeadRef.current
    ?.filter((d) => d.source.id === sourceId && d.target.id === destinationId)
    .transition()
    .duration(300)
    .attr("fill", edgeHeadColor);
}

export function resetGraphMarks(
  refs: GraphHandleRefs,
  colors: GraphColors,
  defaultMarkings: Markings,
) {
  refs.nodesRef.current
    ?.attr("stroke", colors.nodeStroke)
    .attr("fill", colors.nodeFill);

  refs.nodesLabelRef.current?.attr("fill", colors.nodeLabel);

  refs.edgesRef.current?.attr("stroke", colors.edge);

  refs.edgesHeadRef.current?.attr("fill", colors.edgeHead);

  refs.edgesLabelsTextPathRef.current?.attr("fill", colors.edgeLabel);

  refs.markingsRef.current = defaultMarkings;
}
