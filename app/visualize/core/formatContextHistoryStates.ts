import { TutorialStep } from "./tutorial";

export function formatContextHistoryStates(
  historyStates: TutorialStep<Record<string, unknown>>[],
) {
  if (historyStates.length === 0) return "";

  let index = 0;

  return (
    `By default all vertices and edges are white. If node is visited or edge then it turns color to #19b5fe.` +
    historyStates
      .map((state) => {
        if (state.isStep) index++;

        return `
    ${state.isStep ? `<STEP_${index}>` : `<SUB_STEP_${index + 1}>`}
      ${state.description ? `Description: ${state.description}` : ""}
      ${state.node ? `Visited Node: ${JSON.stringify(state.node)}` : ""}
      ${state.edge ? `Visited Edge: ${JSON.stringify(state.edge)}` : ""}
      ${state.prevMarkings ? `Previous Marking: ${JSON.stringify(state.prevMarkings)}` : ""}
      ${state.nextMarkings ? `Current Marking: ${JSON.stringify(state.nextMarkings)}` : ""}
      ${state.transpose ? `Transpose Graph Flag: ${state.transpose}` : ""}
      ${state.variables ? `Variables: ${JSON.stringify(state.variables)}` : ""}
    ${state.isStep ? `</STEP_${index}>` : `</SUB_STEP_${index + 1}>`}`
          .split("\n")
          .filter((line) => !!line.trim())
          .join("\n");
      })
      .filter((value) => !!value)
      .join("\n")
  );
}
