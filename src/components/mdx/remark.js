/**
 * Remark plugins for Gaudi MDX: `remarkCode` for fenced code, `remarkAlerts` for GitHub alerts
 *
 * @description Prepares fenced code for the Gaudi `CodeFence` (`pre`) and `CodeGroup`
 * MDX components, so articles render code through CodeBlock instead of build-time HTML.
 * Fence meta becomes `data-*` attributes on the generated `<code>`:
 *
 *   ```tsx title="app/page.tsx" {2,4-6} showLineNumbers{10} /useState/
 *
 * `title=` or `caption=` (or a bare file path) sets the header title, `{…}` highlights
 * lines, `showLineNumbers{n}` shows the gutter from line n, and `/word/` highlights words.
 * Fences between `::: code-group labels=[A, B]` and `:::` become one `<CodeGroup>`,
 * each fence titled by its label unless it has its own title.
 *
 * @example
 * // contentlayer.config.js
 * import { remarkAlerts, remarkCode } from '@gaudi/design-system/mdx/remark';
 * remarkPlugins: [remarkGfm, remarkCode, remarkAlerts]
 */

const textOf = (node) => node.value ?? (node.children || []).map(textOf).join('');

/** Parses fence meta into the `data-*` attributes CodeFence reads. */
export function fenceMeta(meta) {
  if (!meta) return {};
  let rest = ` ${meta} `;
  const take = (pattern) => {
    const match = rest.match(pattern);
    if (match) rest = rest.replace(match[0], ' ');
    return match;
  };
  const props = {};
  const title = take(/\s(?:title|caption)="([^"]*)"/);
  const lineNumbers = take(/\sshowLineNumbers(?:\{(\d+)\})?(?=\s)/);
  const lines = take(/\s\{([\d,\s-]+)\}(?=\s)/);
  const words = [];
  let word;
  while ((word = take(/\s\/((?:[^/\\\s]|\\.)+)\/(?:#[\w-]+)?(?=\s)/))) words.push(word[1].replace(/\\(.)/g, '$1'));
  const path = rest.trim().split(/\s+/).find((token) => /[./]/.test(token) && !token.includes('='));
  if (title || path) props['data-title'] = title ? title[1] : path;
  if (lines) props['data-highlight'] = lines[1].replace(/\s+/g, '');
  if (lineNumbers) {
    props['data-line-numbers'] = '';
    if (lineNumbers[1]) props['data-start-line'] = lineNumbers[1];
  }
  if (words.length) props['data-words'] = JSON.stringify(words);
  return props;
}

const groupOpen = (node) => node.type === 'paragraph' && /^:::\s*code-group\b/.test(textOf(node).trim());
const groupClose = (node) => node.type === 'paragraph' && textOf(node).trim() === ':::';
const groupLabels = (node) => (textOf(node).match(/labels=\[([^\]]*)\]/)?.[1] || '').split(',').map((label) => label.trim()).filter(Boolean);

function transform(parent) {
  const children = parent.children || [];
  for (let index = 0; index < children.length; index += 1) {
    const node = children[index];
    if (node.type === 'code') {
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, ...fenceMeta(node.meta) } };
      continue;
    }
    if (groupOpen(node)) {
      const end = children.findIndex((candidate, at) => at > index && groupClose(candidate));
      if (end < 0) continue;
      const labels = groupLabels(node);
      const fences = children.slice(index + 1, end).filter((child) => child.type === 'code');
      fences.forEach((fence, at) => {
        const hProperties = { ...fence.data?.hProperties, ...fenceMeta(fence.meta) };
        if (!hProperties['data-title'] && labels[at]) hProperties['data-title'] = labels[at];
        fence.data = { ...fence.data, hProperties };
      });
      children.splice(index, end - index + 1, { type: 'mdxJsxFlowElement', name: 'CodeGroup', attributes: [], children: fences });
      continue;
    }
    transform(node);
  }
}

export function remarkCode() {
  return (tree) => transform(tree);
}

// GitHub alert markers and the Callout each becomes; GitHub's five kinds share Callout's three tones.
const alertKinds = {
  'CAUTION': { title: 'Caution', type: 'error' },
  'IMPORTANT': { title: 'Important', type: 'info' },
  'NOTE': { title: 'Note', type: 'info' },
  'TIP': { title: 'Tip', type: 'info' },
  'WARNING': { title: 'Warning', type: 'warning' }
};
const alertMarker = /^\[!(CAUTION|IMPORTANT|NOTE|TIP|WARNING)\][ \t]*(?:\r?\n|$)/i;

/** Converts a `> [!KIND]` blockquote into a Callout JSX node, or returns null for ordinary quotes. */
function alertCallout(node) {
  const [ paragraph ] = node.children || [];
  const [ first ] = paragraph?.type === 'paragraph' ? paragraph.children : [];
  const match = first?.type === 'text' && first.value.match(alertMarker);
  if (!match) return null;
  const { title, type } = alertKinds[match[1].toUpperCase()];
  first.value = first.value.slice(match[0].length);
  // The marker sits on its own line: drop the text node (and a following hard break) it leaves empty.
  if (!first.value) paragraph.children.shift();
  if (paragraph.children[0]?.type === 'break') paragraph.children.shift();
  const children = paragraph.children.length ? node.children : node.children.slice(1);
  return {
    type: 'mdxJsxFlowElement',
    name: 'Callout',
    attributes: [ { type: 'mdxJsxAttribute', name: 'type', value: type }, { type: 'mdxJsxAttribute', name: 'title', value: title } ],
    children,
    position: node.position
  };
}

function transformAlerts(parent) {
  (parent.children || []).forEach((node, index) => {
    const callout = node.type === 'blockquote' ? alertCallout(node) : null;
    if (callout) parent.children[index] = callout;
    transformAlerts(callout || node);
  });
}

/**
 * Turns GitHub alert blockquotes into Gaudi `Callout` elements, so articles keep the familiar syntax:
 *
 *   > [!NOTE]
 *   > Useful context.
 *
 * NOTE, TIP and IMPORTANT render as `info`, WARNING as `warning` and CAUTION as `error`; each keeps
 * its kind as the Callout title. Map `Callout` in the MDX components. Ordinary quotes are untouched.
 */
export function remarkAlerts() {
  return (tree) => transformAlerts(tree);
}

export default remarkCode;
