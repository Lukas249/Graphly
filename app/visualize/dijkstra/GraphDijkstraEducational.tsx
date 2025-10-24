"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import GraphVisualization from "../GraphVisualization";
import { Edge, GraphHandle, Node } from "../GraphTypes";
import { TutorialRef, Tutorial } from "../Tutorial";
import { graphColors } from "../defaultGraphColors";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Tab, Tabs } from "@/app/components/tabs";
import GraphEditor from "../custom/graphEditor";
import Chat, { ChatRef } from "@/app/components/chat/chat";
import { askAI } from "@/app/lib/ai";
import { MessageDetails } from "@/app/components/chat/types";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import AISelectionProvider from "@/app/lib/AISelectionProvider";
import { DocumentTextIcon, MapIcon } from "@heroicons/react/24/outline";
import { stringifyGraph } from "@/app/lib/graph/graphSerializer";
import { defaultEdgeSeparator, defaultWeightSeparator } from "@/app/lib/graph/graphFormatConfig";
import { sendHandler } from "@/app/components/chat/sendHandler";

const dfsPseudocode = `procedure Dijkstra(startNode):
  for each vertex v in Graph:
    distance[v] <- ∞
    previous[v] <- undefined
  distance[startNode] <- 0

  priorityQueue <- empty min-priority queue
  priorityQueue.insert(startNode, 0)

  while priorityQueue is not empty:
    node <- priorityQueue.extractMin()

    if node is already visited:
      continue

    mark node as visited

    for each neighbour in neighbours(node):
      newDistance <- distance[node] + weight(node, neighbour)
      if newDistance < distance[neighbour]:
        distance[neighbour] <- newDistance
        previous[neighbour] <- node
        priorityQueue.insert(neighbour, newDistance)`;

type Variables = {
  node: string;
  neighbours: string[];
  visited: string[];
  queue?: NodeDetails[];
};

type NodeDetails = {
  nodeId: string;
  weight: string;
};

const graphTypeContext = `"Graph represented as text where '--' means undirected edge and '->' means directed edge. Weight is separated by ':'"`

