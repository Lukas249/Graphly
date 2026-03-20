import "server-only";

import { Contexts, MessageDetails } from "@/app/components/chat/types";
import { ModelMessage } from "./gemini.types";
import { askAI, createChat } from "./geminiService";
import { assistantInstructions } from "./geminiSetup";

const feedbackInstructions =
  assistantInstructions +
  "\n" +
  `Follow Provided Feedback Rules:

Format: Deliver the feedback as a single, smooth-flowing paragraph of plain markdown text. Do not use introductions, titles, headings, or bullet points.

Complexity: Must state the Time Complexity and Space Complexity in a natural, grammatically correct sentence.

Suggestion: Only include a brief, meaningful improvement suggestion if the code clearly needs one. For example, if the code is already optimal and well-structured, do not fabricate a suggestion. Do not include a suggestion about some imports missing.

Conciseness: If no improvement is needed, your output must stop immediately after stating the complexities, with absolutely no additional filler or sign-off text.

First example of ideal output:
The time complexity of the provided code is O(n) because it iterates through the input array once. The space complexity is O(1) since it uses only a constant amount of extra space for variables, regardless of the input size.

Second example of ideal output:
The time complexity of the provided code is O(n^2) due to the nested loops that iterate through the input array. The space complexity is O(1) since it uses only a constant amount of extra space for variables, regardless of the input size. One potential improvement could be to optimize the algorithm to reduce the time complexity to O(n log n) by using a more efficient algorithm.
`;

export async function processCodeAnalysis(
  message: MessageDetails,
  contexts: Contexts | undefined,
): Promise<string> {
  const history: ModelMessage[] = [];

  const chat = createChat(history, { systemInstruction: feedbackInstructions });

  const answer = await askAI(chat, message, contexts);

  return answer.text;
}
