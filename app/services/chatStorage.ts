import { redis } from "../lib/redis";
import { ModelMessage } from "./gemini.types";

const CHAT_TTL = 60 * 60 * 24; // 24h

const getChatHistoryKey = (chatSessionID: string): string =>
  `chat:${chatSessionID}:history`;

export async function getChatHistory(
  chatSessionID: string,
): Promise<ModelMessage[]> {
  const key = getChatHistoryKey(chatSessionID);
  const history = await redis.lRange(key, 0, -1);
  return history.map((v) => JSON.parse(v));
}

export async function addMessageToHistory(
  chatSessionID: string,
  messageDetails: ModelMessage,
): Promise<void> {
  if (!messageDetails) return;

  const key = getChatHistoryKey(chatSessionID);

  await redis.rPush(key, JSON.stringify(messageDetails));

  await redis.expire(key, CHAT_TTL, "NX");
}
