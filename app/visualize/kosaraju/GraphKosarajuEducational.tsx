"use client";

import { useEffect, useRef } from "react";

import GraphVisualization from "../GraphVisualization";
import { Edge, GraphHandle, Node } from "../GraphTypes";
import { TutorialRef, Tutorial } from "../Tutorial";
import { graphColors } from "../defaultGraphColors";
import _ from "lodash";

// 1
const dfsPseudocode = `procedure DFS(node):
  visited.add(node)
  for each neighbour in neighbours(node):
    if neighbour not in visited:
      DFS(neighbour)
`;

// 2, inital step, function
type Variables = {
  node?: string;
  neighbours?: string[];
  order?: string[];
  components?: string[][];
  component?: string[];
  visited?: string[];
};

const GraphKosarajuEducational = ({
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
    type AdjacencyList = { [key: string]: string[] };
    const adjacency: AdjacencyList = {};

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
        "Kosaraju polega na dwukrotnym przeszukaniu grafu w głąb - najpierw wykonujemy DFS, zapisując wierzchołki w kolejności ich zakończenia, a następnie odwracamy krawędzie i ponownie wykonujemy DFS w odwrotnej kolejności, aby znaleźć grupy wierzchołków wzajemnie osiągalnych.",
      variables: { components: [], order: [], neighbours: [], node: "" },
      buttonText: "Start",
    });

    const visitedEdges: Record<string, Record<string, boolean>> = {};

    for (const node of nodes) {
      visitedEdges[node.id] = {};
    }

    async function strongly_connected_components(
      nodes: Node[],
      adj: AdjacencyList,
    ) {
      let visited: Record<string, boolean> = {};
      const order: string[] = [];
      const components: string[][] = [];

      async function dfs1(
        v: string,
        graph: Record<string, string[]>,
        order: string[],
      ) {
        visited[v] = true;

        graphRef.current?.markNode({ nodeId: v });
        tutorialRef.current?.addTutorialStep({
          description: `Odwiedzamy wierzchołek ${v}`,
          variables: {
            node: v,
            neighbours: [...graph[v]],
            order: [...order],
          },
          node: { nodeId: v },
        });
        await waitOnClick();

        for (const u of graph[v]) {
          if (!visited[u]) {
            graphRef.current?.markEdge({
              sourceId: v,
              destinationId: u,
              directed: true,
            });
            tutorialRef.current?.addTutorialStep({
              description: `Krawędź ${v}->${u}: przechodzimy do sąsiedniego wierzchołka.`,
              variables: {
                node: v,
                neighbours: [...graph[v]],
                order: [...order],
              },
              edge: { sourceId: v, destinationId: u, directed: true },
            });
            await waitOnClick();

            await dfs1(u, graph, order);
          }
        }

        order.push(v);

        tutorialRef.current?.addTutorialStep({
          description: `Dodajemy wierzchołek ${v} do tablicy order`,
          variables: {
            node: v,
            neighbours: [...graph[v]],
            order: [...order],
          },
        });
        await waitOnClick();
      }

      async function dfs2(
        v: string,
        graph: Record<string, string[]>,
        component: string[],
      ) {
        visited[v] = true;

        graphRef.current?.markNode({ nodeId: v });
        tutorialRef.current?.addTutorialStep({
          description: `Odwiedzamy wierzchołek ${v}`,
          variables: {
            node: v,
            neighbours: [...graph[v]],
            order: [...order],
            component: [...component],
            components: _.cloneDeep(components),
          },
          node: { nodeId: v },
        });
        await waitOnClick();

        for (const u of graph[v]) {
          if (!visited[u]) {
            graphRef.current?.markEdge({
              sourceId: v,
              destinationId: u,
              directed: true,
            });
            tutorialRef.current?.addTutorialStep({
              description: `Krawędź ${v}->${u}: przechodzimy do sąsiedniego wierzchołka.`,
              variables: {
                node: v,
                neighbours: [...graph[v]],
                order: [...order],
                component: [...component],
                components: _.cloneDeep(components),
              },
              edge: { sourceId: v, destinationId: u, directed: true },
            });
            await waitOnClick();

            await dfs2(u, graph, component);
          }
        }

        component.push(v);

        tutorialRef.current?.addTutorialStep({
          description: `Dodajemy wierzchołek ${v} do tablicy component`,
          variables: {
            node: v,
            neighbours: [...graph[v]],
            order: [...order],
            component: [...component],
            components: _.cloneDeep(components),
          },
        });
        await waitOnClick();
      }

      for (const node of nodes) {
        if (!visited[node.id]) await dfs1(node.id, adj, order);
      }

      const adj_rev: AdjacencyList = {};

      for (const node of nodes) {
        adj_rev[node.id] = [];
      }

      for (const v of nodes) {
        for (const u of adj[v.id]) {
          adj_rev[u].push(v.id);
        }
      }

      tutorialRef.current?.addTutorialStep({
        description: `Z grafu początkowego uzyskujemy graf transponowany, w którym wszystkie krawędzie mają odwrócony kierunek.`,
        transpose: true,
        prevMarkings: graphRef.current?.getMarkings(),
        nextMarkings: graphRef.current?.getDefaultMarkings(),
      });
      graphRef.current?.resetMarks();
      graphRef.current?.transpose();

      await waitOnClick();

      visited = {};

      while (order.length) {
        const v = order.pop() ?? "";

        tutorialRef.current?.addTutorialStep({
          description: `Usuwamy ostatni element z tablicy order i jeśli nie został jeszcze odwiedzony to wykonujemy dfs2(${v})`,
          variables: {
            node: v,
            neighbours: [...adj_rev[v]],
            order: [...order],
            component: [],
            components: _.cloneDeep(components),
          },
        });
        await waitOnClick();

        if (!visited[v]) {
          const component: string[] = [];
          await dfs2(v, adj_rev, component);
          components.push(component);

          tutorialRef.current?.addTutorialStep({
            description: `Algorytm znalazł komponent (${component.join(",")})`,
            variables: {
              node: v,
              neighbours: [...adj_rev[v]],
              order: [...order],
              component: [...component],
              components: _.cloneDeep(components),
            },
          });
          await waitOnClick();
        }
      }

      tutorialRef.current?.addTutorialStep({
        description: `Wszystkie komponenty grafu zostały znalezione i zapisane w tablicy components`,
        buttonText: "Restart",
        variables: {
          components: _.cloneDeep(components),
        },
      });

      const buttonClickHandler = () => {
        tutorialRef.current?.resetTutorialSteps();
        graphRef.current?.resetMarks();
        graphRef.current?.transpose();

        tutorialRef.current?.addTutorialStep({
          description:
            "DFS polega na eksploracji grafu najpierw w głąb. Wybieramy dowolny wierzchołek i z niego idziemy do kolejnych w obojętnej kolejności, ale nie możemy odwiedzic tego samego wierzchołka dwa razy.",
          variables: { visited: [], neighbours: [], node: "" },
          buttonText: "Start",
        });

        const nextButtonClickHandler = () => {
          strongly_connected_components(nodes, adjacency);
        };

        tutorialRef.current?.setNextButtonOnceClickHanlder(
          nextButtonClickHandler,
        );
      };

      tutorialRef.current?.setNextButtonOnceClickHanlder(buttonClickHandler);
    }

    tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
      strongly_connected_components(nodes, adjacency);
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
        variables={{ node: "", neighbours: [], components: [], order: [] }}
        pseudocode={dfsPseudocode}
        graphColors={graphColors}
      />
    </div>
  );
};

export default GraphKosarajuEducational;
