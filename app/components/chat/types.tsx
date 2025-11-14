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
  getContexts: () => Record<string, ContextItem>;
  scrollToLastMessage: (role: CHAT_ROLES) => void;
};

export type Contexts = Record<string, string>;

export type ContextItem = {
  icon?: React.ReactNode;
  text: string;
  closeable: boolean;
};

export type ContextItems = Record<string, ContextItem>;
