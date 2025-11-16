"use client";

import React, {
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  CHAT_ROLES,
  ChatRef,
  ContextItem,
  ContextItems,
  MessageDetails,
} from "./types";
import Spinner from "../spinner";
import { fetchChatHistory } from "@/app/lib/gemini-ai/chat";
import { findLastMessage, scrollToMessage } from "./helpers";
import { MessagesHistory } from "./messages";
import { Contexts } from "./contexts";
import { SendButton } from "./sendButton";
import { ContextTypes } from "@/app/components/chat/context/types";
import ChatInput, { ChatInputRef } from "./chatInput";

type Props = {
  ref: RefObject<ChatRef | null>;
  onSend?: (message: MessageDetails) => Promise<void>;
  defaultMessages?: MessageDetails[];
  defaultContexts?: ContextItems;
  background?: string;
};

export default function Chat({
  ref,
  onSend,
  defaultMessages = [],
  defaultContexts = {},
  background = "bg-gray-dark",
}: Props) {
  const [messages, setMessages] = useState<MessageDetails[]>(defaultMessages);
  const [contexts, setContexts] = useState(defaultContexts);

  const [isLoadingContent, setIsLoadingContent] = useState(true);

  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  const chatInputRef = useRef<ChatInputRef>(null);

  const handleSend = async (messageDetails: MessageDetails) => {
    setIsLoadingContent(true);

    addMessage(messageDetails);
    chatInputRef.current?.setInput("");

    if (onSend) await onSend(messageDetails);

    setIsLoadingContent(false);
  };

  const addMessage = (messageDetails: MessageDetails) => {
    if (!messageDetails.text.trim()) return;
    setMessages((prev) => [...prev, messageDetails]);
  };

  const addContext = (type: ContextTypes, context: ContextItem) => {
    if (!context.text.trim()) return;
    setContexts((contexts) => {
      const clone = { ...contexts };
      clone[type] = context;
      return clone;
    });
  };

  const getContexts = () => contexts;

  useEffect(() => {
    const chatSessionID = sessionStorage.getItem("chatSessionID");

    if (!chatSessionID) {
      sessionStorage.setItem("chatSessionID", crypto.randomUUID());
    } else {
      fetchChatHistory(chatSessionID)
        .then((res: MessageDetails[]) => {
          setMessages(res);
        })
        .finally(() => {
          setIsLoadingContent(false);
        });
    }
  }, []);

  const scrollToLastMessage = useCallback(
    (role: CHAT_ROLES) => {
      const lastUserMessage = findLastMessage(messages, role, "message");

      if (lastUserMessage) {
        scrollToMessage(lastUserMessage, chatMessagesRef);
      }
    },
    [messages, chatMessagesRef],
  );

  useEffect(() => {
    scrollToLastMessage(CHAT_ROLES.USER);
  }, [scrollToLastMessage]);

  useImperativeHandle(ref, () => {
    return {
      addMessage,
      addContext,
      getContexts,
      scrollToLastMessage,
    };
  });

  const buttonClickHandler = (text: string) => {
    if (!text.trim()) {
      return;
    }

    handleSend({ role: CHAT_ROLES.USER, text });
  };

  return (
    <div className={`${background} flex h-full w-full flex-col p-1`}>
      <div className="relative flex max-h-full flex-1 flex-col justify-end overflow-y-auto">
        <div
          ref={chatMessagesRef}
          className="relative flex h-full flex-col items-end gap-2 overflow-auto p-3 py-4"
        >
          <MessagesHistory messages={messages} />
          {!messages.length && (
            <p className="text-gray absolute top-1/2 left-1/2 -translate-1/2 text-center text-xl">
              <span>{"It's quiet here… ask me anything"}</span>
            </p>
          )}
        </div>
        <div className="border-gray my-2 rounded-xl border-2 px-3 py-2">
          {Object.keys(contexts).length > 0 && (
            <div className="flex flex-wrap gap-1">
              <Contexts contexts={contexts} setContexts={setContexts} />
            </div>
          )}

          <ChatInput ref={chatInputRef} sendButtonRef={sendButtonRef} />
          <div className="flex size-9 items-center justify-center justify-self-end">
            {isLoadingContent ? (
              <Spinner size="1.5rem" color="white" />
            ) : (
              <SendButton
                sendButtonRef={sendButtonRef}
                clickHandler={() =>
                  buttonClickHandler(chatInputRef.current?.input ?? "")
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
