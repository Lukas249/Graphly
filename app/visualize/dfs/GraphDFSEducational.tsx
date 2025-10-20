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
      variables={{ node: "", neighbours: [], visited: [] }}
      pseudocode={dfsPseudocode}
      graphColors={graphColors}
    />
  );

  const chatRef = useRef<ChatRef>(null);

  const [tutorialTabs, setTutorialTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Tutorial",
      content: tutorial,
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
          onSend={async (messages: MessageDetails[]) => {
            const chatContexts = chatRef.current?.getContexts();

            const contexts: Record<string, string> = {};

            if (chatContexts) {
              for (const [key, value] of Object.entries(chatContexts)) {
                contexts[key] = value.text;
              }
            }

            const answer = await askAI(messages, contexts);
            chatRef.current?.addMessage({ type: "response", msg: answer });
          }}
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

        await dfs(neighbor, visited);
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

    async function runAlgorithm() {
      await dfs("1");

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

        const nextButtonClickHandler = async () => {
          await runAlgorithm();
        };

        tutorialRef.current?.setNextButtonOnceClickHanlder(
          nextButtonClickHandler,
        );
      };

      tutorialRef.current?.setNextButtonOnceClickHanlder(buttonClickHandler);
    }

    tutorialRef.current?.setNextButtonOnceClickHanlder(runAlgorithm);
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
        <Allotment.Pane preferredSize="75%">
          {graphVisualization}
        </Allotment.Pane>

        <Allotment.Pane preferredSize="25%" className="bg-gray-dark">
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

export default GraphDFSEducational;
