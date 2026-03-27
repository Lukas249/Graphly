export enum CHAT_ROLES {
  USER = "user",
  MODEL = "model",
}

export type MessageDetails = {
  role: CHAT_ROLES;
  text: string;
  contexts?: Contexts;
};

export type ChatRef = {
  addMessage: (message: MessageDetails) => void;
  addContext: (type: string, context: ContextItem) => void;
  scrollToLastMessage: (role: CHAT_ROLES) => void;
};

export type Contexts = Record<string, string>;

type ContextItemBase = {
  icon: React.ReactNode;
  label: string;
  closeable: boolean;
};

export type ContextItem = ContextItemBase &
  (
    | { text: string; dynamicText?: never }
    | { text?: never; dynamicText: () => string }
  );

export type ContextItems = Record<string, ContextItem>;
