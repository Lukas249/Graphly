import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export default function ChipCloseable(
  { icon, text, onClose, className, textClassName } : 
  { icon?: React.ReactNode, text: string, onClose: () => void, className?: string, textClassName?: string }
) {
  const [isVisible, setIsVisible] = useState(true)
  
  return (
    <>
      {
        isVisible && <div className={`max-w-32 inline-flex justify-center gap-1 rounded-md items-center px-2 py-1 border border-gray text-white ${className}`}>
          {icon && <div className="flex-none">{icon}</div>}
          <div className={`whitespace-nowrap overflow-hidden text-ellipsis ${textClassName}`}>{text}</div>
          <span onClick={() => {
            setIsVisible(false)
            onClose()
          }} className="cursor-pointer flex-none">
            <XMarkIcon className="size-3"/>
          </span>
        </div>
      }
    </>
  )
}