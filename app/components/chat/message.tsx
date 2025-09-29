import React from "react";

export type MessageProps = {
  children: string;
};

export default function Message({ children }: MessageProps) {
  return (
    <span className="max-w-1/2 rounded-lg bg-[#353b45] p-2">{children}</span>
  );
}
