import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export default function ChipCloseable({
  icon,
  text,
  onClose,
  className,
  textClassName,
}: {
  icon?: React.ReactNode;
  text: string;
  onClose: () => void;
  className?: string;
  textClassName?: string;
}) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {isVisible && (
        <div
          className={`border-gray inline-flex max-w-32 items-center justify-center gap-1 rounded-md border px-2 py-1 text-white ${className}`}
        >
          {icon && <div className="flex-none">{icon}</div>}
          <div
            className={`overflow-hidden text-ellipsis whitespace-nowrap ${textClassName}`}
          >
            {text}
          </div>
          <span
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="flex-none cursor-pointer"
          >
            <XMarkIcon className="size-3" />
          </span>
        </div>
      )}
    </>
  );
}
