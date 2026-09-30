import { useEffect, useRef, useState } from 'react';

import Pill from '../../src/components/core/Pill';
import Typography from '../../src/foundations/Typography';

import { CodeBlock, InlineCode, InlineText, Page } from './StoryDocs';

const statuses = [
  { 'color': 'green', 'description': 'Available, published, complete, or healthy.', 'label': 'Published', 'tone': 'bg-green-500' },
  { 'color': 'amber', 'description': 'Draft, pending, queued, or needs review.', 'label': 'Review', 'tone': 'bg-amber-500' },
  { 'color': 'blue', 'description': 'Active, selected, informational, or in progress.', 'label': 'Active', 'tone': 'bg-blue-500' },
  { 'color': 'teal', 'description': 'Live, syncing, connected, or actively streaming.', 'label': 'Syncing', 'tone': 'bg-teal-500' },
  { 'color': 'red', 'description': 'Error, failed, blocked, or needs attention.', 'label': 'Blocked', 'tone': 'bg-red-500' },
  { 'color': 'rose', 'description': 'Escalated, sensitive, or attention-worthy but not yet failed.', 'label': 'Attention', 'tone': 'bg-rose-500' },
  { 'color': 'gray', 'description': 'Inactive, archived, unavailable, or neutral.', 'label': 'Inactive', 'tone': 'bg-gray-400' }
];

const copyWithTextArea = (value) => {
  const textarea = document.createElement('textarea');

  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.left = '-9999px';
  textarea.style.position = 'fixed';
  textarea.style.top = '0';

  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
};

const CopyButton = ({ children, label, value }) => {
  const [ copied, setCopied ] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async() => {
    let didCopy = false;

    if (navigator.clipboard?.writeText)
      try {
        await navigator.clipboard.writeText(value);
        didCopy = true;
      } catch {
        didCopy = false;
      }

    if (!didCopy) copyWithTextArea(value);

    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type='button'
      className='min-h-11 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300 sm:min-h-0 sm:px-1.5 sm:py-0.5'
      aria-label={ `Copy ${label}` }
      title={ `Copy ${label}` }
      onClick={ handleCopy }
    >
      {copied ? 'Copied' : children}
    </button>
  );
};

const StatusDot = ({ label, tone }) => (
  <span className='inline-flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100'>
    <span className={ `h-2.5 w-2.5 rounded-full ${tone}` } aria-hidden='true' />
    <span>{label}</span>
  </span>
);

const statusDotSnippet = (status) => `<span className='inline-flex items-center gap-2 text-sm font-medium'>
  <span className='h-2.5 w-2.5 rounded-full ${status.tone}' aria-hidden='true' />
  <span>${status.label}</span>
</span>`;

const pillSnippet = (status) => `<Pill tone='${status.color}' size='sm'>${status.label}</Pill>`;

const StatusRow = ({ status }) => {
  const dotSnippet = statusDotSnippet(status);
  const statusPillSnippet = pillSnippet(status);

  return (
    <div className='group grid grid-cols-1 gap-3 border-b border-gray-100 px-4 py-4 text-sm last:border-b-0 dark:border-gray-800 sm:grid-cols-[minmax(0,160px)_minmax(0,160px)_1fr] sm:gap-4'>
      <div className='relative flex items-center justify-between gap-3 sm:block'>
        <StatusDot label={ status.label } tone={ status.tone } />
        <div className='hidden gap-1 sm:absolute sm:-right-1 sm:top-1/2 sm:flex sm:-translate-y-1/2 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
          <CopyButton label={ `${status.label} dot JSX` } value={ dotSnippet }>Dot</CopyButton>
        </div>
      </div>
      <div className='relative flex items-center justify-between gap-3 sm:block'>
        <Pill tone={ status.color } size='sm'>{status.label}</Pill>
        <div className='hidden gap-1 sm:absolute sm:right-0 sm:top-1/2 sm:flex sm:-translate-y-1/2 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
          <CopyButton label={ `${status.label} pill JSX` } value={ statusPillSnippet }>Pill</CopyButton>
        </div>
      </div>
      <div className='flex items-start justify-between gap-3'>
        <p className='text-gray-600 dark:text-gray-300'><InlineText>{status.description}</InlineText></p>
      </div>
    </div>
  );
};

