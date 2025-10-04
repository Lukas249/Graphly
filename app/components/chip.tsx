import React from "react";

export default function Chip({ icon, text, className, textClassName } : { icon?: React.ReactNode, text: React.ReactNode, className?: string, textClassName?: string }) {
  return (
    <div className={`max-w-32 inline-flex justify-center gap-1 rounded-md items-center px-2 py-1 border border-gray text-white ${className}`}>
      {icon && <div className="flex-none">{icon}</div>}
      <div className={`whitespace-nowrap overflow-hidden text-ellipsis ${textClassName}`}>{text}</div>
    </div>
  )
}