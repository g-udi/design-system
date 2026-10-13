import { llmsFullTxt } from '@/lib/llms';

// Every docs page as one Markdown document, prerendered.
export const revalidate = false;

export function GET() {
  return new Response(llmsFullTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
