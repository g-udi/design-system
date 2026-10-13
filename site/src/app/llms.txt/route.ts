import { llmsTxt } from '@/lib/llms';

// The llms.txt index (https://llmstxt.org), prerendered: every docs page as a Markdown URL.
export const revalidate = false;

export function GET() {
  return new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
