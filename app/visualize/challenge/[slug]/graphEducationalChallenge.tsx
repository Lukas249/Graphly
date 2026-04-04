"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import GraphVisualization from "../../graphVisualization";
import { Edge, GraphHandle, Node } from "../../core/graphTypes";
import { TutorialRef, Tutorial } from "../../core/tutorial";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Tabs } from "@/app/components/tabs/tabs";
import Chat from "@/app/components/chat/chat";
import { askAI } from "@/app/lib/gemini-ai/ai";
import { ChatRef, MessageDetails } from "@/app/components/chat/types";
import AISelectionProvider from "@/app/components/providers/aiSelectionProvider";
import { stringifyGraph } from "@/app/lib/graph/graphSerializer";
import {
  defaultEdgeSeparator,
  defaultWeightSeparator,
} from "@/app/lib/graph/graphFormatConfig";
import { sendHandler } from "@/app/components/chat/sendHandler";
import GraphEditor from "../../core/graphEditor";
import { graphColors } from "../../core/defaultGraphColors";
import { ChallengeAlgorithmParams, ChallengeVisualizationRefs } from "./types";
import { Tab, TabsRef, TabTitle } from "@/app/components/tabs/types";
import {
  createRenderTab,
  createStaticTab,
} from "@/app/components/tabs/tabFactory";
import { addChatContext } from "@/app/components/chat/context/addChatContext";
import {
  contextIcons,
  contextLabels,
  getContextType,
} from "@/app/components/chat/context/contextIcons";
import { onChangeTab } from "@/app/components/tabs/onChangeTab";
import GuideContent from "../../[visualization]/guideContent";
import { formatContextHistoryStates } from "../../core/formatContextHistoryStates";
import { Adjacency, InitialStep } from "../../[visualization]/types";

const GRAPH_SPECIFICATION_CONTEXT_TEXT =
  "Graph is represented as text where '--' means undirected edge and '->' means directed edge. Weight is separated by ':'. For example, 'A--B:3' means there is an undirected edge between A and B with weight 3. 'C->D:' means there is a directed edge from C to D with no weight specified.";

function GraphEducationalChallenge({
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
  algorithm: (params: ChallengeAlgorithmParams) => Promise<void>;
  reset: (params: ChallengeVisualizationRefs) => void;
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

  const adjacencyRef = useRef<Adjacency>({});

  const [tutorialTabs] = useState<Tab[]>([
    createStaticTab(
      TabTitle.Tutorial,
      <AISelectionProvider
        buttonClickHandler={(__, selectedText) => {
          addChatContext(
            chatRef,
            crypto.randomUUID(),
            selectedText,
            selectedText,
            true,
          );
          tutorialTabsRef.current?.setCurrentTabByTitle(TabTitle.GraphlyAI);
        }}
      >
        <Tutorial
          ref={tutorialRef}
          graphRef={graphRef}
          variables={initialStep.variables}
          pseudocode={pseudocode}
          graphColors={graphColors}
          enablePrevButton={false}
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
            getContextType(contextLabels.graph),
            contextLabels.graph,
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
        onSend={async (message: MessageDetails) => {
          await sendHandler(chatRef, message, askAI);
        }}
        defaultContexts={{
          [getContextType(contextLabels.graph)]: {
            icon: contextIcons.graph,
            label: contextLabels.graph,
            text:
              GRAPH_SPECIFICATION_CONTEXT_TEXT +
              "\n" +
              stringifyGraph(
                nodes,
                edges,
                defaultWeightSeparator,
                defaultEdgeSeparator,
              ),
            closeable: false,
          },
          [getContextType(contextLabels.pseudocode)]: {
            icon: contextIcons.code,
            label: contextLabels.pseudocode,
            text: pseudocode,
            closeable: false,
          },
          [getContextType(contextLabels.visualizationStepsHistory)]: {
            icon: contextIcons.data,
            label: contextLabels.visualizationStepsHistory,
            dynamicText: () => {
              const historyStates =
                tutorialRef.current?.getHistoryStates() ?? [];

              return formatContextHistoryStates(historyStates);
            },
            closeable: false,
          },
        }}
      />,
    ),
  ]);

  const clickedNodePromiseRef = useRef<(node: string) => void>(null);

  const waitOnNodeClick = useCallback(() => {
    return new Promise<string>((resolve) => {
      clickedNodePromiseRef.current = resolve;
    });
  }, []);

  const onNodeClick = useCallback((nodeId: string) => {
    if (clickedNodePromiseRef.current) {
      clickedNodePromiseRef.current(nodeId);
    }
  }, []);

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

    adjacencyRef.current = adjacency;

    function restartChallenge() {
      tutorialRef.current?.resetTutorialSteps();
      graphRef.current?.resetMarks();
      reset({ graphRef, tutorialRef });
      startChallenge();
    }

    async function startChallenge() {
      graphRef.current?.toggleNodeSelection(true);

      tutorialRef.current?.addTutorialStep(initialStep);

      graphRef.current?.selectNode(
        graphRef.current?.getSelectedNode() ?? nodes[0]?.id ?? "",
      );

      tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
        startAlgorithm();
      });
    }

    async function startAlgorithm() {
      const fallbackNodeId = nodes[0]?.id ?? "";
      const selectedNode =
        graphRef.current?.getSelectedNode() ?? fallbackNodeId;

      if (!selectedNode) {
        tutorialRef.current?.addTutorialStep({
          description:
            "Graph has no vertices. Add at least one vertex to start the challenge.",
          buttonText: "Start challenge",
          variables: {
            currentNode: null,
            recursionPath: [],
          },
        });
        return;
      }

      graphRef.current?.toggleNodeSelection(false);
      tutorialRef.current?.toggleButton("next", false);

      await algorithm({
        selectedNode,
        graphRef,
        tutorialRef,
        adjacency,
        waitOnNodeClick,
      });

      tutorialRef.current?.toggleButton("next", true);

      tutorialRef.current?.addTutorialStep({
        description: `Challenge complete.`,
        buttonText: "Restart challenge",
      });

      tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
        restartChallenge();
      });
    }

    startChallenge();
  }, [algorithm, nodes, edges, initialStep, reset, waitOnNodeClick]);

  const graphVisualization = useMemo(
    () => (
      <GraphVisualization
        graphNodes={nodes}
        graphEdges={edges}
        isNodeSelectionEnabled={isNodeSelectionEnabled}
        onNodeClick={onNodeClick}
        ref={graphRef}
        className="h-full w-full grow"
      />
    ),
    [nodes, edges, onNodeClick, isNodeSelectionEnabled],
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

export default GraphEducationalChallenge;
