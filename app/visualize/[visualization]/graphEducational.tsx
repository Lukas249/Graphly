"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import GraphVisualization from "../graphVisualization";
import { Edge, GraphHandle, Node } from "../core/graphTypes";
import { TutorialRef, Tutorial } from "../core/tutorial";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Tabs } from "@/app/components/tabs/tabs";
import Chat from "@/app/components/chat/chat";
import { askAI } from "@/app/lib/gemini-ai/ai";
import { ChatRef, MessageDetails } from "@/app/components/chat/types";
import AISelectionProvider from "@/app/components/providers/aiSelectionProvider";
import { buildAdjacency } from "@/app/lib/graph/buildAdjacency";
import { GRAPH_SPECIFICATION_CONTEXT_TEXT } from "@/app/lib/graph/graphSpecificationText";
import { stringifyGraph } from "@/app/lib/graph/graphSerializer";
import {
  defaultEdgeSeparator,
  defaultWeightSeparator,
} from "@/app/lib/graph/graphFormatConfig";
import { sendHandler } from "@/app/components/chat/sendHandler";
import _ from "lodash";
import GraphEditor from "../core/graphEditor";
import { graphColors } from "../core/defaultGraphColors";
import { AlgorithmFunction, InitialStep, VisualizationRefs } from "./types";
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
import GuideContent from "./guideContent";
import { formatContextHistoryStates } from "../core/formatContextHistoryStates";
import { toast } from "react-toastify";

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

  const waitOnClick = () => {
    return new Promise((resolve) => {
      tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
        resolve(0);
      });
    });
  };

  useEffect(() => {
    const adjacency = buildAdjacency(nodes, edges);

    function resetTutorial(isFullReset: boolean = true) {
      tutorialRef.current?.resetTutorialSteps();
      graphRef.current?.resetMarks();

      if (isFullReset) {
        reset({ graphRef, tutorialRef });
      }
    }

    function startTutorial() {
      graphRef.current?.toggleNodeSelection(true);

      if (tutorialRef.current?.getHistoryStates().length === 0) {
        tutorialRef.current?.addTutorialStep(initialStep);
      }

      graphRef.current?.selectNode(
        graphRef.current?.getSelectedNode() ?? nodes[0]?.id ?? "",
      );

      tutorialRef.current?.setNextButtonOnceClickHanlder(async () => {
        await runAlgorithm();
      });
    }

    async function runAlgorithm() {
      const fallbackNodeId = nodes[0]?.id ?? "";
      const selectedNode =
        graphRef.current?.getSelectedNode() ?? fallbackNodeId;

      if (!selectedNode) {
        toast.error(
          "No nodes in the graph. Please add at least one node to start the visualization.",
        );
        return;
      }

      graphRef.current?.toggleNodeSelection(false);
      graphRef.current?.resetMarks();

      await algorithm({
        graphRef,
        tutorialRef,
        waitOnClick,
        nodes: _.cloneDeep(nodes),
        edges: _.cloneDeep(edges),
        adjacency: _.cloneDeep(adjacency),
        selectedNode,
        waitOnNodeClick,
        initialStep,
      });

      tutorialRef.current?.setNextButtonOnceClickHanlder(() => {
        resetTutorial();
        startTutorial();
      });
    }

    startTutorial();

    return () => {
      resetTutorial(false);
    };
  }, [nodes, edges, algorithm, initialStep, reset, waitOnNodeClick]);

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
    [nodes, edges, isNodeSelectionEnabled, onNodeClick],
  );

  return (
    <div className="flex h-full max-w-layout relative left-1/2 -translate-x-1/2 flex-row items-center p-8">
      <Allotment className="h-full w-full" vertical={false}>
        <Allotment.Pane preferredSize="60%">
          {graphVisualization}
        </Allotment.Pane>

        <Allotment.Pane preferredSize="40%" className="bg-gray-dark absolute left-[60%]">
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
