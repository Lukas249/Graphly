import { RefObject } from "react";
import * as d3 from "d3";
import { SimulationNode } from "@/app/visualize/core/graphTypes";

export function handleResize(
  svgRef: RefObject<SVGSVGElement | null>,
  simulation: d3.Simulation<SimulationNode, undefined>,
  svgSize: RefObject<{ width: number; height: number }>,
) {
  if (!svgRef.current) return;

  const { width, height } = svgRef.current.getBoundingClientRect();

  svgSize.current = { width, height };

  simulation.force("center", d3.forceCenter(width / 2, height / 2));

  simulation.restart();
}
