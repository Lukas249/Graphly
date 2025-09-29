"use client"

import { useEffect, useImperativeHandle, useRef, RefObject, useMemo } from "react";
import * as d3 from "d3";
import _ from "lodash"
import { Edge, Node, GraphHandle } from "./GraphTypes";
import { SimulationNodeDatum, SimulationLinkDatum, Simulation } from "d3-force";
import { GraphColors, graphColors } from "./defaultGraphColors";

type D3 = typeof d3;

function onResize(svg: SVGElement, d3: D3, simulation: Simulation<SimulationNode, undefined>) {
    const { width, height } = svg.getBoundingClientRect();
    simulation.force("center", d3.forceCenter(width / 2, height / 2))
    simulation.restart();
}

type SimulationNode = Node & SimulationNodeDatum
type SimulationEdge = Edge & SimulationLinkDatum<SimulationNode>

export default function GraphVisualization(
    {graphNodes, graphEdges, ref, className, customColors = graphColors} : 
    {graphNodes: Node[], graphEdges: Edge[], ref: RefObject<GraphHandle | null>, className?: string, customColors?: Partial<GraphColors>}
) {
    const nodes: SimulationNode[] = _.cloneDeep(graphNodes)
    const edges: SimulationEdge[] = _.cloneDeep(graphEdges)

    const colors = useMemo(() => ({ ...graphColors, ...customColors }), [customColors]);

    for(const edge of edges) {
        edge.source = edge.source.id as Node & (string | number | SimulationNode)
        edge.target = edge.target.id as Node & (string | number | SimulationNode)
    }

    const svgRef = useRef<SVGSVGElement>(null);
   
    const nodesRef = useRef<d3.Selection<d3.BaseType | SVGCircleElement, Node, SVGGElement, unknown>>(null);
    const nodesLabelRef = useRef<d3.Selection<d3.BaseType | SVGTextElement, Node, SVGGElement, unknown>>(null);
    const edgesRef = useRef<d3.Selection<d3.BaseType | SVGPathElement, Edge, SVGGElement, unknown>>(null);
    const edgesHeadRef = useRef<d3.Selection<SVGPathElement, Edge, SVGDefsElement, unknown>>(null);
    const edgesLabelsTextPathRef = useRef<d3.Selection<SVGTextPathElement, Edge, SVGGElement, unknown>>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        
        const { width, height } = svgRef.current!.getBoundingClientRect();

        function boundingBoxForce(width: number, height: number, radius: number) {
            return () => {
                for (const node of nodes) {
                    node.x = Math.max(radius, Math.min(width - radius, node.x ?? 0));
                    node.y = Math.max(radius, Math.min(height - radius, node.y ?? 0));
                }
            };
        }

        const nodeRadius = 30
    
        const simulation = d3.forceSimulation<SimulationNode>(nodes)
            .force("link", d3.forceLink<SimulationNode, SimulationEdge>(edges).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(60))
            .force("bounding-box", boundingBoxForce(width, height, nodeRadius))
        
        window.addEventListener("resize", _.debounce(onResize.bind(null, svgRef.current!, d3, simulation), 200))
    
        const edgesHead = 
                svg.append("defs")
                    .selectAll("marker")
                    .data(edges)
                    .join("marker")
                    .attr("id", d => d.directed ? `arrowhead-${d.source.id}-${d.target.id}` : null)
                    .attr("markerWidth", 7)
                    .attr("markerHeight", 7)
                    .attr("refX", 18.6)
                    .attr("refY", 3.5)
                    .attr("orient", "auto")
                    .attr("markerUnits", "strokeWidth")
                    .append("path")
                    .attr("d", "M0,0 L7,3.5 L0,7 Z")
                    .attr("fill", colors.edgeHead);
    
        const edge = svg.append("g")
            .attr("stroke-opacity", 1)
            .selectAll("path")
            .data(edges)
            .join("path")
            .attr("stroke-width", 2.5)
            .attr("stroke", colors.edge)
            .attr("id", d => `link-${d.source.id}-${d.target.id}`)
            .attr("marker-end", d => `url(#arrowhead-${d.source.id}-${d.target.id})`);

        const edgeLabels = svg.append("g")
            .selectAll(".labels")
            .data(edges)
            .join("text")
            .attr("class", "labels")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("dy", -10)
            .attr("transform", "rotate(45)")
            .style("transform-box", "border-box")
            .style("transform-origin", "center");
        
        const edgeLabelsTextPath = edgeLabels.append("textPath")
            .attr("startOffset", "50%")
            .attr("xlink:href", d => `#link-${d.source.id}-${d.target.id}`)
            .attr("fill", colors.edgeLabel)
            .text(d => d.weight !== undefined ? d.weight : "");
    
        const node = svg.append("g")
            .attr("stroke", colors.nodeStroke)
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 30)
            .attr("fill", colors.nodeFill)
            .call(drag(simulation) as (selection: d3.Selection<d3.BaseType | SVGCircleElement, SimulationNode, SVGGElement, unknown>) => void);
    
        const nodeLabel = svg.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .attr("style", "user-select: none")
            .attr("dy", 4)
            .attr("fill", colors.nodeLabel)
            .call(drag(simulation) as (selection: d3.Selection<d3.BaseType | SVGCircleElement, SimulationNode, SVGGElement, unknown>) => void);

        nodesRef.current = node
        nodesLabelRef.current = nodeLabel
        edgesRef.current = edge
        edgesHeadRef.current = edgesHead
        edgesLabelsTextPathRef.current = edgeLabelsTextPath

    
        simulation.on("tick", () => {
            edge.attr("d", d => {
                const source = d.source as SimulationNode
                const target = d.target as SimulationNode

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

                    return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
                }

                return `M${source.x},${source.y} L${target.x},${target.y}`
            });

            edgeLabels.attr("transform", d => {
                const source = d.source as SimulationNode
                const target = d.target as SimulationNode

                const x1 = source.x ?? 0, y1 = source.y ?? 0;
                const x2 = target.x ?? 0, y2 = target.y ?? 0;

                const angle = Math.atan2(y2 - y1, x2 - x1);

                if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
                    return "rotate(180)";
                }

                return "rotate(0)"
            });
    
            node
            .attr("cx", d => (d.x ?? 0))
            .attr("cy", d => (d.y ?? 0));
    
            nodeLabel
            .attr("x", d => (d.x ?? 0))
            .attr("y", d => (d.y ?? 0));
        });
    
        function drag(simulation: Simulation<SimulationNode, undefined>) {
            return d3.drag()
                .on("start", (event, d) => {
                    const node = d as SimulationNode
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    node.fx = node.x;
                    node.fy = node.y;
                })
                .on("drag", (event, d) => {
                    const node = d as SimulationNode
                    node.fx = event.x;
                    node.fy = event.y;
                })
                .on("end", (event, d) => {
                    const node = d as SimulationNode
                    if (!event.active) simulation.alphaTarget(0);
                    node.fx = null;
                    node.fy = null;
                });
        }
    
        const adjacency: {[key: string]: string[]} = {};
        nodes.forEach(n => {
            adjacency[n.id] = []
        });
        edges.forEach(edge => {
            adjacency[edge.source.id].push(edge.target.id);
            adjacency[edge.target.id].push(edge.source.id);
        });

    }, [nodes, edges, colors])

   
    function markNode(
        nodeId: string, 
        nodeColor = colors.markedNodeFill, 
        strokeColor = colors.markedNodeStroke, 
        nodeLabelColor = colors.markedNodeLabel
    ) {
        nodesRef.current
            ?.filter(d => d.id === nodeId)
            .transition()
            .duration(300)
            .attr("fill", nodeColor)
            .attr("stroke", strokeColor)
        
        nodesLabelRef.current
            ?.filter(d => d.id === nodeId)
            .attr("fill", nodeLabelColor);
    }

    function markEdge(
        sourceId: string, 
        destinationId: string, 
        edgeColor = colors.markedEdge, 
        edgeLabelColor = colors.markedEdgeLabel, 
        edgeHeadColor = colors.markedEdgeHead
    ) {
        edgesRef.current
            ?.filter(d => d.source.id === sourceId && d.target.id === destinationId)
            .transition()
            .duration(300)
            .attr("stroke", edgeColor);

        edgesLabelsTextPathRef.current
            ?.filter(d => d.source.id === sourceId && d.target.id === destinationId)
            .transition()
            .duration(300)
            .attr("fill", edgeLabelColor);

        edgesHeadRef.current
            ?.filter(d => d.source.id === sourceId && d.target.id === destinationId)
            .transition()
            .duration(300)
            .attr("fill", edgeHeadColor);
    }

    function resetMarks() {
        nodesRef.current
            ?.attr("stroke", colors.nodeStroke)
            .attr("fill", colors.nodeFill)

        nodesLabelRef.current
            ?.attr("fill", colors.nodeLabel);

        edgesRef.current
            ?.attr("stroke", colors.edge)

        edgesHeadRef.current
                ?.attr("fill", colors.edgeHead);

        edgesLabelsTextPathRef.current
            ?.attr("fill", colors.edgeLabel);
    }

    useImperativeHandle(ref, () => ({markNode, markEdge, resetMarks}))

    return (
        <svg className={className} ref={svgRef}></svg>
    )
}