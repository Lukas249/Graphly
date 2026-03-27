import { ChatRef } from "@/app/components/chat/types";
import { RefObject } from "react";
import { contextIcons, defaultContextIcon } from "./contextIcons";

export const addChatContext = (
  chatRef: RefObject<ChatRef | null>,
  type: string,
  label: string,
  selectedText: string,
  closeable: boolean,
) => {
  const icon =
    contextIcons[type as keyof typeof contextIcons] ?? defaultContextIcon;

  chatRef.current?.addContext(type, {
    icon,
    label,
    text: selectedText,
    closeable,
  });
};

export const addDynamicChatContext = (
  chatRef: RefObject<ChatRef | null>,
  type: string,
  label: string,
  dynamicText: () => string,
  closeable: boolean,
) => {
  const icon =
    contextIcons[type as keyof typeof contextIcons] ?? defaultContextIcon;

  chatRef.current?.addContext(type, {
    icon,
    label,
    dynamicText,
    closeable,
  });
};