export default {
  id: 'overview-indicators',
  parameters: {
    layout: 'fullscreen'
  },
  tags: [ '!autodocs' ],
  title: 'Indicators'
};

export const Default = {
  name: 'Indicators',
  'render': () => (
    <Page title='Indicators' intro='Indicators communicate status. Text carries the meaning; color supports quick scanning.'>
      <section className='rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'>
        <div className='hidden grid-cols-[minmax(0,160px)_minmax(0,160px)_1fr] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 sm:grid'>
          <div>Dot</div>
          <div>Pill</div>
          <div>Use</div>
        </div>
        {statuses.map((status) => <StatusRow key={ status.label } status={ status } />)}
      </section>

      <section className='grid gap-4 lg:grid-cols-2'>
        <CodeBlock code={ `// Dot + text
<span className='inline-flex items-center gap-2 text-sm font-medium'>
  <span className='h-2.5 w-2.5 rounded-full bg-green-500' aria-hidden='true' />
  <span>Published</span>
</span>` } />
        <CodeBlock code={ `// Package pill
import { Pill } from '@gaudi/design-system';

<Pill tone='green' size='sm'>Published</Pill>
<Pill tone='amber' size='sm'>Review</Pill>
<Pill tone='teal' size='sm'>Syncing</Pill>
<Pill tone='red' size='sm'>Blocked</Pill>
<Pill tone='green' variant='soft' size='sm' pulse>Live</Pill>` } />
      </section>

      <section className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
        <Typography as='h2' variant='heading-md'>Pulsing Pill</Typography>
        <p className='mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300'>
          <InlineText>Use the `Pill pulse` modifier for live, active, or transient states. The pulse is decorative; the label still carries the status.</InlineText>
        </p>
        <div className='mt-4 flex flex-wrap gap-5'>
          <Pill tone='green' variant='soft' size='sm' pulse>Live</Pill>
          <Pill tone='teal' variant='soft' size='sm' pulse>Syncing</Pill>
          <Pill tone='amber' variant='soft' size='sm' pulse>Needs review</Pill>
        </div>
        <div className='mt-4'>
          <CodeBlock code={ `<Pill tone='green' variant='soft' size='sm' pulse>Live</Pill>
<Pill tone='teal' variant='soft' size='sm' pulse>Syncing</Pill>
<Pill tone='amber' variant='soft' size='sm' pulse>Needs review</Pill>` } />
        </div>
      </section>

      <section className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
          <Typography as='h2' variant='heading-md'>Dot + Text</Typography>
          <p className='mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300'><InlineText>Use for dense lists, tables, metadata rows, and compact status summaries.</InlineText></p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
          <Typography as='h2' variant='heading-md'>Pill</Typography>
          <p className='mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300'><InlineText>Use when the status is a primary scannable attribute, such as post state or release state.</InlineText></p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
          <Typography as='h2' variant='heading-md'>Accessibility</Typography>
          <p className='mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300'><InlineText>Never rely on the dot color alone. Always include visible text or an accessible label.</InlineText></p>
        </div>
      </section>

      <section className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
        <Typography as='h2' variant='heading-md'>Implementation Alignment</Typography>
        <p className='mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300'>
          Indicators are intentionally small: visible text plus an approved Gaudi palette color. The reusable pill is
          <InlineCode>Pill</InlineCode> from the package; dots are lightweight status patterns for docs, tables, and metadata.
          Pulsing state uses <InlineCode>{ '<Pill pulse>' }</InlineCode> so status motion stays inside the component API.
        </p>
      </section>
    </Page>
  )
};
