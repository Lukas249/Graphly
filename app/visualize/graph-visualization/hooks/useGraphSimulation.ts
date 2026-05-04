import { RefObject, useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import _ from "lodash";
import { GraphColors } from "@/app/visualize/core/defaultGraphColors";
import {
  Edge,
  Node,
  SimulationEdge,
  SimulationNode,
} from "@/app/visualize/core/graphTypes";
import { drag } from "@/app/visualize/graph-visualization/d3/drag";
import { handleResize } from "@/app/visualize/graph-visualization/d3/resize";
import { simulationTick } from "@/app/visualize/graph-visualization/d3/tick";
import { addZoomBehavior } from "@/app/visualize/graph-visualization/d3/zoom";

type RefLike<T> = { current: T };

type UseGraphSimulationParams = {
  svgRef: RefLike<SVGSVGElement | null>;
  nodes: SimulationNode[];
  edges: SimulationEdge[];
  colors: GraphColors;
  isNodeSelectionEnabledRef: RefObject<boolean>;
  selectNode: (nodeId: string) => void;
  onNodeClick?: (nodeId: string) => void;
  selectedNodeRef: RefLike<string | null>;
  simulationRef: RefLike<d3.Simulation<SimulationNode, undefined> | null>;
  nodesRef: RefLike<d3.Selection<
    d3.BaseType | SVGCircleElement,
    Node,
    SVGGElement,
    unknown
  > | null>;
  nodesLabelRef: RefLike<d3.Selection<
    d3.BaseType | SVGTextElement,
    Node,
    SVGGElement,
    unknown
  > | null>;
  edgesRef: RefLike<d3.Selection<
    d3.BaseType | SVGPathElement,
    Edge,
    SVGGElement,
    unknown
  > | null>;
  edgesHeadRef: RefLike<d3.Selection<
    SVGPathElement,
    Edge,
    SVGDefsElement,
    unknown
  > | null>;
  edgesLabelsTextPathRef: RefLike<d3.Selection<
    SVGTextPathElement,
    Edge,
    SVGGElement,
    unknown
  > | null>;
};

export function useGraphSimulation({
  svgRef,
  nodes,
  edges,
  colors,
  isNodeSelectionEnabledRef,
  selectNode,
  onNodeClick,
  selectedNodeRef,
  simulationRef,
  nodesRef,
  nodesLabelRef,
  edgesRef,
  edgesHeadRef,
  edgesLabelsTextPathRef,
}: UseGraphSimulationParams) {
  const svgSize = useRef({ width: 0, height: 0 });
  const zoomRef = useRef<{ transform: string }>({ transform: "" });

  const edgeSet = useMemo(
    () => new Set(edges.map((edge) => `${edge.source.id}::${edge.target.id}`)),
    [edges],
  );

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const nodeRadius = 30;

    const svg = d3.select(svgRef.current);

    const container = svg
      .append("g")
      .attr("transform", zoomRef.current?.transform ?? null);

    addZoomBehavior(svg, container, zoomRef);

    const { width, height } = svgRef.current.getBoundingClientRect();

    svgSize.current = { width, height };

    const simulation = d3
      .forceSimulation<SimulationNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<SimulationNode, SimulationEdge>(edges)
          .id((d) => d.id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("collide", d3.forceCollide().radius(2 * nodeRadius));

    simulationRef.current = simulation;

    const handleResizeThrottled = _.throttle(
      handleResize.bind(null, svgRef, simulation, svgSize),
      50,
    );

    const observer = new ResizeObserver(() => {
      handleResizeThrottled();
    });

    observer.observe(svgRef.current);

    const edgesHead = container
      .append("defs")
      .selectAll("marker")
      .data(edges)
      .join("marker")
      .attr("id", (d) =>
        d.directed ? `arrowhead-${d.source.id}-${d.target.id}` : null,
      )
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("refX", 18.6)
      .attr("refY", 3.5)
      .attr("orient", "auto")
      .attr("markerUnits", "strokeWidth")
      .append("path")
      .attr("d", "M0,0 L7,3.5 L0,7 Z")
      .attr("fill", colors.edgeHead);

    const edge = container
      .append("g")
      .attr("stroke-opacity", 1)
      .selectAll("path")
      .data(edges)
      .join("path")
      .attr("stroke-width", 2.5)
      .attr("stroke", colors.edge)
      .attr("id", (d) => `link-${d.source.id}-${d.target.id}`)
      .attr("marker-end", (d) =>
        d.source.id !== d.target.id
          ? `url(#arrowhead-${d.source.id}-${d.target.id})`
          : "",
      );

    const edgeLabels = container
      .append("g")
      .selectAll(".labels")
      .data(edges)
      .join("text")
      .attr("class", "labels")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("dy", (d) => (d.source.id === d.target.id ? -10 : 20))
      .attr("transform", "rotate(45)")
      .style("transform-box", "border-box")
      .style("transform-origin", "center");

    const edgeLabelsTextPath = edgeLabels
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("xlink:href", (d) => `#link-${d.source.id}-${d.target.id}`)
      .attr("fill", colors.edgeLabel)
      .text((d) => (d.weight !== undefined ? d.weight : ""));

    const node = container
      .append("g")
      .attr("stroke", colors.nodeStroke)
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", nodeRadius)
      .attr("fill", colors.nodeFill)
      .call(
        drag(simulation) as (
          selection: d3.Selection<
            d3.BaseType | SVGCircleElement,
            SimulationNode,
            SVGGElement,
            unknown
          >,
        ) => void,
      );

    const nodeLabel = container
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("style", "user-select: none")
      .attr("dy", 4)
      .attr("fill", colors.nodeLabel)
      .call(
        drag(simulation) as (
          selection: d3.Selection<
            d3.BaseType | SVGCircleElement,
            SimulationNode,
            SVGGElement,
            unknown
          >,
        ) => void,
      );

    nodesRef.current = node as unknown as typeof nodesRef.current;
    nodesLabelRef.current =
      nodeLabel as unknown as typeof nodesLabelRef.current;
    edgesRef.current = edge;
    edgesHeadRef.current = edgesHead;
    edgesLabelsTextPathRef.current = edgeLabelsTextPath;

    simulation.on(
      "tick",
      simulationTick.bind(null, node, nodeLabel, edge, edgeLabels, edgeSet),
    );

    if (isNodeSelectionEnabledRef.current || onNodeClick) {
      node.on("click", (event, d) => {
        if (isNodeSelectionEnabledRef.current) {
          selectNode(d.id);
        }
        onNodeClick?.(d.id);
      });

      nodeLabel.on("click", (event, d) => {
        if (isNodeSelectionEnabledRef.current) {
          selectNode(d.id);
        }
        onNodeClick?.(d.id);
      });

      if (isNodeSelectionEnabledRef.current) {
        selectNode(selectedNodeRef.current ?? "");
      }
    }

    return () => {
      svg.selectAll("*").remove();
      observer.disconnect();
    };
  }, [
    svgRef,
    nodes,
    edges,
    colors,
    edgeSet,
    isNodeSelectionEnabledRef,
    selectNode,
    onNodeClick,
    selectedNodeRef,
    simulationRef,
    nodesRef,
    nodesLabelRef,
    edgesRef,
    edgesHeadRef,
    edgesLabelsTextPathRef,
  ]);
}