const GraphDijkstraEducational = ({
  graphNodes,
  graphEdges,
}: {
  graphNodes: Node[];
  graphEdges: Edge[];
}) => {
  const [nodes, setNodes] = useState(graphNodes);
  const [edges, setEdges] = useState(graphEdges);

  const graphRef = useRef<GraphHandle>(null);
  const tutorialRef = useRef<TutorialRef<Variables>>(null);

  const [tutorialTabsCurrentTab, setTutorialTabsCurrentTab] = useState(0);

  const tutorial = (
    <Tutorial
      ref={tutorialRef}
      graphRef={graphRef}
      variables={{ queue: [], node: "", neighbours: [], visited: [] }}
      pseudocode={dfsPseudocode}
      graphColors={graphColors}
    />
  );

  const chatRef = useRef<ChatRef>(null);
 
  const [tutorialTabs, setTutorialTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Tutorial",
      content: <AISelectionProvider
                buttonClickHandler={(__, selectedText) => {
                  chatRef.current?.addContext("description", {
                    icon: (
                      <DocumentTextIcon className="stroke-primary size-3.5 fill-transparent" />
                    ),
                    text: selectedText,
                    closeable: true,
                  });
                }}
              >{tutorial}
              </AISelectionProvider>,
      closeable: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Graph",
      renderContent: () => (
        <GraphEditor
          userNodes={nodes}
          userEdges={edges}
          onChange={(nodes, edges) => {
            setNodes(nodes);
            setEdges(edges);
            chatRef.current?.addContext(
              graphTypeContext, 
              {
                icon: <MapIcon className="stroke-primary size-3.5 fill-transparent" />,
                text: stringifyGraph(
                  nodes, 
                  edges, 
                  defaultWeightSeparator,
                  defaultEdgeSeparator
                ),
                closeable: false
              }
            )
          }}
        />
      ),
      closeable: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Graphly AI",
      content: (
        <Chat
          ref={chatRef}
          onSend={(messages: MessageDetails[]) => sendHandler(chatRef, messages, askAI)}
          defaultContexts={
            {
              [graphTypeContext]: { 
                  icon: <MapIcon className="stroke-primary size-3.5 fill-transparent" />,
                  text: stringifyGraph(
                    nodes, 
                    edges, 
                    defaultWeightSeparator,
                    defaultEdgeSeparator
                  ),
                  closeable: false
                }
            }
          }
        />
      ),
      closeable: false,
    },
  ]);

  const waitOnClick = () => {
    return new Promise((resolve) => {
      tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
        resolve(0);
      });
    });
  };

  useEffect(() => {
    const adjacency: { [key: string]: NodeDetails[] } = {};

    for (const node of nodes) {
      adjacency[node.id] = [];
    }

    for (const { source, target, directed, weight } of edges) {
      if (directed) {
        adjacency[source.id].push({ nodeId: target.id, weight: weight ?? "" });
      } else {
        adjacency[source.id].push({ nodeId: target.id, weight: weight ?? "" });
        adjacency[target.id].push({ nodeId: source.id, weight: weight ?? "" });
      }
    }

    const visitedEdges: Record<string, Record<string, boolean>> = {};

    for (const node of nodes) {
      visitedEdges[node.id] = {};
    }

    const toNumber = (str: string) => (isNaN(Number(str)) ? 0 : Number(str));

    async function dijkstra(startId: string) {
      const minQ = new MinPriorityQueue((item: NodeDetails) =>
        toNumber(item.weight),
      );
      const visited = new Set<string>();

      minQ.enqueue({ nodeId: startId, weight: "0" });

      tutorialRef.current?.addTutorialStep({
        description: `Dodajemy wierzchołek ${startId} do kolejki priorytetowej jako punkt startowy algorytmu Dijkstry. To od niego rozpoczynamy wyznaczanie najkrótszych ścieżek do pozostałych wierzchołków grafu.`,
        node: { nodeId: startId },
        variables: {
          queue: minQ.toArray(),
          visited: Array.from<string>(visited),
          neighbours: adjacency[startId].map((node) => node.nodeId),
          node: startId,
        },
      });
      await waitOnClick();

      while (!minQ.isEmpty()) {
        const node = minQ.dequeue();

        if (!node) continue;

        if (visited.has(node.nodeId)) {
          tutorialRef.current?.addTutorialStep({
            description: `Usuwamy z kolejki wierzchołek ${node.nodeId}, jednak został on już wcześniej odwiedzony. Pomijamy go, aby uniknąć ponownego przetwarzania i zachować poprawność działania algorytmu Dijkstry.`,
            variables: {
              queue: minQ.toArray(),
              visited: Array.from<string>(visited),
              neighbours: adjacency[node.nodeId].map((node) => node.nodeId),
              node: node.nodeId,
            },
          });

          await waitOnClick();

          continue;
        }

        visited.add(node.nodeId);
        graphRef.current?.markNode({ nodeId: node.nodeId });

        tutorialRef.current?.addTutorialStep({
          description: `Usuwamy z kolejki priorytetowej wierzchołek o najmniejszej wadze ścieżki prowadzącej do niego z wierzchołka początkowego ${startId}. W tym kroku usuwamy wierzchołek ${node.nodeId} o łącznej wadze ścieżki równej ${node.weight}.`,
          node: { nodeId: node.nodeId },
          variables: {
            queue: minQ.toArray(),
            visited: Array.from<string>(visited),
            neighbours: adjacency[node.nodeId].map((node) => node.nodeId),
            node: node.nodeId,
          },
        });

        await waitOnClick();

        for (const nextNode of adjacency[node.nodeId]) {
          if (visited.has(nextNode.nodeId)) {
            tutorialRef.current?.addTutorialStep({
              description: `Krawędź ${node.nodeId} -- ${nextNode.nodeId}: Wierzchołek ${nextNode.nodeId} został już wcześniej odwiedzony. Pomijamy tę krawędź, aby uniknąć ponownego przetwarzania i zapewnić poprawność działania algorytmu Dijkstry.`,
              variables: {
                queue: minQ.toArray(),
                visited: Array.from<string>(visited),
                neighbours: adjacency[node.nodeId].map((node) => node.nodeId),
                node: node.nodeId,
              },
            });

            await waitOnClick();

            continue;
          }

          minQ.enqueue({
            nodeId: nextNode.nodeId,
            weight: (
              toNumber(nextNode.weight) + toNumber(node.weight)
            ).toString(),
          });

          graphRef.current?.markEdge({
            sourceId: node.nodeId,
            destinationId: nextNode.nodeId,
            directed: true,
          });
          tutorialRef.current?.addTutorialStep({
            description: `Krawędź ${node.nodeId} -- ${nextNode.nodeId}: Wierzchołek ${nextNode.nodeId} zostaje umieszczony w kolejce priorytetowej typu min z wartością priorytetu równą sumie dotychczasowego dystansu do ${node.nodeId} oraz wagi tej krawędzi.`,
            variables: {
              queue: minQ.toArray(),
              visited: Array.from<string>(visited),
              neighbours: adjacency[node.nodeId].map((node) => node.nodeId),
              node: node.nodeId,
            },
            edge: {
              sourceId: node.nodeId,
              destinationId: nextNode.nodeId,
              directed: true,
            },
          });

          await waitOnClick();
        }
      }
    }

    async function startTutorial() {
      tutorialRef.current?.addTutorialStep({
        description:
          "Dijkstra polega na znajdowaniu najkrótszej ścieżki od jednego wierzchołka do wszystkich pozostałych w grafie z dodatnimi wagami krawędzi. Zaczynamy od wierzchołka startowego i stopniowo odwiedzamy te wierzchołki, do których droga jest obecnie najkrótsza. Dla każdego z nich aktualizujemy odległości do sąsiadów, aż znajdziemy najkrótsze trasy do wszystkich punktów.",
        variables: { queue: [], visited: [], neighbours: [], node: "" },
        buttonText: "Start",
      });

      const nextButtonClickHandler = async () => {
        await runAlgorithm();
      };

      tutorialRef.current?.setNextButtonOnceClickHanlder(
        nextButtonClickHandler,
      );
    }

    async function resetTutorial() {
      tutorialRef.current?.resetTutorialSteps();
      graphRef.current?.resetMarks();
      await startTutorial()
    }

    async function runAlgorithm() {
      await dijkstra("1");

      tutorialRef.current?.addTutorialStep({
        description: `Wszystkie wierzchołki zostały odwiedzone.`,
        buttonText: "Restart",
      });

      tutorialRef.current?.setNextButtonOnceClickHanlder(resetTutorial);
    }

    startTutorial()
  }, [nodes, edges]);

  const graphVisualization = useMemo(
    () => (
      <GraphVisualization
        graphNodes={nodes}
        graphEdges={edges}
        ref={graphRef}
        className="h-full w-full grow"
      />
    ),
    [nodes, edges],
  );

  return (
    <div className="flex h-full flex-row items-center p-8">
      <Allotment
        className="h-full w-full"
        vertical={false}
        onChange={() => {
          graphRef.current?.handleResize();
        }}
      >
        <Allotment.Pane preferredSize="60%">
          {graphVisualization}
        </Allotment.Pane>

        <Allotment.Pane preferredSize="40%" className="bg-gray-dark">
          <Tabs
            className="flex h-full flex-col"
            tabs={tutorialTabs}
            setTabs={setTutorialTabs}
            setCurrentTab={setTutorialTabsCurrentTab}
            currentTab={tutorialTabsCurrentTab}
          />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default GraphDijkstraEducational;
