"use client";

import React, {
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Message from "./message";
import { MessageDetails } from "./types";
import Response from "./response";
import ChipCloseable from "../chip-closeable";
import Chip from "../chip";
import _ from "lodash";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

export type ChatRef = {
  addMessage: (message: MessageDetails) => void;
  addContext: (type: string, context: Context) => void
  getContexts: () => Record<string, Context>
};

export type Context = {
  icon?: React.ReactNode;
  text: string,
  closeable: boolean
}

type Props = {
  ref: RefObject<ChatRef | null>;
  onSend?: (messages: MessageDetails[]) => void;
  defaultMessages?: MessageDetails[]
  defaultContexts?: Record<string, Context>
};

export default function Chat({ ref, onSend, defaultMessages = [], defaultContexts = {} }: Props) {
  const [messages, setMessages] = useState<MessageDetails[]>(defaultMessages);
  const [contexts, setContexts] = useState(defaultContexts)
  const [input, setInput] = useState("");

  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)

  const handleSend = (messageDetails: MessageDetails) => {
    if (onSend) onSend([...messages, messageDetails]);
    addMessage(messageDetails);
    setInput("");
  };

  const addMessage = (messageDetails: MessageDetails) => {
    if (!messageDetails.msg.trim()) return;
    setMessages((prev) => [...prev, messageDetails]);
  };

  const addContext = (type: string, context: Context) => {
    if(!context.text.trim()) return
    setContexts((contexts) => {
      const clone = {...contexts}
      clone[type] = context
      return clone
    })
  }

  const getContexts = () => contexts;

  useEffect(() => {
    let i = messages.length - 1;

    while(i >= 0 && messages[i].type !== "question") {
      i--
    }

    if (i >= 0) {
      const messageElement: HTMLSpanElement | null = document.querySelector(`#message${i}`)
      messageElement?.scrollIntoView({ behavior: "smooth", block: "start"  });
      chatMessagesRef.current?.scrollTo({
        top: messageElement!.offsetTop - chatMessagesRef.current.offsetTop - 10,
        behavior: "smooth"
      });
    }
  }, [messages]);

  useImperativeHandle(ref, () => {
    return {
      addMessage,
      addContext,
      getContexts
    };
  });

  return (
    <div className="bg-gray-dark flex h-full w-full flex-col p-1">
      <div className="relative flex max-h-full flex-1 flex-col justify-end overflow-y-auto">
        <div ref={chatMessagesRef} className="flex flex-col items-end gap-2 overflow-auto p-3 py-4 h-full relative">
          {messages.map((msgDetails, i) =>
            msgDetails.type == "question" ? (
              <Message id={`message${i}`} key={i}>{msgDetails.msg}</Message>
            ) : (
              <Response id={`message${i}`} key={i}>{msgDetails.msg}</Response>
            ),
          )}
          {!messages.length && (
            <p className="text-gray absolute top-1/2 left-1/2 -translate-1/2 text-center text-xl">
                <span>
                  {"It's quiet here… ask me anything"}
                </span>
            </p>
          )}
        </div>
        <div className="border-gray border-2 my-2 px-3 py-2 rounded-xl">
          {Object.keys(contexts).length > 0 && 
            <div className="flex gap-1 flex-wrap">
              {
                Object.entries(contexts).map(([type, context]) => {
                  return (
                    context.closeable ? 
                      <ChipCloseable
                        key={crypto.randomUUID()}
                        icon={context.icon} 
                        text={context.text} 
                        className="border-gray text-white" 
                        textClassName="text-xs"
                        onClose={() => setContexts((contexts) => {
                          const clone = _.cloneDeep(contexts)
                          delete clone[type]
                          return clone
                        })}
                      /> :
                      <Chip
                        key={crypto.randomUUID()}
                        icon={context.icon} 
                        text={context.text} 
                        className="border-gray text-white" 
                        textClassName="text-xs"
                      />
                  )
                })
              }
            </div>
          }
          
          <textarea
            className="w-full resize-none my-2 outline-none py-3"
            placeholder={"Shift+Enter for new line"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendButtonRef.current?.click()
                return
              } 
            }}
          />
          <div className="flex justify-end">
            <button
              ref={sendButtonRef}
              className="cursor-pointer bg-white rounded-full p-2"
              onClick={() => {
                if(!input.trim()) {
                  return
                }

                handleSend({ type: "question", msg: input })
              }}
            >
              <ArrowUpIcon className="font-bold text-gray-dark size-5 stroke-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
