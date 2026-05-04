import * as d3 from "d3";
import { SimulationNode } from "@/app/visualize/core/graphTypes";

export function drag(simulation: d3.Simulation<SimulationNode, undefined>) {
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
      node.fx = event.x;
      node.fy = event.y;
    })
    .on("end", (event, d) => {
      const node = d as SimulationNode;
      if (!event.active) simulation.alphaTarget(0);
      node.fx = null;
      node.fy = null;
    });
}
