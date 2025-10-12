"use client";

import { useEffect, useRef } from "react";

import GraphVisualization from "../GraphVisualization";
import { Edge, GraphHandle, Node } from "../GraphTypes";
import { TutorialRef, Tutorial } from "../Tutorial";
import { graphColors } from "../defaultGraphColors";

const dfsPseudocode = `procedure DFS(node):
  visited.add(node)
  for each neighbour in neighbours(node):
    if neighbour not in visited:
      DFS(neighbour)
`;

type Variables = {
  node: string;
  neighbours: string[];
  visited: string[];
};

const GraphDFSEducational = ({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: Edge[];
}) => {
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

    for (const { source, target, directed } of edges) {
      if (directed) {
        adjacency[source.id].push(target.id);
      } else {
        adjacency[source.id].push(target.id);
        adjacency[target.id].push(source.id);
      }
    }

    tutorialRef.current?.addTutorialStep({
      description:
        "DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.",
      variables: { visited: [], neighbours: [], node: "" },
      buttonText: "Start",
    });

    const visitedEdges: Record<string, Record<string, boolean>> = {};

    for (const node of nodes) {
      visitedEdges[node.id] = {};
    }

    async function dfs(startId: string, visited = new Set<string>()) {
      visited.add(startId);

      graphRef.current?.markNode({ nodeId: startId });

      if (visited.size === 1)
        tutorialRef.current?.addTutorialStep({
          description: `Zaczynamy od Node ${startId}`,
          node: { nodeId: startId },
          variables: {
            visited: Array.from<string>(visited),
            neighbours: adjacency[startId],
            node: startId,
          },
        });
      else
        tutorialRef.current?.addTutorialStep({
          description: `Odwiedzamy Node ${startId}`,
          node: { nodeId: startId },
          variables: {
            visited: Array.from<string>(visited),
            neighbours: adjacency[startId],
            node: startId,
          },
        });

      await waitOnClick();

      for (const neighbor of adjacency[startId]) {
        if (visited.has(neighbor)) {
          if (
            !visitedEdges[startId][neighbor] &&
            !visitedEdges[neighbor][startId]
          ) {
            graphRef.current?.markEdge({
              sourceId: startId,
              destinationId: neighbor,
              directed: false,
              edgeColor: "gray",
            });

            tutorialRef.current?.addTutorialStep({
              description: `Krawędź ${startId} -- ${neighbor}: Wierzchołek ${neighbor} był już odwiedzony, ale nie przez tę krawędź. Oznaczamy ją szaro, aby zaznaczyć, że została sprawdzona.`,
              variables: {
                visited: Array.from<string>(visited),
                neighbours: adjacency[startId],
                node: startId,
              },
              edge: {
                sourceId: startId,
                destinationId: neighbor,
                directed: false,
                edgeColor: "gray",
              },
            });

            await waitOnClick();
          } else {
            tutorialRef.current?.addTutorialStep({
              description: `Krawędź ${startId} -- ${neighbor}: Wierzchołek ${neighbor} został już odwiedzony tą krawędzią. Pomijamy ją, aby uniknąć powtórzeń.`,
              variables: {
                visited: Array.from<string>(visited),
                neighbours: adjacency[startId],
                node: startId,
              },
            });

            await waitOnClick();
          }
          continue;
        }

        tutorialRef.current?.addTutorialStep({
          description: `Krawędź ${startId} -- ${neighbor}: Przechodzimy do wierzchołka ${neighbor}, ponieważ nie był jeszcze odwiedzony. Jest to krawędź drzewa DFS.`,
          variables: {
            visited: Array.from<string>(visited),
            neighbours: adjacency[startId],
            node: startId,
          },
        });

        await waitOnClick();

        visitedEdges[startId][neighbor] = true;
        visitedEdges[neighbor][startId] = true;

        graphRef.current?.markEdge({
          sourceId: startId,
          destinationId: neighbor,
          directed: false,
        });
        tutorialRef.current?.addTutorialStep({
          edge: { sourceId: startId, destinationId: neighbor, directed: false },
          isStep: false,
        });

        if (await dfs(neighbor, visited)) return true;
      }

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
  }, [nodes, edges]);

  return (
    <div className="flex h-full flex-row items-center p-8">
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
        graphColors={graphColors}
      />
    </div>
  );
};

export default GraphDFSEducational;
