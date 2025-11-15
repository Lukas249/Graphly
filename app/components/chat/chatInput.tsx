import {
  Dispatch,
  RefObject,
  SetStateAction,
  useImperativeHandle,
  useState,
} from "react";

export type ChatInputRef = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
};

export default function ChatInput({
  ref,
  sendButtonRef,
}: {
  ref: RefObject<ChatInputRef | null>;
  sendButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const [input, setInput] = useState("");

  useImperativeHandle(ref, () => {
    return {
      input,
      setInput,
    };
  });

  return (
    <textarea
      className="my-2 w-full resize-none py-3 outline-none"
      placeholder={"Shift+Enter for new line"}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendButtonRef.current?.click();
          return;
        }
      }}
    />
  );
}
