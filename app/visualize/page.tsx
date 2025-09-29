"use client";

import Menu from "../menu";
import GraphDFSEducational from "./GraphDFSEducational";

export default function Visualize() {
  return (
    <div className="flex h-screen flex-col">
      <Menu />
      <GraphDFSEducational />
    </div>
  );
}
