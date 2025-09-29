export const askAI = async (question: string): Promise<string> => {
  const response = await fetch("/api/gemini-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  return await response.json();
};
