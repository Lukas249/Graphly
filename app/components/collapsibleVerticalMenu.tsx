import React, { ReactNode } from "react";

type ListProps = {
  children: ReactNode;
};

export default function CollapsibleVerticalMenu({ children }: ListProps) {
  return (
    <ul className="daisyui-menu bg-base-200 rounded-box h-min w-56">
      {children}
    </ul>
  );
}
