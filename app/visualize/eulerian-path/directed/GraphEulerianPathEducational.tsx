"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import GraphVisualization from "../../GraphVisualization";
import { Edge, GraphHandle, Node } from "../../GraphTypes";
import { TutorialRef, Tutorial } from "../../Tutorial";
import { graphColors } from "../../defaultGraphColors";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Tab, Tabs } from "@/app/components/tabs";
import GraphEditor from "../../custom/graphEditor";
import Chat, { ChatRef } from "@/app/components/chat/chat";
import { askAI } from "@/app/lib/ai";
import { MessageDetails } from "@/app/components/chat/types";
import AISelectionProvider from "@/app/lib/AISelectionProvider";
import { DocumentTextIcon, MapIcon } from "@heroicons/react/24/outline";
import { stringifyGraph } from "@/app/lib/graph/graphSerializer";
import {
  defaultEdgeSeparator,
  defaultWeightSeparator,
} from "@/app/lib/graph/graphFormatConfig";
import { sendHandler } from "@/app/components/chat/sendHandler";
import _ from "lodash";
import { ArticleParagraph } from "@/app/learn/dfs/page";

const dfsPseudocode = `procedure EulerPath(V)
    for each edge (V, U) in Graph:
        remove edge (V, U) from Graph
        EulerPath(U)
    add V to path`;

type Variables = {
  node: string;
  neighbours: string[];
  path: string[];
};

type NodeDetails = {
  nodeId: string;
  weight: string;
};

type Adjacency = {
  [key: string]: NodeDetails[];
};

function InfoContent() {
  return (
    <div className="mx-7">
      <ArticleParagraph>
        Możesz dowolnie modyfikować graf w zakładce Graph.
        <ul className="list-disc pl-4">
          <li>
            Aby utworzyć krawędź nieskierowaną między wierzchołkami, użyj{" "}
            {<pre className="inline-block">--</pre>}
          </li>
          <li>
            Aby utworzyć krawędź skierowaną między wierzchołkami, użyj{" "}
            {<pre className="inline-block">{"->"}</pre>}
          </li>
          <li>
            Jeśli chcesz dodać wagę krawędzi, podaj ją po dwukropku{" "}
            {<pre className="inline-block">:</pre>}
          </li>
        </ul>
      </ArticleParagraph>

      <ArticleParagraph>
        Przed uruchomieniem algorytmu możesz wybrać wierzchołek początkowy.
        Kliknij dowolny wierzchołek, aby ustawić go jako punkt startowy.
      </ArticleParagraph>

      <ArticleParagraph>
        W algorytmie znajdowania ścieżki/cyklu Eulera kluczowe jest rozpoczęcie
        z odpowiedniego wierzchołka. W przypadku grafu skierowanego:
        <ul className="list-disc pl-4">
          <li>
            jeśli dokładnie jeden wierzchołek ma o jedną krawędź więcej
            wychodzącą niż wchodzącą (to będzie początek ścieżki), dokładnie
            jeden wierzchołek ma o jedną krawędź więcej wchodzącą niż wychodzącą
            (to będzie koniec ścieżki) i wszystkie pozostałe wierzchołki mają
            równą liczbę krawędzi wchodzących i wychodzących.
          </li>
          <li>
            jeśli wszystkie wierzchołki mają równą liczbę krawędzi wchodzących i
            wychodzących, algorytm może rozpocząć się z dowolnego wierzchołka
          </li>
        </ul>
      </ArticleParagraph>
    </div>
  );
}

const graphTypeContext = `"Graph represented as text where '--' means undirected edge and '->' means directed edge. Weight is separated by ':'"`;

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
      variables={{ queue: [], node: "", neighbours: [], path: [] }}
      pseudocode={dfsPseudocode}
      graphColors={graphColors}
    />
  );

  const chatRef = useRef<ChatRef>(null);

  const [tutorialTabs, setTutorialTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Tutorial",
      content: (
        <AISelectionProvider
          buttonClickHandler={(__, selectedText) => {
            chatRef.current?.addContext("description", {
              icon: (
                <DocumentTextIcon className="stroke-primary size-3.5 fill-transparent" />
              ),
              text: selectedText,
              closeable: true,
            });
          }}
        >
          {tutorial}
        </AISelectionProvider>
      ),
      closeable: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Guide",
      content: <InfoContent />,
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
            chatRef.current?.addContext(graphTypeContext, {
              icon: (
                <MapIcon className="stroke-primary size-3.5 fill-transparent" />
              ),
              text: stringifyGraph(
                nodes,
                edges,
                defaultWeightSeparator,
                defaultEdgeSeparator,
              ),
              closeable: false,
            });
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
          onSend={(messages: MessageDetails[]) =>
            sendHandler(chatRef, messages, askAI)
          }
          defaultContexts={{
            [graphTypeContext]: {
              icon: (
                <MapIcon className="stroke-primary size-3.5 fill-transparent" />
              ),
              text: stringifyGraph(
                nodes,
                edges,
                defaultWeightSeparator,
                defaultEdgeSeparator,
              ),
              closeable: false,
            },
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
    const adjacency: Adjacency = {};

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

    async function eulerianPath(
      node: string,
      adjacency: Adjacency,
      path: string[] = [],
    ) {
      const neighbours = adjacency[node];

      while (neighbours.length) {
        const neighbor = neighbours.pop();

        graphRef.current?.markEdge({
          sourceId: node,
          destinationId: neighbor?.nodeId ?? "",
        });
        tutorialRef.current?.addTutorialStep({
          description: `Usuwamy krawędź ${node}--${neighbor?.nodeId}`,
          edge: { sourceId: node, destinationId: neighbor?.nodeId ?? "" },
          variables: {
            path: [...path],
            neighbours: neighbours.map((neighbour) => neighbour.nodeId),
            node: node,
          },
        });
        await waitOnClick();

        await eulerianPath(neighbor?.nodeId ?? "", adjacency, path);
      }

      path.push(node);
      graphRef.current?.markNode({ nodeId: node });
      tutorialRef.current?.addTutorialStep({
        description: `Dodajemy wierzchołek ${node} do path`,
        node: { nodeId: node },
        variables: {
          path: [...path],
          neighbours: neighbours.map((neighbour) => neighbour.nodeId),
          node: node,
        },
      });
      await waitOnClick();
    }

    async function startTutorial() {
      tutorialRef.current?.addTutorialStep({
        description:
          "Ścieżka i cykl Eulera polegają na przejściu przez wszystkie krawędzie grafu dokładnie raz. Ścieżka zaczyna się w jednym wierzchołku i kończy w innym, cykl zaczyna się i kończy w tym samym wierzchołku.",
        variables: { path: [], neighbours: [], node: "" },
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
      await startTutorial();
    }

    async function runAlgorithm() {
      const selectedNode = graphRef.current?.getSelectedNode() ?? "";

      graphRef.current?.resetMarks();

      tutorialRef.current?.addTutorialStep({
        description: `Algorytm zaczynamy z wybranego wierzchołka ${selectedNode}`,
        variables: { path: [], neighbours: [], node: "" },
      });
      await waitOnClick();

      await eulerianPath(selectedNode, _.cloneDeep(adjacency));

      tutorialRef.current?.addTutorialStep({
        description: `Algorytm zakończył działanie`,
        buttonText: "Restart",
      });

      tutorialRef.current?.setNextButtonOnceClickHanlder(resetTutorial);
    }

    startTutorial();
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
