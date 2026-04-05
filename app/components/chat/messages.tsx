import React from "react";
import { CHAT_ROLES, MessageDetails } from "./types";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";

export type MessageProps = {
  id?: string;
  children: string;
};

export default function Response({ children }: MessageProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeHighlight, rehypeKatex]}
      components={{
        pre: ({ ...props }) => (
          <pre
            className="bg-gray-dark-850 my-3 overflow-x-auto rounded-xl p-3 text-gray-100"
            {...props}
          />
        ),
        code: ({ ...props }) => (
          <code
            className="bg-gray-dark-850 rounded-xl p-1 font-mono text-sm"
            {...props}
          />
        ),
        li: ({ ...props }) => <li className="mb-2" {...props} />,
        p: ({ ...props }) => <p className="mb-2" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

export function Message({ id, children }: MessageProps) {
  return (
    <span id={id} className="max-w-1/2 rounded-lg bg-[#353b45] p-2">
      {children}
    </span>
  );
}

export function MessagesHistory({ messages }: { messages: MessageDetails[] }) {
  return messages.map((message, i) =>
    message.role == CHAT_ROLES.USER ? (
      <Message id={`message${i}`} key={i}>
        {message.text}
      </Message>
    ) : (
      <div id={`message${i}`} key={i} className="w-full p-2">
        <Response>{message.text}</Response>
      </div>
    ),
  );
}
