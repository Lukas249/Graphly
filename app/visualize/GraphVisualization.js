"use client"

import { useEffect, useImperativeHandle, useRef } from "react";
import * as d3 from "d3";
import _ from "lodash"

function onResize(svgRef, d3, simulation) {
    const { width, height } = svgRef.getBoundingClientRect();
    simulation.force("center", d3.forceCenter(width / 2, height / 2))
    simulation.restart();
}

export default function GraphVisualization({nodes, edges, directed = false, ref, className}) {
    nodes = _.cloneDeep(nodes)
    edges = _.cloneDeep(edges)

    const svgRef = useRef(null);

    const nodesRef = useRef();
    const edgesRef = useRef();
    const labelRef = useRef();
    const arrowHeadRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        
        const { width, height } = svgRef.current.getBoundingClientRect();

        function boundingBoxForce(width, height, radius) {
            return () => {
                for (const node of nodes) {
                node.x = Math.max(radius, Math.min(width - radius, node.x));
                node.y = Math.max(radius, Math.min(height - radius, node.y));
                }
            };
        }

        const nodeRadius = 30
    
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(edges).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(60))
            .force("bounding-box", boundingBoxForce(width, height, nodeRadius))
        
        window.addEventListener("resize", _.debounce(onResize.bind(null, svgRef.current, d3, simulation), 200))
    
        if(directed) {
            arrowHeadRef.current = 
                svg.append("defs")
                    .selectAll("marker")
                    .data(edges)
                    .join("marker")
                    .attr("id", d => `arrowhead-${d.source.id}-${d.target.id}`)
                    .attr("markerWidth", 7)
                    .attr("markerHeight", 7)
                    .attr("refX", 18.6)
                    .attr("refY", 3.5)
                    .attr("orient", "auto")
                    .attr("markerUnits", "strokeWidth")
                    .append("path")
                    .attr("d", "M0,0 L7,3.5 L0,7 Z")
                    .attr("fill", "white");
        }
    
        const edge = svg.append("g")
            .attr("stroke-opacity", 1)
            .selectAll("line")
            .data(edges)
            .join("line")
            .attr("stroke-width", 2.5)
            .attr("stroke", "white")
            .attr("marker-end", d => `url(#arrowhead-${d.source.id}-${d.target.id})`)
    
        const node = svg.append("g")
            .attr("stroke", "#0b0e1a")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 30)
            .attr("fill", "#f8f8f8")
            .call(drag(simulation));
    
        const label = svg.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .attr("style", "user-select: none")
            .attr("dy", 4)
            .attr("fill", "black")
            .call(drag(simulation));

        nodesRef.current = node
        edgesRef.current = edge
        labelRef.current = label

    
        simulation.on("tick", () => {
            edge
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    
            node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    
            label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
        });
    
        function drag(simulation) {
            return d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
        }
    
        const adjacency = {};
        nodes.forEach(n => adjacency[n.id] = []);
        edges.forEach(edge => {
            adjacency[edge.source.id ?? edge.source].push(edge.target.id ?? edge.target);
            adjacency[edge.target.id ?? edge.target].push(edge.source.id ?? edge.source);
        });

    }, [nodes, edges, directed])

    function markNode(nodeId) {
        nodesRef.current
            .filter(d => d.id === nodeId)
            .transition()
            .duration(300)
            .attr("fill", "#19b5fe")
            .attr("stroke", "#19b5fe")
        
        labelRef.current
            .filter(d => d.id === nodeId)
            .attr("fill", "white");
    }

    function markEdge(sourceId, destinationId) {
        edgesRef.current
            .filter(d => d.source.id === sourceId && d.target.id === destinationId)
            .transition()
            .duration(300)
            .attr("stroke", "#19b5fe");
    }

    function markDirectedEdge(sourceId, destinationId) {
        markEdge(sourceId, destinationId)

        arrowHeadRef.current
            .filter(d => d.source.id === sourceId && d.target.id === destinationId)
            .transition()
            .duration(300)
            .attr("fill", "#19b5fe");
    }

    function resetMarks() {
        edgesRef.current
            .attr("stroke", "white")

        nodesRef.current
            .attr("stroke", "#0b0e1a")
            .attr("fill", "#f8f8f8")

        labelRef.current
            .attr("text-anchor", "middle")
            .attr("dy", 4)
            .attr("fill", "black");

        if(directed) {
            arrowHeadRef.current
                .attr("fill", "white");
        }
    }

    useImperativeHandle(ref, () => ({markNode, markEdge: directed ? markDirectedEdge : markEdge, resetMarks}))

    return (
        <svg className={className} ref={svgRef}></svg>
    )
}