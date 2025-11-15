import { ContextTypes } from "@/app/components/chat/context/types";

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
  addContext: (type: ContextTypes, context: ContextItem) => void;
  getContexts: () => ContextItems;
  scrollToLastMessage: (role: CHAT_ROLES) => void;
};

export type Contexts = Partial<Record<ContextTypes, string>>;

export type ContextItem = {
  icon?: React.ReactNode;
  text: string;
  closeable: boolean;
};

export type ContextItems = Partial<Record<ContextTypes, ContextItem>>;
