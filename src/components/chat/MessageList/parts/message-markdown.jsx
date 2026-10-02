'use client';
import { Fragment } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { CodeBlock } from '../../../core/CodeBlock/parts/code-block-extended.jsx';
import { markdownFences } from '../../../core/CodeBlock/parts/code-block-highlight-extended.jsx';
import Link from '../../../core/Link/Link.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { MessageCitation } from '../../ChatSources/parts/message-sources.jsx';

/*
 * Chat replies are plain markdown that arrives a few tokens at a time, so they are rendered at runtime
 * rather than compiled like MDX articles. Fences go through markdownFences and CodeBlock (an open fence
 * keeps streaming), and the text between them is a small block and inline grammar: headings, paragraphs,
 * lists, quotes, rules, tables, emphasis, inline code, links and numbered citations such as [1].
 * Unfinished markup while streaming stays as typed until its closing marker arrives.
 */

const TABLE_RULE = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;
const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;

const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());

function parseBlocks(text) {
  const lines = text.split('\n');
  const blocks = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: 'rule' });
      index += 1;
      continue;
    }
    if (line.includes('|') && TABLE_RULE.test(lines[index + 1] || '')) {
      const head = cells(line);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(cells(lines[index]));
        index += 1;
      }
      blocks.push({ type: 'table', head, rows });
      continue;
    }
    if (/^\s*>/.test(line)) {
      const quote = [];
      while (index < lines.length && /^\s*>/.test(lines[index])) {
        quote.push(lines[index].replace(/^\s*>\s?/, ''));
        index += 1;
      }
      blocks.push({ type: 'quote', text: quote.join('\n') });
      continue;
    }
    if (LIST_ITEM.test(line)) {
      const ordered = /\d/.test(line.match(LIST_ITEM)[2]);
      const items = [];
      while (index < lines.length && (LIST_ITEM.test(lines[index]) || (/^\s{2,}\S/.test(lines[index]) && items.length))) {
        const item = lines[index].match(LIST_ITEM);
        if (item) {
          const task = item[3].match(/^\[( |x|X)\]\s+(.*)$/);
          items.push(task ? { text: task[2], checked: task[1] !== ' ' } : { text: item[3] });
        } else items[items.length - 1].text += ` ${lines[index].trim()}`;
        index += 1;
      }
      blocks.push({ type: 'list', ordered, start: ordered ? Number.parseInt(line.match(LIST_ITEM)[2], 10) : undefined, items });
      continue;
    }
    const paragraph = [];
    while (index < lines.length && lines[index].trim() && !/^(#{1,4})\s|^\s*>|^\s*(-{3,}|\*{3,})\s*$/.test(lines[index]) && !LIST_ITEM.test(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
  }
  return blocks;
}

