import React from "react";
import { CHAT_ROLES, MessageDetails } from "./types";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export type MessageProps = {
  id?: string;
  children: string;
};

export default function Response({ id, children }: MessageProps) {
  return (
    <span id={id} className="w-full p-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
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
    </span>
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
      <Response id={`message${i}`} key={i}>
        {message.text}
      </Response>
    ),
  );
}
