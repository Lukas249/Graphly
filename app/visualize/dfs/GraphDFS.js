"use client"

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const GraphDFS = ({nodes, links}) => {
  const svgRef = useRef(null);
  const nextButtonRef = useRef(null)

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
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60))
      .force("bounding-box", boundingBoxForce(width, height, nodeRadius))

    const link = svg.append("g")
      .attr("stroke-opacity", 1)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2.5)
      .attr("stroke", "white")
      .attr("marker-end", "url(#arrowhead)")

    const node = svg.append("g")
      .attr("stroke", "#0b0e1a")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", nodeRadius)
      .attr("fill", "#f8f8f8")
      .call(drag(simulation));

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("fill", "black");

    simulation.on("tick", () => {
      link
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
    links.forEach(link => {
      adjacency[link.source.id ?? link.source].push(link.target.id ?? link.target);
      adjacency[link.target.id ?? link.target].push(link.source.id ?? link.source);
    });

    async function dfs(startId, visited = new Set()) {
      

      await new Promise(resolve => {
        nextButtonRef.current.onclick = () => {
            resolve()
            nextButtonRef.current.onclick = undefined
          }
      });

      visited.add(startId);

      node
        .filter(d => d.id === startId)
        .transition()
        .duration(300)
        .attr("fill", "#19b5fe")
        .attr("stroke", "#19b5fe")
        
       label
       .filter(d => d.id === startId)
       .attr("fill", "white");

      for (const neighbor of adjacency[startId]) {
        if(visited.has(neighbor)) continue;

        await new Promise(resolve => {
          nextButtonRef.current.onclick = () => {
            resolve()
            nextButtonRef.current.onclick = undefined
          }
        });

        link
          .filter(d => d.source.id === startId && d.target.id === neighbor)
          .transition()
          .duration(300)
          .attr("stroke", "#19b5fe");

        await dfs(neighbor, visited);
      }
    }
    
    async function asyncFn() {
      const visited = new Set()

      for(const {id} of nodes) {
        if(visited.has(id)) continue

        await dfs(id, visited)
      }
    }
    
    asyncFn()
  }, [nodes, links]);

  return (
    <div className="flex flex-col h-screen items-center p-8 grow">
      <svg className="grow" ref={svgRef} width="100%"></svg>
      <button className="btn inline-block" ref={nextButtonRef}>Next</button>
    </div>
  )
};

export default GraphDFS;
