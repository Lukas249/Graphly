import React, { ReactNode } from "react"

type ListProps = {
  children: ReactNode
}

export default function CollapsibleVerticalMenu({ children }: ListProps) {
    return (
      <ul className="daisyui-menu bg-base-200 rounded-box w-56 h-min">
        {children}
      </ul>
    )
}