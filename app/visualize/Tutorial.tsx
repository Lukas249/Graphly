import {
  useState,
  RefObject,
  useRef,
  useMemo,
  useEffect,
  useImperativeHandle,
} from "react";
import { GraphHandle, MarkEdgeProps, MarkNodeProps } from "./GraphTypes";
import HistoryState from "../lib/HistoryState";
import _ from "lodash";
import { GraphColors } from "./defaultGraphColors";
import useForceUpdate from "../hooks/useForceUpdate";

export type TutorialStep<TutorialVariables extends Record<string, unknown>> = {
  description?: string;
  node?: MarkNodeProps;
  edge?: MarkEdgeProps;
  isStep?: boolean;
  buttonText?: string;
  variables?: TutorialVariables;
};

export type TutorialRef<TutorialVariables extends Record<string, unknown>> = {
  setDescription: (description: string) => void;
  getDescription: () => string;
  setNextButtonText: (text: string) => void;
  setNextButtonOnceClickHanlder: (handler: () => void) => void;
  addTutorialStep: (step: TutorialStep<TutorialVariables>) => void;
  resetTutorialSteps: () => void;
};

export function Tutorial<TutorialVariables extends Record<string, unknown>>({
  ref,
  graphRef,
  variables,
  pseudocode,
  graphColors,
}: {
  ref: RefObject<TutorialRef<TutorialVariables> | null>;
  graphRef: RefObject<GraphHandle | null>;
  variables: TutorialVariables;
  pseudocode: string;
  graphColors: GraphColors;
}) {
  const [codeVariables, setCodeVariables] = useState(variables);

  const [description, setDescription] = useState<string>("");
  const [nextButtonText, setNextButtonText] = useState<string>("");

  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const historyStates = useMemo(
    () => new HistoryState<TutorialStep<TutorialVariables>>(),
    [],
  );

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        prevButtonRef.current?.click();
      } else if (event.key === "ArrowRight") {
        nextButtonRef.current?.click();
      }
    }

    const throttled = _.throttle(handleKeyPress, 250);

    window.addEventListener("keydown", throttled);

    return () => {
      window.removeEventListener("keydown", throttled);
    };
  }, []);

  function resetTutorialSteps() {
    historyStates.reset();
  }

  function addTutorialStep({
    description,
    node,
    edge,
    isStep = true,
    buttonText = "Next",
    variables,
  }: TutorialStep<TutorialVariables>) {
    historyStates.push({
      description,
      node,
      edge,
      isStep,
      buttonText,
      variables,
    });
    if (description) setDescription(description);
    if (nextButtonText != buttonText) setNextButtonText(buttonText);
    if (variables) setCodeVariables(variables);
  }

  const getDescription = () => {
    return description;
  };

  const setNextButtonOnceClickHanlder = (handler: () => void) => {
    if (!nextButtonRef.current) return;

    nextButtonRef.current.onclick = () => {
      if (historyStates.canGoForward()) {
        let nextState = historyStates.goForward();

        while (nextState && !nextState.isStep) {
          if (nextState?.edge) {
            graphRef.current?.markEdge({
              sourceId: nextState.edge.sourceId,
              destinationId: nextState.edge.destinationId,
              directed: nextState.edge.directed,
              edgeColor: nextState.edge.edgeColor,
              edgeHeadColor: nextState.edge.edgeHeadColor,
              edgeLabelColor: nextState.edge.edgeLabelColor,
            });
          }

          if (nextState?.node) {
            graphRef.current?.markNode({
              nodeId: nextState.node.nodeId,
              nodeColor: nextState.node.nodeColor,
              nodeLabelColor: nextState.node.nodeLabelColor,
              strokeColor: nextState.node.strokeColor,
            });
          }

          nextState = historyStates.goForward();
        }

        if (nextState?.edge) {
          graphRef.current?.markEdge({
            sourceId: nextState.edge.sourceId,
            destinationId: nextState.edge.destinationId,
            directed: nextState.edge.directed,
            edgeColor: nextState.edge.edgeColor,
            edgeHeadColor: nextState.edge.edgeHeadColor,
            edgeLabelColor: nextState.edge.edgeLabelColor,
          });
        }

        if (nextState?.node) {
          graphRef.current?.markNode({
            nodeId: nextState.node.nodeId,
            nodeColor: nextState.node.nodeColor,
            nodeLabelColor: nextState.node.nodeLabelColor,
            strokeColor: nextState.node.strokeColor,
          });
        }

        if (nextState?.description) setDescription(nextState.description);
        setNextButtonText(nextState?.buttonText ?? "Next");
        if (nextState?.variables) setCodeVariables(nextState.variables);
      } else {
        nextButtonRef.current!.onclick = null;
        handler();
      }
    };
  };

  const prevButtonClickHandler = () => {
    let currentState = historyStates.current();
    let prevState = historyStates.goBack();

    if (currentState?.node) {
      graphRef.current?.markNode({
        nodeId: currentState.node.nodeId,
        nodeColor: graphColors.nodeFill,
        strokeColor: graphColors.nodeStroke,
        nodeLabelColor: graphColors.nodeLabel,
      });
    }

    if (currentState?.edge) {
      graphRef.current?.markEdge({
        sourceId: currentState.edge.sourceId,
        destinationId: currentState.edge.destinationId,
        directed: currentState.edge.directed,
        edgeColor: graphColors.edge,
        edgeLabelColor: graphColors.edgeLabel,
        edgeHeadColor: graphColors.edgeHead,
      });
    }

    while (prevState && !prevState.isStep) {
      if (prevState?.edge) {
        graphRef.current?.markEdge({
          sourceId: prevState.edge.sourceId,
          destinationId: prevState.edge.destinationId,
          directed: prevState.edge.directed,
          edgeColor: graphColors.edge,
          edgeLabelColor: graphColors.edgeLabel,
          edgeHeadColor: graphColors.edgeHead,
        });
      }

      if (prevState?.node) {
        graphRef.current?.markNode({
          nodeId: prevState.node.nodeId,
          nodeColor: graphColors.nodeFill,
          strokeColor: graphColors.nodeStroke,
          nodeLabelColor: graphColors.nodeLabel,
        });
      }

      currentState = historyStates.current();
      prevState = historyStates.goBack();
    }

    if (prevState) {
      if (prevState?.description) setDescription(prevState.description);
      setNextButtonText(prevState?.buttonText ?? "Next");
      if (prevState?.variables) setCodeVariables(prevState.variables);
    } else {
      forceUpdate();
    }
  };

  const codeLines = [];

  for (const key in codeVariables) {
    codeLines.push(
      `${key} <- ${codeVariables[key] ? JSON.stringify(codeVariables[key]).replaceAll('"', "") : null}`,
    );
  }

  if (pseudocode) {
    codeLines.push(``, pseudocode);
  }

  useImperativeHandle<
    TutorialRef<TutorialVariables>,
    TutorialRef<TutorialVariables>
  >(ref, () => ({
    setDescription,
    getDescription,
    setNextButtonText,
    setNextButtonOnceClickHanlder,
    addTutorialStep,
    resetTutorialSteps,
  }));

  return (
    <div className="flex w-[40rem] flex-col gap-2">
      <div className="bg-gray-dark flex w-full flex-col items-center justify-between gap-5 rounded-lg p-5">
        <p>{description}</p>
        <div className="flex flex-row gap-2">
          {historyStates.canGoBack() && (
            <button
              className="btn inline-block"
              ref={prevButtonRef}
              onClick={prevButtonClickHandler}
            >
              Previous
            </button>
          )}
          <button className="btn inline-block" ref={nextButtonRef}>
            {nextButtonText}
          </button>
        </div>
      </div>

      <div className="bg-gray-dark flex w-full flex-col items-start justify-between gap-5 rounded-lg p-5 text-sm">
        <pre className="w-full">
          {codeLines.map((line, i) => (
            <div
              key={i}
              className={`w-full rounded-sm px-2 py-1 ${
                i == codeLines.length - 1 ? "bg-primary" : ""
              }`}
            >
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
