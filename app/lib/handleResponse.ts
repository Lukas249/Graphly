export async function handleJSONResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`${response.status}: ${error.error}`);
  }
  return await response.json();
}
