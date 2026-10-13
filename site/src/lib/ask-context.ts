// Retrieval for Ask AI: the Fumadocs search index (the same one ⌘K uses) plus a small lexical
// score over each page's Markdown, so generated component pages (whose content is mostly
// catalogue data, not MDX text) are found by name, props and descriptions too.
import { createFromSource } from 'fumadocs-core/search/server';
import { exampleMarkdown, orderedPages, pageMarkdown } from '@/lib/llms';
import { source, type DocsPage } from '@/lib/source';

const search = createFromSource(source, { language: 'english' });

const STOP = new Set('a an and are as at be by can do does for from how i if in into is it its me my of on or should that the this to use using what when where which why with you your gaudi design system component components'.split(' '));
const words = (text: string) => [...new Set(text.toLowerCase().match(/[a-z0-9][a-z0-9-]*/g) || [])].filter((word) => word.length > 1 && !STOP.has(word));

interface Indexed { page: DocsPage; title: string; titleWords: Set<string>; description: string; body: string }
let index: Indexed[] | null = null;
const getIndex = () => (index ??= orderedPages().map((page) => ({
  page,
  title: page.data.title.toLowerCase(),
  titleWords: new Set(words(page.data.title.replace(/([a-z])([A-Z])/g, '$1 $2')).concat(words(page.data.title))),
  description: (page.data.description || '').toLowerCase(),
  body: pageMarkdown(page, 'summary').toLowerCase()
})));

const count = (haystack: string, needle: string) => {
  let total = 0;
  for (let at = haystack.indexOf(needle); at !== -1 && total < 12; at = haystack.indexOf(needle, at + needle.length)) total += 1;
  return total;
};

/** The most relevant pages for a question, best first. */
export async function retrieve(query: string, limit = 5): Promise<DocsPage[]> {
  const terms = words(query);
  const lower = query.toLowerCase();
  const scores = new Map<DocsPage, number>();
  for (const entry of getIndex()) {
    let score = 0;
    for (const term of terms) {
      if (entry.titleWords.has(term)) score += 12;
      else if (entry.title.includes(term)) score += 5;
      if (entry.description.includes(term)) score += 3;
      score += count(entry.body, term) * 0.5;
    }
    // Naming a component outright ("DataTable", "date picker") is the strongest signal.
    if (entry.title.length > 2 && new RegExp(`(^|[^a-z0-9])${entry.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(lower)) score += 25;
    if (score > 0) scores.set(entry.page, score);
  }
  try {
    const results = await search.search(query);
    const seen: string[] = [];
    for (const result of results) {
      const url = result.url.split('#')[0];
      if (!seen.includes(url)) seen.push(url);
    }
    seen.slice(0, 10).forEach((url, rank) => {
      const page = getIndex().find((entry) => entry.page.url === url)?.page;
      if (page) scores.set(page, (scores.get(page) || 0) + 20 / (rank + 1));
    });
  } catch {
    // The lexical score alone still works.
  }
  return [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([page]) => page);
}

/**
 * Numbered context blocks for the prompt, each page trimmed to keep the request small. The two
 * best matches also carry a few of their copyable example sources (real, working usage).
 */
export function contextFor(pages: DocsPage[], perPage = 12000, total = 40000) {
  let budget = total;
  return pages.map((page, index) => {
    const examples = index < 2 ? exampleMarkdown(page, 3500) : '';
    const markdown = examples ? `${pageMarkdown(page, 'summary')}\n\n${examples}` : pageMarkdown(page, 'summary');
    const room = Math.max(1500, Math.min(perPage, budget));
    budget -= Math.min(markdown.length, room);
    const body = markdown.length > room ? `${markdown.slice(0, room)}\n…(truncated)` : markdown;
    return `[${index + 1}] ${page.data.title} (${page.url})\n${body}`;
  }).join('\n\n----\n\n');
}
