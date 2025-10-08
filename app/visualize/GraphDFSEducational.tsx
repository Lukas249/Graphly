"use client";

import {
  useEffect,
  useRef
} from "react";

import GraphVisualization from "./GraphVisualization";
import { Edge, GraphHandle, Node } from "./GraphTypes";
import _ from "lodash";
import { TutorialRef, Tutorial } from "./Tutorial"

const dfsPseudocode = `procedure DFS(node):
  visited.add(node)
  for each neighbour in neighbours(node):
    if neighbour not in visited:
      DFS(neighbour)
`

type Variables = {
  node: string;
  neighbours: string[];
  visited: string[];
};

const nodes: Node[] = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
  { id: "4" },
  { id: "5" },
  { id: "6" },
];

const edges: Edge[] = [
  { source: { id: "1" }, target: { id: "2" } },
  { source: { id: "1" }, target: { id: "3" } },
  { source: { id: "2" }, target: { id: "4" } },
  { source: { id: "3" }, target: { id: "5" } },
  { source: { id: "5" }, target: { id: "6" } },
];

const GraphDFSEducational = () => {
  const graphRef = useRef<GraphHandle>(null);
  const tutorialRef = useRef<TutorialRef<Variables>>(null);

  const waitOnClick = () => {
    return new Promise((resolve) => {
      tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
        resolve(0);
      });
    });
  };

  useEffect(() => {
    const adjacency: { [key: string]: string[] } = {};

    for (const node of nodes) {
      adjacency[node.id] = [];
    }

    for (const { source, target } of edges) {
      adjacency[source.id].push(target.id);
      adjacency[target.id].push(source.id);
    }

    tutorialRef.current?.addTutorialStep({
      description:
        "DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.",
      variables: { visited: [], neighbours: [], node: "" },
      buttonText: "Start",
    });

    async function dfs(startId: string, visited = new Set<string>()) {
      visited.add(startId);

      graphRef.current?.markNode(startId);

      if (visited.size === 1)
        tutorialRef.current?.addTutorialStep({
          description: `Zaczynamy od Node ${startId}`,
          nodeId: startId,
          variables: {
            visited: Array.from<string>(visited),
            neighbours: adjacency[startId],
            node: startId,
          },
        });
      else
        tutorialRef.current?.addTutorialStep({
          description: `Odwiedzamy Node ${startId}`,
          nodeId: startId,
          variables: {
            visited: Array.from<string>(visited),
            neighbours: adjacency[startId],
            node: startId,
          },
        });

      await waitOnClick();

      if (visited.size === nodes.length) {
        tutorialRef.current?.addTutorialStep({
          description: `Wszystkie wierzchołki zostały odwiedzone.`,
          buttonText: "Restart",
        });

        const buttonClickHandler = () => {
          tutorialRef.current?.resetTutorialSteps();
          graphRef.current?.resetMarks();

          tutorialRef.current?.addTutorialStep({
            description:
              "DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.",
            variables: { visited: [], neighbours: [], node: "" },
            buttonText: "Start",
          });

          const nextButtonClickHandler = () => {
            dfs("1");
          };

          tutorialRef.current?.setNextButtonOnceClickHanlder(
            nextButtonClickHandler,
          );
        };

        tutorialRef.current?.setNextButtonOnceClickHanlder(buttonClickHandler);

        return true;
      }

      for (const neighbor of adjacency[startId]) {
        tutorialRef.current?.addTutorialStep({
          description: `Przechodzimy z ${startId} do ${neighbor} jeśli wierzchołek ${neighbor} nie został jeszcze odwiedzony`,
          variables: {
            visited: Array.from<string>(visited),
            neighbours: adjacency[startId],
            node: startId,
          },
        });

        await waitOnClick();

        if (visited.has(neighbor)) continue;

        graphRef.current?.markEdge(startId, neighbor);
        tutorialRef.current?.addTutorialStep({
          edge: { source: startId, target: neighbor },
          isStep: false,
        });

        if (await dfs(neighbor, visited)) return true;
      }

      tutorialRef.current?.addTutorialStep({
        description: `Brak kolejnych nieodwiedzonych sąsiadów dlatego wracamy z wierzchołka ${startId} do poprzednika.`,
        variables: {
          visited: Array.from<string>(visited),
          neighbours: adjacency[startId],
          node: startId,
        },
      });

      await waitOnClick();
    }

    tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
      dfs("1");
    });
  }, []);

  return (
    <div className="flex h-full grow-0 flex-row items-center p-8">
      <GraphVisualization
        graphNodes={nodes}
        graphEdges={edges}
        ref={graphRef}
        className={"h-full w-full grow"}
      />
      <Tutorial
        ref={tutorialRef}
        graphRef={graphRef}
        variables={{ node: "", neighbours: [], visited: [] }}
        pseudocode={dfsPseudocode}
      />
    </div>
  );
};

export default GraphDFSEducational;
