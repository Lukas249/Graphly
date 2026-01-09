import { MessageDetails } from "../components/chat/types";

export type ModelMessage = MessageDetails & { thoughtSignature?: string };
export type ModelResponse = { text: string; thoughtSignature?: string };
