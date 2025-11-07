"use client";

import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function AISelectionProvider({
  children,
  buttonClickHandler,
}: {
  children: React.ReactNode;
  buttonClickHandler: (
    event: React.MouseEvent<HTMLSpanElement>,
    selectedText: string,
  ) => void;
}) {
  const [buttonPosition, setButtonPosition] = useState<{
    top: number;
    left: number;
    display: boolean;
  }>({ top: 0, left: 0, display: false });
  const [selectedText, setSelectedText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTextRef = useRef(selectedText);

  useEffect(() => {
    selectedTextRef.current = selectedText;
  }, [selectedText]);

  useEffect(() => {
    const updateButtonPosition = (ev: MouseEvent) => {
      setButtonPosition({
        left: _.clamp(ev.clientX, 0, window.innerWidth - 125),
        top: _.clamp(ev.clientY, 50, window.innerHeight - 50),
        display: true,
      });
    };

    const mouseMoveHandler = (ev: MouseEvent) => {
      updateButtonPosition(ev);
    };

    const mouseDownHandler = () => {
      document.addEventListener("mouseup", mouseUpHandler);
      document.addEventListener("mousemove", mouseMoveHandler);
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!selectedTextRef.current || !containerRect) {
        setButtonPosition(() => ({ top: 0, left: 0, display: false }));
        return;
      }
    };

    const mouseUpHandler = (ev: MouseEvent) => {
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
      updateButtonPosition(ev);
    };

    document.addEventListener("mousedown", mouseDownHandler);

    return () => document.removeEventListener("mousedown", mouseDownHandler);
  }, []);

  useEffect(() => {
    const selectionChangeHandler = () => {
      const selection = window.getSelection();

      if (!selection || !selection.rangeCount) {
        setSelectedText("");
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const { commonAncestorContainer } = range;

      const commonAncestorElement =
        commonAncestorContainer.nodeType !== Node.ELEMENT_NODE
          ? commonAncestorContainer.parentElement
          : (commonAncestorContainer as Element);

      const text = selection.toString();

      const wrapper = commonAncestorElement?.closest("[ai-selection]");

      if (
        wrapper &&
        wrapper === containerRef.current &&
        text.trim().length &&
        rect
      ) {
        setSelectedText(text);
      } else {
        setSelectedText("");
      }
    };

    document.addEventListener("selectionchange", selectionChangeHandler);

    const dragStartHandler = (e: DragEvent) => {
      const text = window.getSelection()?.toString() ?? "";
      if (text.length > 0) {
        e.preventDefault();
      }
    };

    document.addEventListener("dragstart", dragStartHandler);

    return () => {
      document.removeEventListener("selectionchange", selectionChangeHandler);
      document.removeEventListener("dragstart", dragStartHandler);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      ai-selection="true"
      className="drag-none relative h-full w-full"
    >
      {selectedText.length > 0 &&
        buttonPosition.display &&
        createPortal(
          <button
            className={`fixed z-10 cursor-pointer text-sm`}
            style={{
              transform: "translate(0, -150%)",
              top: buttonPosition?.top,
              left: buttonPosition?.left,
            }}
            onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
              buttonClickHandler(event, selectedText);
              setButtonPosition(() => ({ top: 0, left: 0, display: false }));
              window.getSelection()?.removeAllRanges();
            }}
          >
            <span className="bg-dark flex flex-row gap-1 rounded-lg px-2 py-1">
              Ask<span className="text-primary"> GraphlyAI</span>
            </span>
          </button>,
          document.body,
        )}
      {children}
    </div>
  );
}
