"use client"

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const GraphDFSEducational = () => {
  const svgRef = useRef(null);
  const nextButtonRef = useRef(null)
  const descriptionRef = useRef(null)

  const setDescription = (description) => {
    descriptionRef.current.innerText = description
  }

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

    async function dfs(startId, visited = new Set()) {

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
      
      if(visited.size === nodes.length) {
        setDescription(`Wszystkie wierzchołki zostały odwiedzone.`)
        nextButtonRef.current.innerText = "Restart"
        nextButtonRef.current.onclick = () => {
          nextButtonRef.current.innerText = "Next"
          nextButtonRef.current.onclick = undefined

          link
          .attr("stroke", "white")

          node
            .attr("stroke", "#0b0e1a")
            .attr("fill", "#f8f8f8")

          label
            .attr("text-anchor", "middle")
            .attr("dy", 4)
            .attr("fill", "black");
          dfs(1)
        }
        return
      } 
      
      if(visited.size === 1)
        setDescription(`Zaczynamy od Node ${startId}`)
      else
        setDescription(`Następnie odwiedzamy Node ${startId}`)
    
      await new Promise(resolve => {
        nextButtonRef.current.onclick = () => {
          resolve()
          nextButtonRef.current.onclick = undefined
        }
      });

      for (const neighbor of adjacency[startId]) {
        if(visited.has(neighbor)) continue;
       
        //setDescription(`Link ${startId} - ${neighbor}. All neihbors: ${adjacency[startId]}`)

        link
          .filter(d => d.source.id === startId && d.target.id === neighbor)
          .transition()
          .duration(300)
          .attr("stroke", "#19b5fe");

        // await new Promise(resolve => {
        //   nextButtonRef.current.onclick = () => {
        //     resolve()
        //     nextButtonRef.current.onclick = undefined
        //   }
        // });

        await dfs(neighbor, visited);
      }
    }

    nextButtonRef.current.onclick = () => {
      nextButtonRef.current.onclick = undefined
      setDescription("DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.")
      nextButtonRef.current.innerText = "Next"
      dfs(1)
    }
  }, []);

  return (
    <div className="flex flex-row h-screen items-center p-8 grow-0">
      <svg className="grow" ref={svgRef} width="100%" height="100%"></svg>
      <div className="bg-gray-dark w-[40rem] p-5 rounded-lg flex justify-between items-center flex-col gap-5">
        <p ref={descriptionRef}>DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.</p>
        <button className="btn inline-block" ref={nextButtonRef}>Start</button>
      </div>
    </div>
  )
};

export default GraphDFSEducational;
