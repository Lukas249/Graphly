"use client"

import React, {  RefObject, useEffect, useImperativeHandle, useRef, useState } from "react"
import Message from "./message";
import PaperAirplane from "@/app/icons/paper-airplane";
import { MessageDetails } from "./types";
import Response from "./response";

export type ChatRef = {
    addMessage: (message: MessageDetails) => void
}

type Props = {
    ref: RefObject<ChatRef | null>
    placeholder?: string
    onSend?: (newMessage: MessageDetails) => void;
}


export default function Chat({ref, placeholder, onSend} : Props) {
    const [messages, setMessages] = useState<MessageDetails[]>([]);
    const [input, setInput] = useState("");

    const bottomRef = useRef<HTMLDivElement>(null);

    const handleSend = (messageDetails: MessageDetails) => {
        addMessage(messageDetails)
        if(onSend) onSend(messageDetails)
        setInput("");
    };

    const addMessage = (messageDetails: MessageDetails) => {
        if (!messageDetails.msg.trim()) return;
        setMessages((prev) => [...prev, messageDetails]);
    }
    
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useImperativeHandle(ref, () => {
        return {
            addMessage
        }
    })

    return (
       <div className="flex flex-col h-full w-full bg-gray-dark p-1">
            <div className="flex-1 max-h-full overflow-y-auto flex flex-col justify-end relative">
                <div className="flex flex-col gap-2 overflow-auto py-4 items-end p-3">
                    {messages.map((msgDetails, i) => (
                        msgDetails.type == 'question' ? 
                            <Message key={i}>{msgDetails.msg}</Message> :
                            <Response key={i}>{msgDetails.msg}</Response>
                    ))}
                    <div ref={bottomRef}></div>
                </div>
               {
                !messages.length ? 
                    <p className="absolute top-1/2 -translate-1/2 left-1/2 text-gray text-center text-xl">
                        ASK AI ABOUT YOUR CODE, PROBLEM OR TESTCASES. YOU DON&apos;T NEED TO PASTE ANYTHING.
                    </p>
                : ""
               }
               <div className="relative">
                    <input
                        className="w-full resize-none outline-none border-2 rounded-xl border-gray py-4 px-8"
                        placeholder={placeholder}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSend({type: 'question', msg: input})
                            }
                        }}
                     />  
                    <button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => handleSend({type: 'question', msg: input})}>
                        <PaperAirplane  className="size-6 text-primary"/>
                    </button>
               </div>
            </div>
        </div>
    )
}