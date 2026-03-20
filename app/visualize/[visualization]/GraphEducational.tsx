"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import GraphVisualization from "../GraphVisualization";
import { Edge, GraphHandle, Node } from "../core/GraphTypes";
import { TutorialRef, Tutorial } from "../core/Tutorial";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Tabs } from "@/app/components/tabs/tabs";
import Chat from "@/app/components/chat/chat";
import { askAI } from "@/app/lib/gemini-ai/ai";
import { ChatRef, MessageDetails } from "@/app/components/chat/types";
import AISelectionProvider from "@/app/components/providers/ai-selection-provider";
import { stringifyGraph } from "@/app/lib/graph/graphSerializer";
import {
  defaultEdgeSeparator,
  defaultWeightSeparator,
} from "@/app/lib/graph/graphFormatConfig";
import { sendHandler } from "@/app/components/chat/sendHandler";
import _ from "lodash";
import GraphEditor from "../core/GraphEditor";
import { graphColors } from "../core/defaultGraphColors";
import {
  Adjacency,
  AlgorithmFunction,
  InitialStep,
  VisualizationRefs,
} from "./types";
import { Tab, TabsRef, TabTitle } from "@/app/components/tabs/types";
import {
  createRenderTab,
  createStaticTab,
} from "@/app/components/tabs/tabFactory";
import { addChatContext } from "@/app/components/chat/context/addChatContext";
import { contextIcons } from "@/app/components/chat/context/contextIcons";
import { onChangeTab } from "@/app/components/tabs/onChangeTab";
import GuideContent from "./GuideContent";

const GRAPH_SPECIFICATION_CONTEXT_TEXT =
  "Graph represented as text where '--' means undirected edge and '->' means directed edge. Weight is separated by ':'";

function GraphEducational({
  graphNodes,
  graphEdges,
  pseudocode,
  algorithm,
  reset,
  initialStep,
  isNodeSelectionEnabled,
  guideText,
}: {
  graphNodes: Node[];
  graphEdges: Edge[];
  pseudocode: string;
  algorithm: AlgorithmFunction;
  reset: (params: VisualizationRefs) => void;
  initialStep: InitialStep;
  isNodeSelectionEnabled: boolean;
  guideText: string;
}) {
  const [nodes, setNodes] = useState(graphNodes);
  const [edges, setEdges] = useState(graphEdges);

  const graphRef = useRef<GraphHandle>(null);
  const tutorialRef = useRef<TutorialRef<Record<string, unknown>>>(null);

  const tutorialTabsRef = useRef<TabsRef>(null);

  const chatRef = useRef<ChatRef>(null);

  const [tutorialTabs] = useState<Tab[]>([
    createStaticTab(
      TabTitle.Tutorial,
      <AISelectionProvider
        buttonClickHandler={(__, selectedText) => {
          addChatContext(chatRef, "description", selectedText, true);
        }}
      >
        <Tutorial
          ref={tutorialRef}
          graphRef={graphRef}
          variables={initialStep.variables}
          pseudocode={pseudocode}
          graphColors={graphColors}
        />
      </AISelectionProvider>,
    ),
    createStaticTab(
      TabTitle.Guide,
      <GuideContent
        guideText={guideText}
        isNodeSelectionEnabled={isNodeSelectionEnabled}
      />,
    ),
    createRenderTab(TabTitle.Graph, () => (
      <GraphEditor
        userNodes={nodes}
        userEdges={edges}
        onChange={(nodes, edges) => {
          setNodes(nodes);
          setEdges(edges);

          addChatContext(
            chatRef,
            "graph",
            stringifyGraph(
              nodes,
              edges,
              defaultWeightSeparator,
              defaultEdgeSeparator,
            ),
            false,
          );
        }}
      />
    )),
    createStaticTab(
      TabTitle.GraphlyAI,
      <Chat
        ref={chatRef}
        onSend={async (message: MessageDetails) =>
          await sendHandler(chatRef, message, askAI)
        }
        defaultContexts={{
          graph: {
            icon: contextIcons.graph,
            text: stringifyGraph(
              nodes,
              edges,
              defaultWeightSeparator,
              defaultEdgeSeparator,
            ),
            closeable: false,
          },
          graphSpecification: {
            icon: contextIcons.graphSpecification,
            text: GRAPH_SPECIFICATION_CONTEXT_TEXT,
            closeable: false,
          },
        }}
      />,
    ),
  ]);

  const waitOnClick = () => {
    addChatContext(
      chatRef,
      "visualizationStepHistory",
      JSON.stringify(tutorialRef.current?.getHistoryStates()),
      false,
    );

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

    async function startTutorial() {
      tutorialRef.current?.addTutorialStep(initialStep);

      const nextButtonClickHandler = async () => {
        await runAlgorithm();
      };

      tutorialRef.current?.setNextButtonOnceClickHanlder(
        nextButtonClickHandler,
      );
    }

    async function resetTutorial(selectedNode: string) {
      tutorialRef.current?.resetTutorialSteps();
      graphRef.current?.resetMarks();
      reset({ graphRef, tutorialRef });
      graphRef.current?.selectNode(selectedNode);
      await startTutorial();
    }

    async function runAlgorithm() {
      const selectedNode = graphRef.current?.getSelectedNode() ?? "";

      if (isNodeSelectionEnabled) {
        graphRef.current?.resetMarks();

        tutorialRef.current?.addTutorialStep({
          description: `Algorithm initiated at vertex ${selectedNode}.`,
          variables: initialStep.variables,
        });
        await waitOnClick();
      }

      await algorithm({
        graphRef,
        tutorialRef,
        waitOnClick,
        nodes: _.cloneDeep(nodes),
        edges: _.cloneDeep(edges),
        adjacency: _.cloneDeep(adjacency),
        selectedNode,
      });

      tutorialRef.current?.addTutorialStep({
        description: `Algorithm execution completed.`,
        buttonText: "Restart",
      });

      tutorialRef.current?.setNextButtonOnceClickHanlder(
        resetTutorial.bind(null, selectedNode),
      );
    }

    startTutorial();
  }, [nodes, edges, algorithm, initialStep, isNodeSelectionEnabled, reset]);

  const graphVisualization = useMemo(
    () => (
      <GraphVisualization
        graphNodes={nodes}
        graphEdges={edges}
        isNodeSelectionEnabled={isNodeSelectionEnabled}
        ref={graphRef}
        className="h-full w-full grow"
      />
    ),
    [nodes, edges, isNodeSelectionEnabled],
  );

  return (
    <div className="flex h-full flex-row items-center p-8">
      <Allotment className="h-full w-full" vertical={false}>
        <Allotment.Pane preferredSize="60%">
          {graphVisualization}
        </Allotment.Pane>

        <Allotment.Pane preferredSize="40%" className="bg-gray-dark">
          <Tabs
            ref={tutorialTabsRef}
            className="flex h-full flex-col"
            initialTabs={tutorialTabs}
            onChangeTab={(currentTab) => {
              onChangeTab(chatRef, tutorialTabs[currentTab]);
            }}
          />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default GraphEducational;
