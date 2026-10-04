// Thin Netlify adapter. All logic lives in src/lib/router. Relative imports only: the
// function bundler is not relied on to resolve the "@/" alias.
import { handleRequest } from "../../src/lib/router/handler";

export default function handler(req: Request, ctx: { ip: string }): Promise<Response> {
  return handleRequest(req, { apiKey: process.env.ANTHROPIC_API_KEY, ip: ctx.ip });
}
