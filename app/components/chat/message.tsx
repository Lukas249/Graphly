import React from "react";

export type MessageProps = {
  id?: string
  children: string;
};

export default function Message({ id, children }: MessageProps) {
  return (
    <span id={id} className="max-w-1/2 rounded-lg bg-[#353b45] p-2">{children}</span>
  );
}
