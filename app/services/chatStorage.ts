import "server-only";

import { redis } from "@/app/lib/redis";
import { logger } from "@/app/lib/logger";
import { ModelMessage } from "./gemini.types";

const CHAT_CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h

const getChatHistoryKey = (chatSessionID: string): string =>
  `chat:${chatSessionID}:history`;

export async function getChatHistory(
  chatSessionID: string,
): Promise<ModelMessage[]> {
  const key = getChatHistoryKey(chatSessionID);
  let history: string[] = [];

  try {
    history = await redis.lRange(key, 0, -1);
  } catch (err) {
    logger.warn("Failed to fetch chat history from Redis", {
      chatSessionID,
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }

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

  try {
    await redis.rPush(key, JSON.stringify(messageDetails));
    await redis.expire(key, CHAT_CACHE_TTL_SECONDS, "NX");
  } catch (err) {
    logger.warn("Failed to save chat history to Redis", {
      chatSessionID,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
