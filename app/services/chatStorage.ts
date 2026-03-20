import "server-only";

import { redis } from "@/app/lib/redis";
import { ModelMessage } from "./gemini.types";

const CHAT_CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h

const getChatHistoryKey = (chatSessionID: string): string =>
  `chat:${chatSessionID}:history`;

export async function getChatHistory(
  chatSessionID: string,
): Promise<ModelMessage[]> {
  const key = getChatHistoryKey(chatSessionID);
  const history = await redis.lRange(key, 0, -1);

  const parsedHistory: ModelMessage[] = [];

  for (const item of history) {
    try {
      parsedHistory.push(JSON.parse(item) as ModelMessage);
    } catch {
      // Ignore bad records so one bad entry doesn't break the whole chat history.
    }
  }

  return parsedHistory;
}

export async function addMessageToHistory(
  chatSessionID: string,
  messageDetails: ModelMessage,
): Promise<void> {
  if (!messageDetails) return;

  const key = getChatHistoryKey(chatSessionID);

  await redis.rPush(key, JSON.stringify(messageDetails));

  await redis.expire(key, CHAT_CACHE_TTL_SECONDS, "NX");
}
