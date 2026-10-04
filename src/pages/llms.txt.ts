import type { APIRoute } from 'astro';
import { llmsText } from '../data/seo';

// https://llmstxt.org: a plain-text summary for AI agents and assistants.
export const GET: APIRoute = () =>
  new Response(llmsText(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
