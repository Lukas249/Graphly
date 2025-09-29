import React from 'react'

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export type MessageProps = {
    children: string
}

export default function Response({children} : MessageProps) {
   
    return (
        <span className="p-2 w-full">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                        pre: ({ ...props }) => (
                            <pre
                                className="bg-gray-dark-850 text-gray-100 p-3 rounded-xl overflow-x-auto my-3"
                                {...props}
                            />
                        ),
                        code: ({ ...props }) => (
                            <code className="font-mono text-sm bg-gray-dark-850 p-1 rounded-xl" {...props} />
                        ),
                        li: ({ ...props }) => (
                            <li className="mb-2" {...props} />
                        ),
                        p: ({ ...props }) => (
                            <p className="mb-2" {...props} />
                        ),
                    }}
                >
                    {children}
                </ReactMarkdown>
        </span>
    )
}