// One pass over the text: the earliest match wins, then the rest is parsed again.
const INLINE = [
  { type: 'code', pattern: /`([^`]+)`/ },
  { type: 'link', pattern: /\[([^\]]+)\]\(([^)\s]+)\)/ },
  { type: 'citation', pattern: /\[(\d{1,2})\]/ },
  { type: 'strong', pattern: /\*\*([^*]+)\*\*|__([^_]+)__/ },
  { type: 'em', pattern: /\*([^*\s][^*]*)\*|(?<![\w])_([^_\s][^_]*)_(?![\w])/ },
  { type: 'del', pattern: /~~([^~]+)~~/ },
  { type: 'url', pattern: /https?:\/\/[^\s)<]+[^\s).,;:!?<]/ }
];

function renderInline(text, context, keyPrefix = 'i') {
  const nodes = [];
  let rest = text;
  let key = 0;
  while (rest) {
    let best = null;
    for (const rule of INLINE) {
      const match = rest.match(rule.pattern);
      if (match && (best === null || match.index < best.match.index)) best = { rule, match };
    }
    if (!best) {
      nodes.push(rest);
      break;
    }
    const { rule, match } = best;
    if (match.index) nodes.push(rest.slice(0, match.index));
    const id = `${keyPrefix}-${key++}`;
    const inner = match[1] ?? match[2] ?? match[0];
    if (rule.type === 'code') nodes.push(<code key={id} className='ds-part-message-markdown-code'>{inner}</code>);
    else if (rule.type === 'link') nodes.push(<Link key={id} href={match[2]} variant='inline' tone='accent' className='underline underline-offset-4'>{renderInline(match[1], context, id)}</Link>);
    else if (rule.type === 'url') nodes.push(<Link key={id} href={match[0]} variant='inline' tone='accent' className='break-all underline underline-offset-4'>{match[0]}</Link>);
    else if (rule.type === 'citation') {
      const source = context.sources?.[Number(inner) - 1];
      nodes.push(source ? <MessageCitation key={id} index={Number(inner)} source={source} /> : match[0]);
    } else if (rule.type === 'strong') nodes.push(<strong key={id} className='font-semibold'>{renderInline(inner, context, id)}</strong>);
    else if (rule.type === 'em') nodes.push(<em key={id}>{renderInline(inner, context, id)}</em>);
    else nodes.push(<del key={id}>{renderInline(inner, context, id)}</del>);
    rest = rest.slice(match.index + match[0].length);
  }
  return nodes;
}

const headingClass = { 1: 'text-lg font-semibold', 2: 'text-base font-semibold', 3: 'text-sm font-semibold', 4: 'text-sm font-medium' };

function Block({ block, context, id }) {
  if (block.type === 'heading') {
    // Reply headings sit under the conversation's own heading, so they start one level down.
    const Tag = `h${Math.min(block.level + 2, 6)}`;
    return <Tag className={headingClass[block.level]}>{renderInline(block.text, context, id)}</Tag>;
  }
  if (block.type === 'rule') return <hr className='border-border' />;
  if (block.type === 'quote') return <blockquote className='border-border text-text-muted border-s-2 ps-3'>{renderInline(block.text, context, id)}</blockquote>;
  if (block.type === 'list') {
    const Tag = block.ordered ? 'ol' : 'ul';
    const tasks = block.items.some((item) => 'checked' in item);
    return (
      <Tag start={block.start} className={cn('grid gap-1 ps-5', block.ordered ? 'list-decimal' : 'list-disc', tasks && 'list-none ps-0')}>
        {block.items.map((item, index) => (
          <li key={index} className={tasks ? 'flex items-start gap-2' : undefined}>
            {'checked' in item ? (
              <span aria-hidden='true' className={cn('mt-1 grid size-3.5 shrink-0 place-items-center rounded-sm border', item.checked && 'bg-accent border-accent text-surface')}>
                {item.checked ? <RegistryIcon lucide='Check' className='size-2.5' /> : null}
              </span>
            ) : null}
            {'checked' in item ? <span className='sr-only'>{item.checked ? 'Done: ' : 'To do: '}</span> : null}
            <span>{renderInline(item.text, context, `${id}-${index}`)}</span>
          </li>
        ))}
      </Tag>
    );
  }
  if (block.type === 'table') {
    return (
      <div className='overflow-x-auto rounded-(--ds-radius-card) border' role='region' aria-label='Table' tabIndex={0}>
        <table className='w-full border-collapse text-sm'>
          <thead className='bg-surface-muted'>
            <tr>{block.head.map((cell, index) => <th key={index} scope='col' className='border-b px-3 py-1.5 text-start font-medium'>{renderInline(cell, context, `${id}-h${index}`)}</th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className='border-b last:border-b-0'>
                {row.map((cell, index) => <td key={index} className='px-3 py-1.5 align-top'>{renderInline(cell, context, `${id}-${rowIndex}-${index}`)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <p>{renderInline(block.text, context, id)}</p>;
}

/**
 * Renders a markdown reply. `streaming` keeps an unfinished fence live in its CodeBlock, `sources` turns
 * numbered markers into citation chips, and `codeProps` pass through to every CodeBlock.
 */
function MessageMarkdown({ children = '', streaming = false, sources, codeProps, className, ...props }) {
  const text = typeof children === 'string' ? children : String(children ?? '');
  const context = { sources };
  const parts = markdownFences(text);
  return (
    <div data-slot='message-markdown' data-streaming={streaming || undefined} className={cn('ds-part-message-markdown flex min-w-0 flex-col gap-3 text-sm leading-relaxed', className)} {...props}>
      {parts.map((part, partIndex) =>
        part.type === 'code' ? (
          <CodeBlock
            key={partIndex}
            code={part.content}
            language={part.language || 'text'}
            streaming={streaming && part.open}
            {...codeProps}
          />
        ) : (
          <Fragment key={partIndex}>
            {parseBlocks(part.content).map((block, blockIndex) => <Block key={blockIndex} block={block} context={context} id={`b${partIndex}-${blockIndex}`} />)}
          </Fragment>
        )
      )}
    </div>
  );
}

export { MessageMarkdown, parseBlocks as parseMessageMarkdown };
