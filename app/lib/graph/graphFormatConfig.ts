import { EdgeSeparator } from "./types";

export const defaultWeightSeparator = ":";

export const defaultEdgeSeparator: EdgeSeparator = new Map([
  ["directed", "->"],
  ["undirected", "--"],
]);
