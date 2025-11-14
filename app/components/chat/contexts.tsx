import ChipCloseable from "../chip-closeable";
import { ContextItem, ContextItems } from "./types";
import _ from "lodash";
import Chip from "../chip";

export function Context({
  contextType,
  context,
  setContexts,
}: {
  contextType: string;
  context: ContextItem;
  setContexts: (value: React.SetStateAction<ContextItems>) => void;
}) {
  return context.closeable ? (
    <ChipCloseable
      icon={context.icon}
      text={context.text}
      className="border-gray text-white"
      textClassName="text-xs"
      onClose={() =>
        setContexts((contexts) => {
          const clone = _.cloneDeep(contexts);
          delete clone[contextType];
          return clone;
        })
      }
    />
  ) : (
    <Chip
      icon={context.icon}
      text={context.text}
      className="border-gray text-white"
      textClassName="text-xs"
    />
  );
}

export function Contexts({
  contexts,
  setContexts,
}: {
  contexts: ContextItems;
  setContexts: (value: React.SetStateAction<ContextItems>) => void;
}) {
  return Object.entries(contexts).map(([type, context]) => {
    return (
      <Context
        key={crypto.randomUUID()}
        contextType={type}
        context={context}
        setContexts={setContexts}
      />
    );
  });
}
