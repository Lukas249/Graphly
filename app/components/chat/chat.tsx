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
  AdjustmentsHorizontalIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  CHAT_ROLES,
  ChatRef,
  ContextItem,
  ContextItems,
  Contexts,
  MessageDetails,
} from "./types";
import Spinner from "../spinner";
import { fetchChatHistory } from "@/app/lib/gemini-ai/chat";
import { findLastMessage, scrollToMessage } from "./helpers";
import { MessagesHistory } from "./messages";
import { SendButton } from "./sendButton";
import ChatInput, { ChatInputRef } from "./chatInput";

import { defaultMessages as defaultChatMessages } from "./defaultMessages";

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
  defaultMessages = defaultChatMessages,
  defaultContexts = {},
  background = "bg-gray-dark",
}: Props) {
  const [messages, setMessages] = useState<MessageDetails[]>(defaultMessages);
  const [contexts, setContexts] = useState(defaultContexts);
  const [selectedContexts, setSelectedContexts] = useState<
    Partial<Record<string, boolean>>
  >({});
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const [isLoadingContent, setIsLoadingContent] = useState(true);

  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const chatInputRef = useRef<ChatInputRef>(null);

  const handleSend = async (messageDetails: MessageDetails) => {
    setIsLoadingContent(true);

    addMessage(messageDetails);
    chatInputRef.current?.setInput("");

    try {
      if (onSend) await onSend(messageDetails);
    } catch {
      addMessage({
        role: CHAT_ROLES.MODEL,
        text: "Sorry, something went wrong. Please try again.",
      });
    }

    setIsLoadingContent(false);
  };

  const addMessage = (messageDetails: MessageDetails) => {
    if (!messageDetails.text.trim()) return;
    setMessages((prev) => [...prev, messageDetails]);
  };

  const addContext = (type: string, context: ContextItem) => {
    const text = context.text ?? context.dynamicText?.();

    if (!text || !text?.trim()) return;

    setContexts((contexts) => {
      const clone = { ...contexts };
      clone[type] = context;
      return clone;
    });
  };

  useEffect(() => {
    setSelectedContexts((previous) => {
      const next: Partial<Record<string, boolean>> = {};

      for (const type of Object.keys(contexts)) {
        next[type] = previous[type] ?? true;
      }

      return next;
    });
  }, [contexts]);

  useEffect(() => {
    if (!isContextMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!contextMenuRef.current) return;

      if (!contextMenuRef.current.contains(event.target as Node)) {
        setIsContextMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isContextMenuOpen]);

  useEffect(() => {
    const chatSessionID = sessionStorage.getItem("chatSessionID");

    if (!chatSessionID) {
      sessionStorage.setItem("chatSessionID", crypto.randomUUID());
      setIsLoadingContent(false);
    } else {
      fetchChatHistory(chatSessionID)
        .then((res: MessageDetails[]) => {
          setMessages(defaultMessages.concat(res));
        })
        .finally(() => {
          setIsLoadingContent(false);
        });
    }
  }, [defaultMessages]);

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
      scrollToLastMessage,
    };
  });

  const sendButtonClickHandler = (text: string) => {
    if (!text.trim()) {
      return;
    }

    const contextsToSend: Contexts = {};

    for (const [type, context] of Object.entries(contexts)) {
      const contextType = type;
      const isSelected = selectedContexts[contextType] ?? true;

      if (isSelected) {
        contextsToSend[contextType] = context.text ?? context.dynamicText?.();
      }
    }

    handleSend({ role: CHAT_ROLES.USER, text, contexts: contextsToSend });
  };

  const removeContext = (contextType: string) => {
    setContexts((prev) => {
      const clone = { ...prev };
      delete clone[contextType];
      return clone;
    });

    setSelectedContexts((prev) => {
      const clone = { ...prev };
      delete clone[contextType];
      return clone;
    });
  };

  return (
    <div className={`${background} flex h-full w-full flex-col p-1`}>
      <div className="relative flex max-h-full flex-1 flex-col justify-end overflow-visible">
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
          <ChatInput ref={chatInputRef} sendButtonRef={sendButtonRef} />

          <div className="flex w-full items-center justify-between gap-2">
            {Object.keys(contexts).length > 0 && (
              <div className="relative" ref={contextMenuRef}>
                <button
                  className={`border-gray bg-base-200 hover:border-primary hover:text-primary flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm transition-colors ${
                    isContextMenuOpen
                      ? "border-primary text-primary"
                      : "text-white"
                  }`}
                  onClick={() => setIsContextMenuOpen((open) => !open)}
                  type="button"
                >
                  <AdjustmentsHorizontalIcon className="size-4" />
                  Context
                </button>

                {isContextMenuOpen && (
                  <div className="bg-base-200 border-gray absolute bottom-11 left-0 z-20 w-72 rounded-xl border p-3 text-white">
                    <div className="flex max-h-56 flex-col gap-1 overflow-auto">
                      {Object.entries(contexts).map(
                        ([contextType, context]) => {
                          const contextLabel = context.label;
                          const isSelected =
                            selectedContexts[contextType] ?? true;

                          return (
                            <div
                              key={contextType}
                              className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-left transition-colors ${
                                isSelected
                                  ? "bg-primary/12 border-primary/50 border text-white"
                                  : "border-primary/50 hover:bg-primary/12 border text-white"
                              }`}
                              onClick={() =>
                                setSelectedContexts((prev) => ({
                                  ...prev,
                                  [contextType]: !(prev[contextType] ?? true),
                                }))
                              }
                              title={context.label}
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                {context.icon && (
                                  <span
                                    className={
                                      isSelected ? "text-primary" : "text-gray"
                                    }
                                  >
                                    {context.icon}
                                  </span>
                                )}

                                <span className="truncate text-sm">
                                  {contextLabel}
                                </span>
                              </span>

                              <span className="ml-2 flex items-center gap-2">
                                {isSelected && (
                                  <CheckIcon className="text-primary size-4 shrink-0" />
                                )}

                                {context.closeable && (
                                  <button
                                    type="button"
                                    className="text-gray hover:text-primary cursor-pointer"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      removeContext(contextType);
                                    }}
                                  >
                                    <XMarkIcon className="size-4 shrink-0" />
                                  </button>
                                )}
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="ml-auto flex size-9 items-center justify-center">
              {isLoadingContent ? (
                <Spinner size="1.5rem" color="white" />
              ) : (
                <SendButton
                  sendButtonRef={sendButtonRef}
                  clickHandler={() =>
                    sendButtonClickHandler(chatInputRef.current?.input ?? "")
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
