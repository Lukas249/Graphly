import { RefObject } from "react";
import { CHAT_ROLES, MessageDetails } from "./types";

export const scrollToMessage = (
  messageElement: HTMLElement,
  chatMessagesRef: RefObject<HTMLElement | null>,
) => {
  requestAnimationFrame(() => {
    messageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    chatMessagesRef.current?.scrollTo({
      top: messageElement.offsetTop - chatMessagesRef.current.offsetTop - 10,
      behavior: "smooth",
    });
  });
};

export const findLastMessage = (
  messages: MessageDetails[],
  role: CHAT_ROLES,
  prefixID: string,
): HTMLElement | null => {
  let i = messages.length - 1;

  while (i >= 0 && messages[i].role !== role) {
    i--;
  }

  return document.querySelector(`#${prefixID}${i}`);
};
