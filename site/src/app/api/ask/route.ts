import { contextFor, retrieve } from '@/lib/ask-context';

// Ask AI: retrieve the relevant docs pages, answer from their Markdown with OpenAI, stream it back.
// POST-only (never prerendered), so a static export simply has no /api/ask and hides the button.
//
// Response: one JSON line `{ "sources": [{ title, url, description }] }`, then the answer text as
// it streams. Errors before streaming are JSON `{ error }` with a 4xx/5xx status.

const MAX_QUESTION = 500;
const MAX_HISTORY = 6;
const MAX_HISTORY_CHARS = 4000;
const RATE_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT = 12;

const hits = new Map<string, number[]>();

/** In-memory sliding window per client IP (per server instance; enough to blunt abuse). */
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < RATE_WINDOW);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return Math.ceil((RATE_WINDOW - (now - recent[0])) / 1000);
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [key, times] of hits) if (!times.some((time) => now - time < RATE_WINDOW)) hits.delete(key);
  return 0;
}

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

interface Turn { role: 'user' | 'assistant'; content: string }

const SYSTEM = `You are the documentation assistant for the Gaudi Design System (the React package @gaudi/design-system).
Answer only from the numbered documentation pages provided. Cite the pages you rely on inline as [1], [2] (or [1, 3]) using their numbers; never invent page numbers, URLs, components, props or imports.
If the pages do not cover the question, say so briefly and point to the closest page.
Write concise Markdown: short paragraphs or lists, code in fenced blocks with a language (jsx, tsx, css, bash). Use the public imports shown in the docs (for example @gaudi/design-system/core/Button). No raw HTML.`;

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return json({ error: 'Ask AI is not configured on this server.' }, 503);

  const ip = (request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'local').trim();
  const retryAfter = rateLimited(ip);
  if (retryAfter) return json({ error: `Too many questions. Try again in ${Math.ceil(retryAfter / 60)} min.` }, 429, { 'Retry-After': String(retryAfter) });

  let body: { question?: unknown; history?: unknown };
  try { body = await request.json(); } catch { return json({ error: 'Send JSON: { "question": "…" }.' }, 400); }
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (!question) return json({ error: 'Ask a question.' }, 400);
  if (question.length > MAX_QUESTION) return json({ error: `Keep questions under ${MAX_QUESTION} characters.` }, 413);
  const history: Turn[] = (Array.isArray(body.history) ? body.history : [])
    .filter((turn): turn is Turn => Boolean(turn) && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.content === 'string')
    .slice(-MAX_HISTORY)
    .map((turn) => ({ role: turn.role, content: turn.content.slice(0, MAX_HISTORY_CHARS) }));

  // Follow-ups ("and its props?") retrieve with the previous question for context.
  const previous = [...history].reverse().find((turn) => turn.role === 'user')?.content || '';
  const pages = await retrieve(`${question} ${previous}`.trim());
  const sources = pages.map((page) => ({ title: page.data.title, url: page.url, description: page.data.description || '' }));

  const model = process.env.OPENAI_MODEL || 'gpt-5-mini';
  const reasoning = /^(gpt-5|o\d)/.test(model) ? { reasoning_effort: 'low' } : {};
  let upstream: Response;
  try {
    upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: true,
        max_completion_tokens: 2500,
        ...reasoning,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'system', content: pages.length ? `Documentation pages:\n\n${contextFor(pages)}` : 'No documentation page matched this question.' },
          ...history,
          { role: 'user', content: question }
        ]
      }),
      signal: request.signal
    });
  } catch {
    return json({ error: 'Could not reach the model. Try again.' }, 502);
  }
  if (!upstream.ok || !upstream.body) {
    // Never forward the upstream body: it can echo account details.
    console.error(`Ask AI: upstream responded ${upstream.status}`);
    return json({ error: upstream.status === 429 ? 'The assistant is busy. Try again shortly.' : 'The assistant could not answer. Try again.' }, 502);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(`${JSON.stringify({ sources })}\n`));
      let buffer = '';
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (!data || data === '[DONE]') continue;
            try {
              const text = JSON.parse(data).choices?.[0]?.delta?.content;
              if (text) controller.enqueue(encoder.encode(text));
            } catch { /* partial or keep-alive line */ }
          }
        }
      } catch {
        if (!request.signal.aborted) controller.enqueue(encoder.encode('\n\n_The answer was interrupted._'));
      }
      controller.close();
    },
    cancel() {
      reader.cancel().catch(() => {});
    }
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' } });
}
