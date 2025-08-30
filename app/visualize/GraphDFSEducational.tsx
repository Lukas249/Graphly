"use client"

import { RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as d3 from "d3";
import GraphVisualization from "./GraphVisualization";
import { GraphHandle } from "./GraphTypes";

type TutorialRef = {
  setDescription: (description: string) => void; 
  updateVariables: (visited: string[], neighbours: string[], node: string) => void; 
  setButtonText: (text: string) => void;
  setButtonClickHanlder: (handler: (() => void) | null) => void; 
}

const Tutorial = ({ ref } : { ref: RefObject<TutorialRef | null> }) => {
  const [codeVisited, setCodeVisited] = useState<string[]>([])
  const [codeNeighbours, setCodeNeighbours] = useState<string[]>([])
  const [codeNode, setCodeNode] = useState<string>("")

  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const setDescription = (description: string) => {
    if(!descriptionRef.current) return
    descriptionRef.current.innerText = description
  }

  const updateVariables = (visited: string[], neighbours: string[], node: string) => {
    setCodeVisited(visited)
    setCodeNeighbours(neighbours)
    setCodeNode(node)
  }

  const setButtonText = (text: string) => {
    if(!nextButtonRef.current) return
    nextButtonRef.current.innerText = text
  }

  const setButtonClickHanlder = (handler: (() => void) | null) => {
    if(!nextButtonRef.current) return
    nextButtonRef.current.onclick = handler
  }

  const codeLines = [
  `node <- ${codeNode.length ? codeNode : null}`,
  `neighbours <- {${codeNeighbours}}`,
  `visited <- {${codeVisited}}`,
  ``,
  `procedure DFS(node):
    visited.add(node)
    for each neighbour in neighbours(node):
      if neighbour not in visited:
        DFS(neighbour)`
  ];

  useImperativeHandle<TutorialRef, TutorialRef>(ref, () => ({ setDescription, updateVariables, setButtonText, setButtonClickHanlder }))

  return (
    <div className="flex flex-col gap-2 w-[40rem]">
        <div className="bg-gray-dark w-full p-5 rounded-lg flex justify-between items-center flex-col gap-5">
          <p ref={descriptionRef}>DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.</p>
          <button className="btn inline-block" ref={nextButtonRef}>Start</button>
        </div>

        <div className="bg-gray-dark w-full p-5 rounded-lg flex justify-between flex-col gap-5 text-sm items-start">
            <pre className="w-full">
              {codeLines.map((line, i) => (
                <div
                  key={i}
                  className={`py-1 px-2 w-full rounded-sm ${
                      i == codeLines.length - 1 ? "bg-primary" : ""
                  }`}
                >
                  {line}
                </div>
              ))}
            </pre>
        </div>
    </div>
  )
}

const GraphDFSEducational = () => {
  const graphRef = useRef<GraphHandle>(null);
  const tutorialRef = useRef<TutorialRef>(null)

  const nodes = [
      { id: "1" }, { id: "2" }, { id: "3"},
      { id: "4" }, { id: "5" }, { id: "6" }
  ];

  const edges = [
    { source: "1", target: "2" },
    { source: "1", target: "3" },
    { source: "2", target: "4" },
    { source: "3", target: "5" },
    { source: "5", target: "6" }
  ];

  const waitOnClick = () => {
    return new Promise(resolve => {
      tutorialRef.current?.setButtonClickHanlder(() => {
        resolve(0)
        tutorialRef.current?.setButtonClickHanlder(null)
      })
    });
  }

  useEffect(() => {

    const adjacency: {[key: string]: string[]} = {}

    for(const node of nodes) {
      adjacency[node.id] = []
    }

    for(const {source, target} of edges) {
      adjacency[source].push(target)
      adjacency[target].push(source)
    }

    async function dfs(startId: string, visited = new Set<string>()) {

      visited.add(startId);

      graphRef.current?.markNode(startId)

      tutorialRef.current?.updateVariables(Array.from<string>(visited), adjacency[startId], startId)

      if(visited.size === 1)
        tutorialRef.current?.setDescription(`Zaczynamy od Node ${startId}`)
      else
        tutorialRef.current?.setDescription(`Odwiedzamy Node ${startId}`)
    
      await waitOnClick()
      
      if(visited.size === nodes.length) {
        tutorialRef.current?.setDescription(`Wszystkie wierzchołki zostały odwiedzone.`)

        tutorialRef.current?.setButtonText("Restart")

        const buttonClickHandler = () => {
          graphRef.current?.resetMarks()
          tutorialRef.current?.updateVariables([], [], "")

          tutorialRef.current?.setDescription("DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.")
          tutorialRef.current?.setButtonText("Start")

          const nextButtonClickHandler = () => {
            tutorialRef.current?.setButtonText("Next")
            tutorialRef.current?.setButtonClickHanlder(null)
            dfs("1")
          }

          tutorialRef.current?.setButtonClickHanlder(nextButtonClickHandler)
        }

        tutorialRef.current?.setButtonClickHanlder(buttonClickHandler)
        
        return true
      } 

      for (const neighbor of adjacency[startId]) {
        tutorialRef.current?.setDescription(`Przechodzimy z ${startId} do ${neighbor} jeśli wierzchołek ${neighbor} nie został jeszcze odwiedzony`)
        tutorialRef.current?.updateVariables(Array.from<string>(visited), adjacency[startId], startId)

        await waitOnClick()

        if(visited.has(neighbor)) continue;
       
        graphRef.current?.markEdge(startId, neighbor)

        if(await dfs(neighbor, visited)) return true
      }

      tutorialRef.current?.setDescription(`Brak kolejnych nieodwiedzonych sąsiadów dlatego wracamy z wierzchołka ${startId} do poprzednika.`)
      tutorialRef.current?.updateVariables(Array.from<string>(visited), adjacency[startId], startId)

      await waitOnClick()
    }

    tutorialRef.current?.setButtonClickHanlder(() => {
      tutorialRef.current?.setButtonText("Next")
      tutorialRef.current?.setButtonClickHanlder(null)
      dfs("1")
    })
  }, []);

  return (
    <div className="flex flex-row h-screen items-center p-8 grow-0">
      <GraphVisualization nodes={nodes} edges={edges} ref={graphRef} directed={false} className={"grow w-full h-full"}/>
      <Tutorial ref={tutorialRef}/>
    </div>
  )
};

export default GraphDFSEducational;
