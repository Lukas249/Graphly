import { useEffect, useRef } from "react";
import * as d3 from "d3";
import _ from "lodash";
import { GraphColors } from "@/app/visualize/core/defaultGraphColors";
import {
  Edge,
  Node,
  SimulationEdge,
  SimulationNode,
} from "@/app/visualize/core/graphTypes";

type RefLike<T> = { current: T };

type UseGraphSimulationParams = {
  svgRef: RefLike<SVGSVGElement | null>;
  nodes: SimulationNode[];
  edges: SimulationEdge[];
  colors: GraphColors;
  reverseEdgeSet: Set<string>;
  isNodeSelectionEnabled: boolean;
  selectNode: (nodeId: string) => void;
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
}: UseGraphSimulationParams) {
  const svgSize = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const svg = d3.select(svgRef.current);

    const { width, height } = svgRef.current.getBoundingClientRect();

    svgSize.current = { width, height };

    function boundingBoxForce(width: number, height: number, radius: number) {
      return () => {
        for (const node of nodes) {
          node.x = _.clamp(node.x ?? 0, radius, width - radius);
          node.y = _.clamp(node.y ?? 0, radius, height - radius);
        }
      };
    }

    const nodeRadius = 30;

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
      .force("collide", d3.forceCollide().radius(60));

    simulationRef.current = simulation;

    const handleResize = () => {
      if (!svgRef.current) return;

      const { width, height } = svgRef.current.getBoundingClientRect();

      svgSize.current = { width, height };

      simulation
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("bounding-box", boundingBoxForce(width, height, nodeRadius));
      simulation.restart();
    };

    const handleResizeThrottled = _.throttle(handleResize, 50);

    const observer = new ResizeObserver(() => {
      handleResizeThrottled();
    });

    observer.observe(svgRef.current);

    const edgesHead = svg
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

    const edge = svg
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

    const edgeLabels = svg
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

    const node = svg
      .append("g")
      .attr("stroke", colors.nodeStroke)
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 30)
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

    const nodeLabel = svg
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

    simulation.on("tick", () => {
      edge.attr("d", (d) => {
        const source = d.source as SimulationNode;
        const target = d.target as SimulationNode;

        if (source.id === target.id) {
          const x1 = source.x ?? 0;
          const y1 = source.y ?? 0;
          const x2 = (target.x ?? 0) + 1;
          const y2 = (target.y ?? 0) + 1;

          const xRotation = -45;

          const largeArc = 1;

          const sweep = 1;

          const drx = 40;
          const dry = 30;

          return (
            "M" +
            x1 +
            "," +
            y1 +
            "A" +
            drx +
            "," +
            dry +
            " " +
            xRotation +
            "," +
            largeArc +
            "," +
            sweep +
            " " +
            x2 +
            "," +
            y2
          );
        }

        const sx = source.x ?? 0,
          sy = source.y ?? 0;
        const tx = target.x ?? 0,
          ty = target.y ?? 0;

        const rev = reverseEdgeSet.has(`${target.id}::${source.id}`);

        if (!rev) return `M${sx},${sy} L${tx},${ty}`;

        const dx = tx - sx;
        const dy = ty - sy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const nx = -dy / dist;
        const ny = dx / dist;

        const off = 7;

        const ox = nx * off;
        const oy = ny * off;

        return `M${sx + ox},${sy + oy} L${tx + ox},${ty + oy}`;
      });

      edgeLabels.attr("transform", (d) => {
        const source = d.source as SimulationNode;
        const target = d.target as SimulationNode;

        const x1 = source.x ?? 0,
          y1 = source.y ?? 0;
        const x2 = target.x ?? 0,
          y2 = target.y ?? 0;

        const angle = Math.atan2(y2 - y1, x2 - x1);

        if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
          return "rotate(180)";
        }

        return "rotate(0)";
      });

      node.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);

      nodeLabel.attr("x", (d) => d.x ?? 0).attr("y", (d) => d.y ?? 0);
    });

    function drag(simulation: d3.Simulation<SimulationNode, undefined>) {
      return d3
        .drag()
        .on("start", (event, d) => {
          const node = d as SimulationNode;
          if (!event.active) simulation.alphaTarget(0.3).restart();
          node.fx = node.x;
          node.fy = node.y;
        })
        .on("drag", (event, d) => {
          const node = d as SimulationNode;
          node.fx = _.clamp(
            event.x,
            nodeRadius,
            svgSize.current.width - nodeRadius,
          );
          node.fy = _.clamp(
            event.y,
            nodeRadius,
            svgSize.current.height - nodeRadius,
          );
        })
        .on("end", (event, d) => {
          const node = d as SimulationNode;
          if (!event.active) simulation.alphaTarget(0);
          node.fx = null;
          node.fy = null;
        });
    }

    if (isNodeSelectionEnabled) {
      node.on("click", (event, d) => {
        selectNode(d.id);
      });

      nodeLabel.on("click", (event, d) => {
        selectNode(d.id);
      });

      selectNode(selectedNodeRef.current ?? "");
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
  ]);
}
