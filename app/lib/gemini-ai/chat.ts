import { MessageDetails } from "@/app/components/chat/types";
import { handleJSONResponse } from "../handleResponse";

export async function fetchChatHistory(
  chatSessionID: string,
): Promise<MessageDetails[]> {
  return handleJSONResponse(await fetch(`/api/gemini-ai/${chatSessionID}`));
}
