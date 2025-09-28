"use client"

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Educational = () => {
  const svgRef = useRef(null);
  const nextButtonRef = useRef(null)

  const [description, _] = useState("")

  useEffect(() => {
    const nodes = [
      { id: 1 }, { id: 2 }, { id: 3 },
      { id: 4 }, { id: 5 }, { id: 6 }
    ];

    const links = [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 2, target: 4 },
      { source: 3, target: 5 },
      { source: 5, target: 6 }
    ];

    const svg = d3.select(svgRef.current);
    
    const { width, height } = svgRef.current.getBoundingClientRect();

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60))

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
      .attr("r", 30)
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

    async function bfs(startId, visited = new Set()) {
      const queue = [[Infinity, startId]]

      visited.add(startId);

      while(queue.length) {
        const len = queue.length

        for(let i = 0; i < len; i++) {
            const [sourceId, id] = queue[i]
            
            link
                .filter(d => d.source.id === sourceId && d.target.id === id)
                .transition()
                .duration(300)
                .attr("stroke", "#19b5fe");

            node
                .filter(d => d.id === id)
                .transition()
                .duration(300)
                .attr("fill", "#19b5fe")
                .attr("stroke", "#19b5fe")
                    
            label
                .filter(d => d.id === id)
                .attr("fill", "white");

            await new Promise(resolve => {
                nextButtonRef.current.onclick = () => {
                    resolve()
                    nextButtonRef.current.onclick = undefined
                }
            });

            for(const neighbor of adjacency[id]) {
                if(visited.has(neighbor)) continue

                queue.push([id, neighbor])

                visited.add(neighbor);
            }
        }

        queue.splice(0, len)
      }
    //   if(visited.size === 1)
    //     setDescription(`DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy. Zaczynamy od Node ${startId}`)
    //   else
    //     setDescription(`Następnie odwiedzamy Node ${startId}`)
    }

    setTimeout(() => bfs(1), 1000);
  }, []);

  return (
    <div className="flex flex-col items-center p-8 grow-1">
      <svg className="grow" ref={svgRef} width="100%"></svg>
      <p>{description}</p>
      <button className="btn inline-block" ref={nextButtonRef}>Next</button>
    </div>
  )
};

export default Educational;
