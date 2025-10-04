import React from "react";

export default function Chip({
  icon,
  text,
  className,
  textClassName,
}: {
  icon?: React.ReactNode;
  text: React.ReactNode;
  className?: string;
  textClassName?: string;
}) {
  return (
    <div
      className={`border-gray inline-flex max-w-32 items-center justify-center gap-1 rounded-md border px-2 py-1 text-white ${className}`}
    >
      {icon && <div className="flex-none">{icon}</div>}
      <div
        className={`overflow-hidden text-ellipsis whitespace-nowrap ${textClassName}`}
      >
        {text}
      </div>
    </div>
  );
}
