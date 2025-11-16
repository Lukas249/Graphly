import {
  useState,
  RefObject,
  useRef,
  useMemo,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  GraphHandle,
  MarkEdgeProps,
  Markings,
  MarkNodeProps,
} from "./GraphTypes";
import HistoryState from "../lib/HistoryState";
import _ from "lodash";
import { GraphColors } from "./defaultGraphColors";
import useForceUpdate from "../hooks/useForceUpdate";

export type TutorialStep<TutorialVariables extends Record<string, unknown>> = {
  description?: string;
  node?: MarkNodeProps;
  edge?: MarkEdgeProps;
  transpose?: boolean;
  prevMarkings?: Markings;
  nextMarkings?: Markings;
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
    transpose = false,
    prevMarkings = undefined,
    nextMarkings = undefined,
  }: TutorialStep<TutorialVariables>) {
    historyStates.push({
      description,
      node,
      edge,
      isStep,
      buttonText,
      variables,
      transpose,
      prevMarkings,
      nextMarkings,
    });
    if (description) setDescription(description);
    if (nextButtonText != buttonText) setNextButtonText(buttonText);
    if (variables) setCodeVariables(variables);
  }

  const getDescription = () => {
    return description;
  };

  const handleState = (
    state: TutorialStep<TutorialVariables> | null,
    isNextState: boolean = true,
  ) => {
    if (state?.edge) {
      graphRef.current?.markEdge({
        sourceId: state.edge.sourceId,
        destinationId: state.edge.destinationId,
        directed: state.edge.directed,
        edgeColor: isNextState ? state.edge.edgeColor : graphColors.edge,
        edgeLabelColor: isNextState
          ? state.edge.edgeLabelColor
          : graphColors.edgeLabel,
        edgeHeadColor: isNextState
          ? state.edge.edgeHeadColor
          : graphColors.edgeHead,
      });
    }

    if (state?.node) {
      graphRef.current?.markNode({
        nodeId: state.node.nodeId,
        nodeColor: isNextState ? state.node.nodeColor : graphColors.nodeFill,
        strokeColor: isNextState
          ? state.node.strokeColor
          : graphColors.nodeStroke,
        nodeLabelColor: isNextState
          ? state.node.nodeLabelColor
          : graphColors.nodeLabel,
      });
    }

    if (state?.transpose) {
      graphRef.current?.transpose();
    }

    if (state?.nextMarkings && isNextState) {
      graphRef.current?.setMarkings(state.nextMarkings);
    } else if (state?.prevMarkings && !isNextState) {
      graphRef.current?.setMarkings(state.prevMarkings);
    }
  };

  const setNextButtonOnceClickHanlder = (handler: () => void) => {
    if (!nextButtonRef.current) return;

    nextButtonRef.current.onclick = () => {
      if (historyStates.canGoForward()) {
        let nextState = historyStates.goForward();

        while (nextState && !nextState.isStep) {
          handleState(nextState);
          nextState = historyStates.goForward();
        }

        handleState(nextState);

        if (nextState?.description) setDescription(nextState.description);
        setNextButtonText(nextState?.buttonText ?? "Next");
        if (nextState?.variables) setCodeVariables(nextState.variables);
      } else {
        handler();
      }
    };
  };

  const prevButtonClickHandler = () => {
    const currentState = historyStates.current();
    let prevState = historyStates.goBack();

    handleState(currentState, false);

    while (prevState && !prevState.isStep) {
      handleState(prevState, false);
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
    <div className="flex w-full flex-col gap-2 px-2">
      <div className="bg-gray-dark flex w-full flex-col items-center justify-between gap-5 rounded-lg p-5">
        <p>{description}</p>
      </div>

      <div className="bg-gray-dark-850 flex w-full flex-col items-start justify-between gap-5 rounded-lg p-5 text-sm">
        <pre className="w-full whitespace-pre-wrap">
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

      <div className="flex flex-row items-center justify-center gap-2">
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
  );
}
