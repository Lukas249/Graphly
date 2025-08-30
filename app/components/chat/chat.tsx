"use client"

import React, { FC, ReactElement, useState } from "react"
import Message, { MessageProps } from "./message";
import PaperAirplane from "@/app/icons/paper-airplane";

type Props = {
    placeholder?: string
    children?: ReactElement<MessageProps, typeof Message>
    | ReactElement<MessageProps, typeof Message>[]; 
    onSend?: (newMessage: string) => void;
}

export default function Chat({placeholder, children, onSend} : Props) {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    
    const handleSend = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, input]);
        if(onSend) onSend(input)
        setInput("");
    };

    return (
        <div className="h-96 bg-base-200 p-8 flex flex-col justify-end">
            {messages.map((msg, i) => (
                <Message key={i}>{msg}</Message>
            ))}
            {children}
            <textarea
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}>    
            </textarea>
            <button onClick={handleSend}><PaperAirplane  className="size-6"/></button>
        </div>
    )
}