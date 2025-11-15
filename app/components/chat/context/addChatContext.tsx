import { ChatRef } from "@/app/components/chat/types";
import { RefObject } from "react";
import { contextIcons } from "./contextIcons";
import { ContextTypes } from "./types";

export const addChatContext = (
  chatRef: RefObject<ChatRef | null>,
  type: ContextTypes,
  selectedText: string,
  closeable: boolean,
) => {
  chatRef.current?.addContext(type, {
    icon: contextIcons[type],
    text: selectedText,
    closeable,
  });
};
