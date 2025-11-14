import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { RefObject } from "react";

export function SendButton({
  sendButtonRef,
  clickHandler,
}: {
  sendButtonRef: RefObject<HTMLButtonElement | null>;
  clickHandler: () => void;
}) {
  return (
    <button
      ref={sendButtonRef}
      className="cursor-pointer rounded-full bg-white p-2"
      onClick={clickHandler}
    >
      <ArrowUpIcon className="text-gray-dark size-5 stroke-2 font-bold" />
    </button>
  );
}
