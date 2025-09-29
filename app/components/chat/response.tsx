import React from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export type MessageProps = {
  children: string;
};

export default function Response({ children }: MessageProps) {
  return (
    <span className="w-full p-2">
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
