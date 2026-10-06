import { Children, cloneElement, isValidElement } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up.js';

import Button from '../../components/core/Button';
import Card from '../../components/core/Card';
import { Badge as StatusBadge } from '../../components/core/Pill';
import { TableRoot, TableHeadPrimitive, TableCellPrimitive } from '../../components/mdx/Table';
import Typography from '../../foundations/Typography';

import { HighlightedCode } from './HighlightedCode';

export const InlineCode = ({ children }) => (
  <code className='ds-docs-code-value'>{children}</code>
);

const autoCodePattern = /([A-Za-z_$][\w$-]*=(?:\{(?:[^{}]|\{[^{}]*\})*\}|"[^"]*"|'[^']*')|\b(?:true|false|null|undefined)\b|\[\]|@[a-z0-9-]+\/[a-z0-9-/.]+|(?:src|app|data|meta|layouts|lib|scripts|styles|public|contentlayer)(?:\/[A-Za-z0-9_.*-]+)+|\[@[^\]]+\]|<\/?[A-Za-z][A-Za-z0-9]*>?|data-[A-Za-z0-9-*]+|aria-[A-Za-z0-9-]+|[A-Z]?[a-z]+[A-Z][A-Za-z0-9]*|Cmd\/Ctrl \+ K|Cmd\/Ctrl|Next\.js|MDX|JSX|BibTeX|Recharts|React|Tailwind)/g;

const renderAutoCode = (text, keyPrefix) => text.split(autoCodePattern).map((part, index) => {
  if (!part) return null;
  autoCodePattern.lastIndex = 0;

  if (autoCodePattern.test(part)) return <InlineCode key={ `${keyPrefix}-auto-${index}` }>{part}</InlineCode>;

  return part;
});

const renderInlineText = (text) => text.split(/(`[^`]+`)/g).map((part, index) => {
    if (!part) return null;
    if (part.startsWith('`') && part.endsWith('`')) {
      return <InlineCode key={ `${part}-${index}` }>{part.slice(1, -1)}</InlineCode>;
    }

    return renderAutoCode(part, index);
  });

export const InlineText = ({ children }) => Children.map(children, (child) => {
  if (typeof child === 'string') return renderInlineText(child);
  if (isValidElement(child) && typeof child.type === 'string' && child.props.children != null && !['code', 'pre', 'kbd', 'script', 'style'].includes(child.type)) {
    return cloneElement(child, {}, <InlineText>{child.props.children}</InlineText>);
  }
  return child;
});

export const pageParameters = {
  'layout': 'fullscreen'
};

const toSectionId = (title) => title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const getTableColumnCount = (children) => {
  let columnCount = 0;

  const visit = (nodes) => {
    Children.forEach(nodes, (node) => {
      if (columnCount || !isValidElement(node)) return;
      if (node.type === 'tr') {
        columnCount = Children.count(node.props.children);
        return;
      }

      visit(node.props.children);
    });
  };

  visit(children);
  return columnCount;
};

export const Page = ({ children, compact = false, intro, title }) => (
  <div id='page-top' className='ds-guide-page min-h-screen scroll-mt-4 bg-surface text-text' data-compact={ compact || undefined }>
    <div className='ds-guide-content'>
      <header className='space-y-4'>
        <Typography as='h1' variant='heading-xl'>{title}</Typography>
        {intro ? <p className='text-sm leading-7 text-text-muted'><InlineText>{intro}</InlineText></p> : null}
      </header>
      {children}
      <footer className='flex justify-end border-t border-border pt-4'>
        <a
          href='#page-top'
          className='group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-text-muted underline-offset-4 hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
        >
          Back to top
          <ArrowUp aria-hidden='true' size={ 16 } className='transition-transform group-hover:-translate-y-0.5' />
        </a>
      </footer>
    </div>
  </div>
);

export const Section = ({ children, description, id, title }) => (
  <section id={ id || toSectionId(title) } className='ds-guide-section scroll-mt-28 space-y-4'>
    <div className='space-y-2'>
      <Typography variant='heading-lg'>{title}</Typography>
      {description ? <p className='text-sm leading-7 text-text-muted'><InlineText>{description}</InlineText></p> : null}
    </div>
    {children}
  </section>
);

export const CodeBlock = ({ code, language = 'jsx' }) => (
  <div className='w-full min-w-0 max-w-full'>
    <HighlightedCode code={ code } language={ language } />
  </div>
);

export const Stat = ({ label, value }) => (
  <div className='rounded-lg border border-border bg-surface p-4 text-center'>
    <div className='text-2xl font-bold text-accent'>{value}</div>
    <div className='mt-1 text-xs text-text-muted'>{label}</div>
  </div>
);

export const PrincipleCard = ({ description, number, title }) => (
  <div className='space-y-3 rounded-lg border border-border bg-surface p-5'>
    <div className='flex items-center gap-3'>
      <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-accent/10 text-xs font-bold text-accent'>{number}</span>
      <h3 className='text-sm font-bold text-text'>{title}</h3>
    </div>
    <p className='text-xs leading-6 text-text-muted'><InlineText>{description}</InlineText></p>
  </div>
);

export const QuickLink = ({ description, storyId, title }) => (
  <a
    href={ `./?path=/${storyId.endsWith('--docs') ? 'docs' : 'story'}/${storyId}` }
    target='_top'
    className='group block h-full rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-accent hover:no-underline'
  >
    <div className='mb-1 flex items-center justify-between gap-3'>
      <p className='text-sm font-semibold text-text'>{title}</p>
      <ArrowRight aria-hidden='true' size={ 16 } className='shrink-0 text-accent transition-transform group-hover:translate-x-0.5' />
    </div>
    <p className='text-xs leading-5 text-text-muted'><InlineText>{description}</InlineText></p>
  </a>
);

const badgeTones = { blue: 'primary-light', gray: 'secondary', green: 'success-light', red: 'destructive-light', yellow: 'warning-light' };

export const Badge = ({ children, tone = 'gray' }) => (
  <StatusBadge variant={badgeTones[tone] || badgeTones.gray}>{children}</StatusBadge>
);

export const Table = ({ children, label = 'Documentation table' }) => {
  const columnCount = getTableColumnCount(children);

  return (
    <TableRoot className='ds-docs-table border-collapse text-left' data-columns={columnCount}
      containerProps={{ className: 'ds-docs-table-frame ds-docs-table-scroll max-w-full rounded-lg border border-border bg-surface', role: 'region', tabIndex: 0, 'aria-label': label, 'data-columns': columnCount }}>
      {children}
    </TableRoot>
  );
};

export const Th = ({ children }) => (
  <TableHeadPrimitive scope='col' className='whitespace-normal'>{children}</TableHeadPrimitive>
);

export const Td = ({ children, mono = false }) => (
  <TableCellPrimitive className={ `whitespace-normal border-b border-border leading-6 text-text-muted last:border-b-0 ${mono ? 'font-mono text-accent' : ''}` }>{mono ? children : <InlineText>{children}</InlineText>}</TableCellPrimitive>
);

export const CheckList = ({ items }) => (
  <ul className='grid gap-2'>
    {items.map((item) => (
      <li key={ item } className='flex items-start gap-2 text-xs leading-6 text-text-muted'>
        <span className='mt-1 text-success' aria-hidden='true'>✓</span>
        <span><InlineText>{item}</InlineText></span>
      </li>
    ))}
  </ul>
);

export const CommandButton = ({ children }) => (
  <Button variant='outline' tone='neutral' size='sm' type='button'>{children}</Button>
);

export const DocCard = Card;
