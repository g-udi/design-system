'use client';
import { useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../Accordion/parts/collapsible.jsx';
import { CodeBlock } from '../../CodeBlock/parts/code-block-extended.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { MessageStatus } from './message-status.jsx';

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isTable = (value) => Array.isArray(value) && value.length > 0 && value.every(isRecord);
const humanize = (key) => String(key).replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

function Scalar({ value }) {
  if (value === null || value === undefined) return <span className='text-text-muted'>—</span>;
  if (typeof value === 'boolean') return <span>{value ? 'Yes' : 'No'}</span>;
  if (typeof value === 'number') return <span className='tabular-nums'>{value.toLocaleString()}</span>;
  return <span className='break-words'>{String(value)}</span>;
}

function DataValue({ value, depth }) {
  if (isTable(value)) {
    const columns = [...new Set(value.flatMap((row) => Object.keys(row)))];
    return (
      <div className='overflow-x-auto rounded-(--ds-radius-control) border' role='region' aria-label='Data table' tabIndex={0}>
        <table className='w-full border-collapse text-xs'>
          <thead className='bg-surface-muted'>
            <tr>{columns.map((column) => <th key={column} scope='col' className='border-b px-2 py-1 text-start font-medium'>{humanize(column)}</th>)}</tr>
          </thead>
          <tbody>
            {value.map((row, index) => (
              <tr key={index} className='border-b last:border-b-0'>
                {columns.map((column) => <td key={column} className='px-2 py-1 align-top'>{isRecord(row[column]) || Array.isArray(row[column]) ? JSON.stringify(row[column]) : <Scalar value={row[column]} />}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (Array.isArray(value)) {
    if (!value.length) return <span className='text-text-muted'>None</span>;
    return <ul className='grid list-disc gap-0.5 ps-4'>{value.map((item, index) => <li key={index}><DataValue value={item} depth={depth + 1} /></li>)}</ul>;
  }
  if (isRecord(value)) {
    return (
      <dl className={cn('grid grid-cols-[minmax(6rem,auto)_1fr] gap-x-3 gap-y-1', depth > 0 && 'border-border border-s ps-2')}>
        {Object.entries(value).map(([key, item]) => (
          <div key={key} className='contents'>
            <dt className='text-text-muted'>{humanize(key)}</dt>
            <dd className='min-w-0'><DataValue value={item} depth={depth + 1} /></dd>
          </div>
        ))}
      </dl>
    );
  }
  return <Scalar value={value} />;
}

/** Structured data from a tool or a reply: records read as a list, rows as a table, with a JSON view. */
function MessageData({ value, label, defaultView = 'data', className }) {
  const [view, setView] = useState(defaultView);
  return (
    <div data-slot='message-data' className={cn('ds-part-message-data grid gap-1.5 text-xs', className)}>
      <div className='flex items-center justify-between gap-2'>
        {label ? <span className='text-text-muted font-medium'>{label}</span> : <span />}
        <div className='flex gap-0.5' role='group' aria-label={label ? `${label} view` : 'Data view'}>
          {['data', 'json'].map((option) => (
            <Button key={option} size='xs' variant='ghost' aria-pressed={view === option} className='aria-pressed:bg-surface-muted h-5 px-1.5' onClick={() => setView(option)}>
              {option === 'data' ? 'Data' : 'JSON'}
            </Button>
          ))}
        </div>
      </div>
      {view === 'json' ? (
        <CodeBlock code={JSON.stringify(value, null, 2)} language='json' maxLines={14} />
      ) : (
        <div className='bg-surface-muted rounded-(--ds-radius-control) p-2'>
          <DataValue value={value} depth={0} />
        </div>
      )}
    </div>
  );
}

/**
 * One tool call. The header names the tool and its status; it opens to show input, output or the
 * error, and nested children are the calls it made in turn. A failed call opens on its own.
 */
function MessageTool({ name, description, status = 'pending', input, output, error, duration, defaultOpen, open, onOpenChange, onRetry, labels, className, children }) {
  const [internal, setInternal] = useState(defaultOpen ?? status === 'failed');
  const isOpen = open ?? internal;
  const hasDetail = input !== undefined || output !== undefined || error || children;
  return (
    <Collapsible
      open={hasDetail ? isOpen : false}
      onOpenChange={(next) => {
        setInternal(next);
        onOpenChange?.(next);
      }}
      data-slot='message-tool'
      data-status={status}
      className={cn('ds-part-message-tool bg-surface grid rounded-(--ds-radius-card) border text-sm', status === 'failed' && 'border-danger-border', className)}
    >
      <CollapsibleTrigger
        disabled={!hasDetail}
        className='hover:bg-surface-muted focus-visible:ring-accent flex w-full min-w-0 items-center gap-2 rounded-(--ds-radius-card) px-3 py-2 text-start focus-visible:ring-2 focus-visible:outline-none disabled:cursor-default disabled:hover:bg-transparent'
      >
        <RegistryIcon lucide='Wrench' className='text-text-muted size-3.5 shrink-0' />
        <span className='grid min-w-0 flex-1'>
          <span className='truncate font-medium'>{name}</span>
          {description ? <span className='text-text-muted truncate text-xs'>{description}</span> : null}
        </span>
        {duration ? <span className='text-text-muted shrink-0 text-xs tabular-nums'>{duration}</span> : null}
        <MessageStatus status={status} labels={labels} />
        {hasDetail ? <RegistryIcon lucide='ChevronDown' className={cn('text-text-muted size-3.5 shrink-0 transition-transform motion-reduce:transition-none', isOpen && 'rotate-180')} /> : null}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='grid gap-3 border-t px-3 py-3'>
          {input !== undefined ? <MessageData label={labels?.input || 'Input'} value={input} /> : null}
          {output !== undefined && status !== 'failed' ? <MessageData label={labels?.output || 'Output'} value={output} /> : null}
          {error ? (
            <div role='alert' className='border-danger-border bg-danger-subtle text-danger flex flex-wrap items-center gap-2 rounded-(--ds-radius-control) border px-2 py-1.5 text-xs'>
              <RegistryIcon lucide='TriangleAlert' className='size-3.5 shrink-0' />
              <span className='min-w-0 flex-1'>{error}</span>
              {onRetry ? <Button size='xs' variant='outline' onClick={onRetry}>{labels?.retry || 'Retry'}</Button> : null}
            </div>
          ) : null}
          {children ? <div className='border-border grid gap-2 border-s-2 ps-3'>{children}</div> : null}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { MessageData, MessageTool };
