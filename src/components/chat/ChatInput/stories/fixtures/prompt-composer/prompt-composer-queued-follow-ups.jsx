'use client';
import { useEffect, useRef, useState } from 'react';
import { ChatPromptComposer, ChatPromptQueue } from '@gaudi/design-system/chat/ChatInput';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

let nextId = 3;

export function Pattern() {
  const [status, setStatus] = useState('streaming');
  const [current, setCurrent] = useState('Rewrite the introduction so it leads with the reader’s problem.');
  const [queue, setQueue] = useState([
    { id: 'q1', text: 'Then shorten the second section to under 150 words.' },
    { id: 'q2', text: 'Suggest a title that fits in 60 characters.' }
  ]);
  const [log, setLog] = useState([]);
  const [run, setRun] = useState(0);

  // A reply finishes after a while; the next queued message then starts on its own.
  const finishLatest = useRef();
  useEffect(() => {
    if (status !== 'streaming') return undefined;
    const timer = setTimeout(() => finishLatest.current('done'), 6000);
    return () => clearTimeout(timer);
  }, [status, run]);

  function start(text) {
    setCurrent(text);
    setRun((value) => value + 1);
    setStatus('streaming');
  }

  function finish(outcome) {
    setLog((entries) => [...entries, { id: `${entries.length}`, text: current, outcome }]);
    const [first, ...rest] = queue;
    setQueue(rest);
    if (first) start(first.text);
    else setStatus('ready');
  }
  finishLatest.current = finish;

  const move = (id, step) => setQueue((items) => {
    const index = items.findIndex((item) => item.id === id);
    const target = index + step;
    if (index < 0 || target < 0 || target >= items.length) return items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });

  return (
    <div className='mx-auto grid w-full max-w-2xl grid-cols-[minmax(0,1fr)] gap-3'>
      <ol aria-label='Finished requests' className='grid gap-1 text-sm'>
        {log.map((entry) => (
          <li key={entry.id} className='text-text-muted flex items-start gap-2'>
            <RegistryIcon lucide={entry.outcome === 'stopped' ? 'CircleX' : 'CircleCheck'} className='mt-0.5 size-3.5 shrink-0' />
            <span>{entry.text}{entry.outcome === 'stopped' ? ' (stopped)' : ''}</span>
          </li>
        ))}
      </ol>
      {status === 'streaming' ? (
        <div className='bg-surface flex items-center gap-2 rounded-(--ds-radius-card) border px-3 py-2 text-sm'>
          <Loader className='text-accent size-4' />
          <span className='min-w-0 flex-1 truncate'>Working on: {current}</span>
        </div>
      ) : (
        <p className='text-text-muted text-sm'>Gaudi is idle. Anything you send starts right away.</p>
      )}
      <ChatPromptQueue
        items={queue}
        onEdit={(id, text) => setQueue((items) => items.map((item) => (item.id === id ? { ...item, text } : item)))}
        onRemove={(id) => setQueue((items) => items.filter((item) => item.id !== id))}
        onSendNow={(id) => {
          const item = queue.find((entry) => entry.id === id);
          setQueue((items) => items.filter((entry) => entry.id !== id));
          setLog((entries) => [...entries, { id: `${entries.length}`, text: current, outcome: 'stopped' }]);
          start(item.text);
        }}
        onMove={move}
      />
      <ChatPromptComposer
        status={status}
        onStop={() => finish('stopped')}
        onSubmit={(text, { queued }) => {
          if (queued) setQueue((items) => [...items, { id: `q${nextId++}`, text }]);
          else start(text);
        }}
        labels={{ placeholder: status === 'streaming' ? 'Add a follow-up. It waits until this reply finishes.' : 'Ask Gaudi to edit the draft' }}
      />
    </div>
  );
}
