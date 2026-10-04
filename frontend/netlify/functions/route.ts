// Stub for the values-router function. Replaced by the real router in a later task.
// Declared locally (instead of importing from @netlify/functions) to avoid an extra dependency.
export type Context = { ip: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function handler(_req: Request, _context: Context): Response {
  return new Response(JSON.stringify({ outcome: "picker", reason: "unavailable" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
