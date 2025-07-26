import type { NextApiRequest, NextApiResponse } from 'next'
 
export async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
 
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}