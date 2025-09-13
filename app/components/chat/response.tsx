import React, { useState } from 'react'

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
                children={children}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                        pre: ({ node, ...props }) => (
                        <pre
                            className="bg-gray-dark-850 text-gray-100 p-3 rounded-xl overflow-x-auto my-3"
                            {...props}
                        />
                        ),
                        code: ({ node, ...props }) => (
                        <code className="font-mono text-sm bg-gray-dark-850 p-1 rounded-xl" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                        <li className="mb-2" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                        <p className="mb-2" {...props} />
                        ),
                    }}
                />
        </span>
    )
}