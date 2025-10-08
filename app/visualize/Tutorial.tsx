import { useState, RefObject, useRef, useMemo, useEffect, useImperativeHandle } from "react";
import { GraphHandle } from "./GraphTypes";
import HistoryState from "../lib/HistoryState";
import _ from "lodash";
import { graphColors } from "./defaultGraphColors";
import useForceUpdate from "../hooks/useForceUpdate";

export type TutorialStep<TutorialVariables extends Record<string, unknown>> = {
  description?: string;
  nodeId?: string;
  edge?: { source: string; target: string };
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
  pseudocode
}: {
  ref: RefObject<TutorialRef<TutorialVariables> | null>;
  graphRef: RefObject<GraphHandle | null>;
  variables: TutorialVariables;
  pseudocode: string;
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
    nodeId,
    edge,
    isStep = true,
    buttonText = "Next",
    variables,
  }: TutorialStep<TutorialVariables>) {
    historyStates.push({
      description,
      nodeId,
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
            graphRef.current?.markEdge(
              nextState.edge.source,
              nextState.edge.target,
              graphColors.markedEdge,
              graphColors.markedEdgeLabel,
              graphColors.markedEdgeHead,
            );
          }

          nextState = historyStates.goForward();
        }

        if (nextState?.nodeId) {
          graphRef.current?.markNode(nextState.nodeId);
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

    if (currentState?.nodeId) {
      graphRef.current?.markNode(
        currentState.nodeId,
        graphColors.nodeFill,
        graphColors.nodeStroke,
        graphColors.nodeLabel,
      );
    }

    while (prevState && !prevState.isStep) {
      if (prevState?.edge) {
        graphRef.current?.markEdge(
          prevState.edge.source,
          prevState.edge.target,
          graphColors.edge,
          graphColors.edgeLabel,
          graphColors.edgeHead,
        );
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

  if(pseudocode) {
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