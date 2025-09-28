"use client"

import { RefObject, useEffect, useImperativeHandle, useMemo, useRef, useState, useCallback } from "react";

import GraphVisualization from "./GraphVisualization";
import { Edge, GraphHandle, Node } from "./GraphTypes";
import { graphColors } from "./defaultGraphColors";
import HistoryState from "../lib/HistoryState";
import _ from "lodash";

function useForceUpdate() {
  const [, toggle] = useState(false);
  return useCallback(() => toggle(t => !t), []);
}

type TutorialStep<TutorialVariables extends Record<string, unknown>> = {
  description?: string;
  nodeId?: string;
  edge?: {source: string, target: string };
  isStep?: boolean;
  buttonText?: string;
  variables?: TutorialVariables;
}

type TutorialRef<TutorialVariables extends Record<string, unknown>> = {
  setDescription: (description: string) => void; 
  getDescription: () => string;
  setNextButtonText: (text: string) => void;
  setNextButtonOnceClickHanlder: (handler: (() => void)) => void; 
  addTutorialStep: (step: TutorialStep<TutorialVariables>) => void;
  resetTutorialSteps: () => void;
}

function Tutorial<TutorialVariables extends Record<string, unknown>>(
  { ref, graphRef, variables } : 
  { ref: RefObject<TutorialRef<TutorialVariables> | null>, graphRef: RefObject<GraphHandle | null>, variables: TutorialVariables }
) {
  const [codeVariables, setCodeVariables] = useState(variables)

  const [description, setDescription] = useState<string>("")
  const [nextButtonText, setNextButtonText] = useState<string>("")
  
  const prevButtonRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const historyStates = useMemo(() => new HistoryState<TutorialStep<TutorialVariables>>(), []);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        prevButtonRef.current?.click()
      } else if (event.key === "ArrowRight") {
        nextButtonRef.current?.click()
      }
    }

    const throttled = _.throttle(handleKeyPress, 250)

    window.addEventListener("keydown", throttled)

    return () => {
      window.removeEventListener("keydown", throttled)
    }
  }, [])

  function resetTutorialSteps() {
    historyStates.reset()
  }

  function addTutorialStep(
      {
        description, 
        nodeId, 
        edge,
        isStep = true,
        buttonText = "Next",
        variables
      } : TutorialStep<TutorialVariables>
  ) {
    historyStates.push({description, nodeId, edge, isStep, buttonText, variables})
    if(description) setDescription(description)
    if(nextButtonText != buttonText) setNextButtonText(buttonText)
    if(variables) setCodeVariables(variables)
  }

  const getDescription = () => {
    return description
  }

  const setNextButtonOnceClickHanlder = (handler: (() => void)) => {
    if(!nextButtonRef.current) return
    
    nextButtonRef.current.onclick = () => {
      if(historyStates.canGoForward()) {
        let nextState = historyStates.goForward()
        
        while(nextState && !nextState.isStep) {
          if(nextState?.edge) {
            graphRef.current?.markEdge(nextState.edge.source, nextState.edge.target, graphColors.markedEdge, graphColors.markedEdgeLabel, graphColors.markedEdgeHead)
          }

          nextState = historyStates.goForward()
        }

        if(nextState?.nodeId) {
          graphRef.current?.markNode(nextState.nodeId)
        }

        if(nextState?.description) setDescription(nextState.description)
        setNextButtonText(nextState?.buttonText ?? "Next")
        if(nextState?.variables) setCodeVariables(nextState.variables)
      } else {
        nextButtonRef.current!.onclick = null
        handler()
      }
    }
  }

  const prevButtonClickHandler = () => {
    let currentState = historyStates.current()
    let prevState = historyStates.goBack()

    if(currentState?.nodeId) {
      graphRef.current?.markNode(currentState.nodeId, graphColors.nodeFill, graphColors.nodeStroke, graphColors.nodeLabel)
    }

    while(prevState && !prevState.isStep) {
      if(prevState?.edge) {
        graphRef.current?.markEdge(prevState.edge.source, prevState.edge.target, graphColors.edge, graphColors.edgeLabel, graphColors.edgeHead)
      }

      currentState = historyStates.current()
      prevState = historyStates.goBack()
    }

    if(prevState) {
      if(prevState?.description) setDescription(prevState.description)
      setNextButtonText(prevState?.buttonText ?? "Next")
      if(prevState?.variables) setCodeVariables(prevState.variables)
    } else {
      forceUpdate();
    }
  }

  const codeLines = [];

  for(const key in codeVariables) {
    codeLines.push(`${key} <- ${codeVariables[key] ? JSON.stringify(codeVariables[key]).replaceAll('"', '') : null}`)
  }

  codeLines.push(``)
  codeLines.push(`procedure DFS(node):
    visited.add(node)
    for each neighbour in neighbours(node):
      if neighbour not in visited:
        DFS(neighbour)`)

  useImperativeHandle<TutorialRef<TutorialVariables>, TutorialRef<TutorialVariables>>(ref, () => (
    { setDescription, getDescription, setNextButtonText, setNextButtonOnceClickHanlder, addTutorialStep, resetTutorialSteps }
  ))

  return (
    <div className="flex flex-col gap-2 w-[40rem]">
        <div className="bg-gray-dark w-full p-5 rounded-lg flex justify-between items-center flex-col gap-5">
          <p>{description}</p>
          <div className="flex flex-row gap-2">
            {
              historyStates.canGoBack() && 
              <button className="btn inline-block" ref={prevButtonRef} onClick={prevButtonClickHandler}>Previous</button>
            }
            <button className="btn inline-block" ref={nextButtonRef}>{nextButtonText}</button>
          </div>
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

type Variables = {
  node: string, 
  neighbours: string[], 
  visited: string[]
}

const GraphDFSEducational = () => {
  const graphRef = useRef<GraphHandle>(null);
  const tutorialRef = useRef<TutorialRef<Variables>>(null)

  const nodes: Node[] = [
      { id: "1" }, { id: "2" }, { id: "3"},
      { id: "4" }, { id: "5" }, { id: "6" }
  ];

  const edges: Edge[] = [
    { source: {id: "1"}, target: {id: "2"} },
    { source: {id: "1"}, target: {id: "3"} },
    { source: {id: "2"}, target: {id: "4"} },
    { source: {id: "3"}, target: {id: "5"} },
    { source: {id: "5"}, target: {id: "6"} }
  ];

  const waitOnClick = () => {
    return new Promise(resolve => {
      tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
        resolve(0)
      })
    });
  }

  useEffect(() => {
    const adjacency: {[key: string]: string[]} = {}

    for(const node of nodes) {
      adjacency[node.id] = []
    }

    for(const {source, target} of edges) {
      adjacency[source.id].push(target.id)
      adjacency[target.id].push(source.id)
    }

    tutorialRef.current?.addTutorialStep({ 
      description: "DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.",
      variables: {visited: [], neighbours: [], node: ""},
      buttonText: "Start",
    })

    async function dfs(startId: string, visited = new Set<string>()) {

      visited.add(startId);

      graphRef.current?.markNode(startId)

      
      if(visited.size === 1)
        tutorialRef.current?.addTutorialStep({ 
          description: `Zaczynamy od Node ${startId}`, 
          nodeId: startId,
          variables: {visited: Array.from<string>(visited), neighbours: adjacency[startId], node: startId}
        })
      else
        tutorialRef.current?.addTutorialStep({ 
          description: `Odwiedzamy Node ${startId}`, 
          nodeId: startId,
          variables: {visited: Array.from<string>(visited), neighbours: adjacency[startId], node: startId}
        })

      await waitOnClick()
      
      if(visited.size === nodes.length) {
        tutorialRef.current?.addTutorialStep({ description: `Wszystkie wierzchołki zostały odwiedzone.`, buttonText: "Restart" })

        const buttonClickHandler = () => {
          tutorialRef.current?.resetTutorialSteps()
          graphRef.current?.resetMarks()

          tutorialRef.current?.addTutorialStep({ 
            description: "DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.",
            variables: {visited: [], neighbours: [], node: ""},
            buttonText: "Start"
          })

          const nextButtonClickHandler = () => {
            dfs("1")
          }

          tutorialRef.current?.setNextButtonOnceClickHanlder(nextButtonClickHandler)
        }

        tutorialRef.current?.setNextButtonOnceClickHanlder(buttonClickHandler)
        
        return true
      } 

      for (const neighbor of adjacency[startId]) {
        tutorialRef.current?.addTutorialStep({ 
          description: `Przechodzimy z ${startId} do ${neighbor} jeśli wierzchołek ${neighbor} nie został jeszcze odwiedzony`,
          variables: {visited: Array.from<string>(visited), neighbours: adjacency[startId], node: startId}
        })

        await waitOnClick()

        if(visited.has(neighbor)) continue;
       
        graphRef.current?.markEdge(startId, neighbor)
        tutorialRef.current?.addTutorialStep({ edge: {source: startId, target: neighbor}, isStep: false })

        if(await dfs(neighbor, visited)) return true
      }

      tutorialRef.current?.addTutorialStep({ 
        description: `Brak kolejnych nieodwiedzonych sąsiadów dlatego wracamy z wierzchołka ${startId} do poprzednika.`,
        variables: {visited: Array.from<string>(visited), neighbours: adjacency[startId], node: startId}
      })
      
      await waitOnClick()
    }

    tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
      dfs("1")
    })
  }, []);

  return (
    <div className="flex flex-row h-full items-center p-8 grow-0">
      <GraphVisualization graphNodes={nodes} graphEdges={edges} ref={graphRef} className={"grow w-full h-full"}/>
      <Tutorial ref={tutorialRef} graphRef={graphRef} variables={{node: "", neighbours: [], visited: []}}/>
    </div>
  )
};

export default GraphDFSEducational;
