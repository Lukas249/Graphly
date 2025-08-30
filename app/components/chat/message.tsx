import React from "react"

export type MessageProps = {
    children: string
}

export default function Message({children} : MessageProps) {
    return (
        <span className="bg-[#353b45] rounded-lg p-2 max-w-1/2">
            {children}
        </span>
    )
}