import { CHAT_ROLES, ChatRef } from "@/app/components/chat/types";
import { Tab, TabTitle } from "@/app/components/tabs/types";
import { RefObject } from "react";

export function onChangeTab(chatRef: RefObject<ChatRef | null>, tab: Tab) {
  if (tab.title === TabTitle.GraphlyAI) {
    chatRef.current?.scrollToLastMessage(CHAT_ROLES.USER);
  }
}
