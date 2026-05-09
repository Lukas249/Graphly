import * as d3 from "d3";
import { RefObject } from "react";

export function addZoomBehavior(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  zoomRef: RefObject<{ transform: string }>,
) {
  const zoom = d3.zoom().on("zoom", (event) => {
    container.attr("transform", event.transform);
    zoomRef.current.transform = event.transform;
  });

  svg.call(zoom as any).on("dblclick.zoom", null);
}
