"use client";

import { useEffect, useRef } from "react";

import GraphVisualization from "./../GraphVisualization";
import { Edge, GraphHandle, Node } from "./../GraphTypes";
import { TutorialRef, Tutorial } from "./../Tutorial";
import { graphColors } from "../defaultGraphColors";

const dfsPseudocode = `procedure BFS(start):
  visited <- new Set()
  queue <- new Queue()

  queue.enqueue(start)
  visited.add(start)

  while not queue.isEmpty():
    node <- queue.dequeue()

    for each neighbour in neighbours(node):
      if neighbour not in visited:
        visited.add(neighbour)
        queue.enqueue(neighbour)`;

const initialStep = {
  description:
    "BFS polega na eksploracji grafu warstawi. Wybieramy dowolny wierzchołek i z niego idziemy do sąsiadów, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.",
  variables: { queue: [], node: "" },
  buttonText: "Start",
};

const initialNode = "1";

type Variables = {
  queue: string[];
  node: string;
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

const GraphBFSEducational = () => {
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

    tutorialRef.current?.addTutorialStep(initialStep);

    async function bfs(startId: string, visited = new Set<string>()) {
      const queue = [startId];
      visited.add(startId);

      const prevNodes: Record<string, string> = {};

      tutorialRef.current?.addTutorialStep({
        description: `Dodajemy wierzchołek ${startId} do kolejki jako wierzchołek początkowy`,
        variables: {
          queue: Array.from<string>(queue),
          node: startId,
        },
      });

      await waitOnClick();

      while (queue.length > 0) {
        const node = queue.shift() ?? "";

        graphRef.current?.markNode({ nodeId: node });

        const prevNode = prevNodes[node];

        if (prevNode) {
          graphRef.current?.markEdge({
            sourceId: prevNode,
            destinationId: node,
          });
        }

        tutorialRef.current?.addTutorialStep({
          description: `Usuwamy pierwszy wierzchołek z kolejki i odwiedzamy (wierzchołek ${node})`,
          node: { nodeId: node },
          variables: {
            queue: Array.from<string>(queue),
            node,
          },
          edge: prevNode
            ? { sourceId: prevNode, destinationId: node }
            : undefined,
        });

        await waitOnClick();

        const addedNeighbours = [];

        for (const neighbor of adjacency[node]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
            prevNodes[neighbor] = node;

            addedNeighbours.push(neighbor);
          }
        }

        if (addedNeighbours.length) {
          tutorialRef.current?.addTutorialStep({
            description: `Dodajemy do kolejki nieodwiedzonych wcześniej sąsiadów wierzchołka ${node} -> (${addedNeighbours})`,
            variables: {
              queue: Array.from<string>(queue),
              node,
            },
          });

          await waitOnClick();
        }
      }

      tutorialRef.current?.addTutorialStep({
        description: `Wszystkie wierzchołki zostały odwiedzone.`,
        buttonText: "Restart",
      });

      const buttonClickHandler = () => {
        tutorialRef.current?.resetTutorialSteps();
        graphRef.current?.resetMarks();

        tutorialRef.current?.addTutorialStep(initialStep);

        const nextButtonClickHandler = () => {
          bfs(initialNode);
        };

        tutorialRef.current?.setNextButtonOnceClickHanlder(
          nextButtonClickHandler,
        );
      };

      tutorialRef.current?.setNextButtonOnceClickHanlder(buttonClickHandler);
    }

    tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
      bfs(initialNode);
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
        variables={{ node: "", queue: [] }}
        pseudocode={dfsPseudocode}
        graphColors={graphColors}
      />
    </div>
  );
};

export default GraphBFSEducational;
