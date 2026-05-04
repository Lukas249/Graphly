import * as d3 from "d3";
import {
  SimulationEdge,
  SimulationNode,
} from "@/app/visualize/core/graphTypes";

export function simulationTick(
  node: d3.Selection<
    d3.BaseType | SVGCircleElement,
    SimulationNode,
    SVGGElement,
    unknown
  >,
  nodeLabel: d3.Selection<
    d3.BaseType | SVGTextElement,
    SimulationNode,
    SVGGElement,
    unknown
  >,
  edge: d3.Selection<
    d3.BaseType | SVGPathElement,
    SimulationEdge,
    SVGGElement,
    unknown
  >,
  edgeLabels: d3.Selection<
    d3.BaseType | SVGTextElement,
    SimulationEdge,
    SVGGElement,
    unknown
  >,
  edgesSet: Set<string>,
) {
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

    const hasReverseEdge = edgesSet.has(`${target.id}::${source.id}`);

    if (!hasReverseEdge) return `M${sx},${sy} L${tx},${ty}`;

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
}
