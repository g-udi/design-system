'use client';
import { useEffect, useRef, useState } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import DataTable from '../../core/DataTable/index.js';
import { Alert, AlertDescription, AlertAction } from '../../core/Banner/Alert.jsx';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../core/Accordion/Collapsible.jsx';
import { CodeBlock } from '../../core/CodeBlock/CodeBlock.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { ChatMessageStatus } from '../shared/message-status.jsx';

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isTable = (value) => Array.isArray(value) && value.length > 0 && value.every(isRecord);

function Scalar({ value }) {
  if (value === null || value === undefined) return <span className='text-text-muted'>—</span>;
  if (typeof value === 'boolean') return <span>{value ? 'Yes' : 'No'}</span>;
  if (typeof value === 'number') return <span className='tabular-nums'>{value}</span>;
  return <span className='break-words'>{String(value)}</span>;
}

function DataValue({ value, depth }) {
  if (isTable(value)) {
    const columns = [...new Set(value.flatMap((row) => Object.keys(row)))];
    return (
      <DataTable
        rows={value}
        density='compact'
        overflowLabel='Data table'
        getRowId={(_row, index) => String(index)}
        columns={columns.map((column) => ({
          key: column,
          header: column,
          render: (row) => isRecord(row[column]) || Array.isArray(row[column]) ? JSON.stringify(row[column]) : <Scalar value={row[column]} />
        }))}
      />
    );
  }
  if (Array.isArray(value)) {
    if (!value.length) return <span className='text-text-muted'>None</span>;
    return <ul className='grid list-disc gap-0.5 ps-4'>{value.map((item, index) => <li key={index}><DataValue value={item} depth={depth + 1} /></li>)}</ul>;
  }
  if (isRecord(value)) {
    return (
      <dl className={cn('grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-x-3 gap-y-1', depth > 0 && 'border-border border-s ps-2')}>
        {Object.entries(value).map(([key, item]) => (
          <div key={key} className='contents'>
            <dt className='text-text-muted [overflow-wrap:anywhere]'>{key}</dt>
            <dd className='min-w-0'><DataValue value={item} depth={depth + 1} /></dd>
          </div>
        ))}
      </dl>
    );
  }
  return <Scalar value={value} />;
}

/** Structured data from a tool or a reply: records read as a list, rows as a table, with a JSON view. */
function ChatMessageData({ value, label, defaultView = 'data', className }) {
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
function ChatMessageTool({ name, description, status = 'pending', input, output, error, duration, defaultOpen, open, onOpenChange, onRetry, labels, className, children }) {
  const [isOpen, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen ?? status === 'failed', onChange: onOpenChange });
  const previousStatus = useRef(status);
  useEffect(() => {
    const failed = status === 'failed' && previousStatus.current !== 'failed';
    previousStatus.current = status;
    if (failed) setOpen(true);
  }, [status, setOpen]);
  const hasDetail = input !== undefined || output !== undefined || error || children;
  return (
    <Collapsible
      open={hasDetail ? isOpen : false}
      onOpenChange={setOpen}
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
        <ChatMessageStatus status={status} labels={labels} />
        {hasDetail ? <RegistryIcon lucide='ChevronDown' className={cn('text-text-muted size-3.5 shrink-0 transition-transform motion-reduce:transition-none', isOpen && 'rotate-180')} /> : null}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='grid gap-3 border-t px-3 py-3'>
          {input !== undefined ? <ChatMessageData label={labels?.input || 'Input'} value={input} /> : null}
          {output !== undefined && status !== 'failed' ? <ChatMessageData label={labels?.output || 'Output'} value={output} /> : null}
          {error ? (
            <Alert variant='destructive'>
              <RegistryIcon lucide='TriangleAlert' className='size-3.5 shrink-0' />
              <AlertDescription>{error}</AlertDescription>
              {onRetry ? <AlertAction><Button size='xs' variant='outline' onClick={onRetry}>{labels?.retry || 'Retry'}</Button></AlertAction> : null}
            </Alert>
          ) : null}
          {children ? <div className='border-border grid gap-2 border-s-2 ps-3'>{children}</div> : null}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { ChatMessageData, ChatMessageTool };
