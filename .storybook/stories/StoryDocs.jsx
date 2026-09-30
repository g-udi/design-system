import { Children, cloneElement, isValidElement } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up.js';

import Button from '../../src/components/core/Button';
import Card from '../../src/components/core/Card';
import Typography from '../../src/foundations/Typography';

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
  <div id='page-top' className='ds-guide-page min-h-screen scroll-mt-4 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100' data-compact={ compact || undefined }>
    <div className='ds-guide-content'>
      <header className='space-y-4'>
        <Typography as='h1' variant='heading-xl'>{title}</Typography>
        {intro ? <p className='text-sm leading-7 text-gray-600 dark:text-gray-300'><InlineText>{intro}</InlineText></p> : null}
      </header>
      {children}
      <footer className='flex justify-end border-t border-gray-200 pt-4 dark:border-gray-800'>
        <a
          href='#page-top'
          className='group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gray-600 underline-offset-4 hover:text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-gray-300 dark:hover:text-blue-300'
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
      {description ? <p className='text-sm leading-7 text-gray-600 dark:text-gray-300'><InlineText>{description}</InlineText></p> : null}
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
  <div className='rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-900'>
    <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{value}</div>
    <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>{label}</div>
  </div>
);

export const PrincipleCard = ({ description, number, title }) => (
  <div className='space-y-3 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900'>
    <div className='flex items-center gap-3'>
      <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300'>{number}</span>
      <h3 className='text-sm font-bold text-gray-900 dark:text-white'>{title}</h3>
    </div>
    <p className='text-xs leading-6 text-gray-600 dark:text-gray-300'><InlineText>{description}</InlineText></p>
  </div>
);

export const QuickLink = ({ description, storyId, title }) => (
  <a
    href={ `./?path=/${storyId.endsWith('--docs') ? 'docs' : 'story'}/${storyId}` }
    target='_top'
    className='group block h-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-blue-300 hover:no-underline dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700'
  >
    <div className='mb-1 flex items-center justify-between gap-3'>
      <p className='text-sm font-semibold text-gray-950 dark:text-white'>{title}</p>
      <ArrowRight aria-hidden='true' size={ 16 } className='shrink-0 text-blue-600 transition-transform group-hover:translate-x-0.5 dark:text-blue-300' />
    </div>
    <p className='text-xs leading-5 text-gray-500 dark:text-gray-400'><InlineText>{description}</InlineText></p>
  </a>
);

export const Badge = ({ children, tone = 'gray' }) => {
  const tones = {
    'blue': 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    'gray': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'green': 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    'red': 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    'yellow': 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
  };

  return <span className={ `inline-flex rounded px-2 py-0.5 text-xs font-semibold ${tones[tone] || tones.gray}` }>{children}</span>;
};

export const Table = ({ children, label = 'Documentation table' }) => {
  const columnCount = getTableColumnCount(children);

  return (
  <div className='ds-docs-table-frame max-w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900' data-columns={ columnCount }>
    <div className='ds-docs-table-scroll max-w-full overflow-x-auto' role='region' tabIndex={ 0 } aria-label={ label }>
      <table className='ds-docs-table w-full border-collapse text-left' data-columns={ columnCount }>{children}</table>
    </div>
  </div>
  );
};

export const Th = ({ children }) => (
  <th scope='col' className='border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300'>{children}</th>
);

export const Td = ({ children, mono = false }) => (
  <td className={ `border-b border-gray-100 px-4 py-3 text-xs leading-6 text-gray-600 last:border-b-0 dark:border-gray-800 dark:text-gray-300 ${mono ? 'font-mono text-blue-600 dark:text-blue-300' : ''}` }>{mono ? children : <InlineText>{children}</InlineText>}</td>
);

export const CheckList = ({ items }) => (
  <ul className='grid gap-2'>
    {items.map((item) => (
      <li key={ item } className='flex items-start gap-2 text-xs leading-6 text-gray-600 dark:text-gray-300'>
        <span className='mt-1 text-green-600 dark:text-green-400' aria-hidden='true'>✓</span>
        <span><InlineText>{item}</InlineText></span>
      </li>
    ))}
  </ul>
);

export const CommandButton = ({ children }) => (
  <Button variant='outline' tone='neutral' size='sm' type='button'>{children}</Button>
);

export const DocCard = Card;
