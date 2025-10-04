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
import { ArrowUpIcon } from "@heroicons/react/24/outline";

export type ChatRef = {
  addMessage: (message: MessageDetails) => void;
};

type Props = {
  ref: RefObject<ChatRef | null>;
  placeholder?: string;
  onSend?: (newMessage: MessageDetails) => void;
};

export default function Chat({ ref, placeholder, onSend }: Props) {
  const [messages, setMessages] = useState<MessageDetails[]>([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = (messageDetails: MessageDetails) => {
    addMessage(messageDetails);
    if (onSend) onSend(messageDetails);
    setInput("");
  };

  const addMessage = (messageDetails: MessageDetails) => {
    if (!messageDetails.msg.trim()) return;
    setMessages((prev) => [...prev, messageDetails]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useImperativeHandle(ref, () => {
    return {
      addMessage,
    };
  });

  return (
    <div className="bg-gray-dark flex h-full w-full flex-col p-1">
      <div className="relative flex max-h-full flex-1 flex-col justify-end overflow-y-auto">
        <div className="flex flex-col items-end gap-2 overflow-auto p-3 py-4">
          {messages.map((msgDetails, i) =>
            msgDetails.type == "question" ? (
              <Message key={i}>{msgDetails.msg}</Message>
            ) : (
              <Response key={i}>{msgDetails.msg}</Response>
            ),
          )}
          <div ref={bottomRef}></div>
        </div>
        {!messages.length ? (
          <p className="text-gray absolute top-1/2 left-1/2 -translate-1/2 text-center text-xl">
            {
              "ASK AI ABOUT YOUR CODE, PROBLEM OR TESTCASES. YOU DON'T NEED TO PASTE ANYTHING."
            }
          </p>
        ) : (
          ""
        )}
        <div className="relative">
          <input
            className="border-gray w-full resize-none rounded-xl border-2 px-8 py-4 outline-none"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend({ type: "question", msg: input });
              }
            }}
          />
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2"
            onClick={() => handleSend({ type: "question", msg: input })}
          >
              <ArrowUpIcon className="font-bold text-gray-dark size-5 stroke-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
