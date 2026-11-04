'use client';
import { useEffect, useRef, useState } from 'react';
import { ChatContextMeter, ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
import Button from '@gaudi/design-system/core/Button';
import Checkbox from '@gaudi/design-system/core/Checkbox';
import { ChatContextWindow } from '@gaudi/design-system/chat/ChatContextWindow';

const limit = 32000;
const initialFiles = [
  { id: 'create', name: 'src/invitations/create.ts', tokens: 7600 },
  { id: 'requirements', name: 'docs/invitation-requirements.md', tokens: 5600 }
];
const categories = [
  { id: 'system', label: 'System instructions', tokens: 1600, color: 'var(--ds-color-chart-1)', detail: 'Role and safety instructions. Retained when starting a new demo chat.' },
  { id: 'tools', label: 'Tool definitions', tokens: 2600, color: 'var(--ds-color-chart-2)', detail: 'Prepared definitions for file reading, searching and editing.' },
  { id: 'files', label: 'Files', color: 'var(--ds-color-chart-4)', detail: 'Files attached to this demo session. Removing one does not delete the original.' },
  { id: 'conversation', label: 'Conversation', color: 'var(--ds-color-chart-5)', detail: 'Prepared conversation history. Compaction keeps decisions in a shorter summary and omits earlier wording.' },
  { id: 'memory', label: 'Project memory', tokens: 1200, color: 'var(--ds-color-chart-3)', detail: 'Project conventions retained across new demo chats.' }
];
const format = (value) => new Intl.NumberFormat('en-US').format(value);

export function Pattern({ title = 'Context window' } = {}) {
  const [files, setFiles] = useState(initialFiles);
  const [conversation, setConversation] = useState(10400);
  const [resetKey, setResetKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const [saved, setSaved] = useState(0);
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('Remove a file or compact the conversation to make room.');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const parts = categories.map((part) => ({ ...part, tokens: part.id === 'files' ? files.reduce((sum, file) => sum + file.tokens, 0) : part.id === 'conversation' ? conversation : part.tokens }));
  const used = parts.reduce((sum, part) => sum + part.tokens, 0);
  const remaining = limit - used;
  const tone = used >= limit ? 'danger' : used >= limit * .8 ? 'warning' : 'accent';
  const message = used >= limit ? 'Window full. Remove a file or compact before sending.' : remaining < 800 ? 'Less than one demo turn fits. Remove a file or compact before sending.' : `${format(remaining)} tokens available.`;
  const canCompact = !busy && conversation > 2800;

  const compact = () => {
    if (!canCompact) return;
    setBusy(true); setError(false); setNotice('Compacting the demo conversation…');
    const shouldFail = failNext;
    setFailNext(false);
    timer.current = setTimeout(() => {
      setBusy(false);
      if (shouldFail) { setError(true); setNotice('Compaction failed. Your files and conversation are unchanged. Retry compaction.'); return; }
      const freed = conversation - 2800;
      setConversation(2800); setSaved((value) => value + freed);
      setNotice(`Compacted the demo conversation. Freed ${format(freed)} tokens; decisions retained in a prepared summary.`);
    }, 900);
  };
  const reset = (newChat = false) => {
    setFiles(newChat ? [] : initialFiles); setConversation(newChat ? 0 : 10400); setSaved(0); setError(false); setFailNext(false); setResetKey(value => value + 1); setDraft('');
    setNotice(newChat ? 'New demo chat. Files and conversation cleared; system instructions, tools and project memory retained.' : 'Original demo context restored.');
  };

  return (
    <section aria-label='Context window demo' className='ds-touch-controls mx-auto grid w-full min-w-0 max-w-lg gap-5 text-sm'>
      <ChatContextWindow key={resetKey} title={title} description='Invitation assistant · Demo' usedTokens={used} maxTokens={limit} tone={tone} formatTokens={format} disabled={busy}
        parts={parts.map(part => ({ ...part, files: part.id === 'files' ? files : undefined, busy: busy && part.id === 'conversation', actions: part.id === 'conversation' ? <><Button size='sm' variant='outline' aria-disabled={!canCompact} className={!canCompact ? 'opacity-60' : undefined} onClick={compact}>{busy ? 'Compacting…' : error ? 'Retry compaction' : saved && conversation <= 2800 ? 'Compacted' : 'Compact conversation'}</Button>
                {saved > 0 ? <span className='text-xs text-text-muted'><bdi>{format(saved)}</bdi> tokens freed by compaction</span> : null}
              </> : undefined }))}
        onRemoveFile={id => { const file = files.find(item => item.id === id); setFiles(items => items.filter(item => item.id !== id)); setNotice(`Removed ${file.name} from the demo context. Freed ${format(file.tokens)} tokens; original file unchanged.`); }}
        hint='Hover, focus or select a category to highlight its cells. Files and conversation can be cleared; other parts are retained.'
        footer={<><p className={`min-w-0 flex-1 text-xs ${tone === 'danger' ? 'text-ui-danger-ink' : tone === 'warning' ? 'text-ui-warning-ink' : 'text-text-muted'}`}><bdi>{message}</bdi></p><Button size='sm' variant='outline' disabled={busy} onClick={() => reset(true)}>New demo chat</Button></>}
      />
      <ChatPromptComposer
        variant='card' value={draft} onValueChange={setDraft} disabled={busy || remaining < 800}
        labels={{ placeholder: 'Ask about the invitation workflow…' }}
        rightControls={<ChatContextMeter usedTokens={used} maxTokens={limit} modelLabel='Demo context' tone={tone} message={<bdi>{message}</bdi>} formatTokens={format} breakdown={parts.map((part) => ({ id: part.id, label: part.label, value: format(part.tokens) }))} />}
        onSubmit={() => { setConversation((value) => value + 800); setNotice('Added one prepared demo turn: 800 tokens. No message was sent to a model.'); }}
      />
      <p role='status' className={`text-xs ${error ? 'text-ui-danger-ink' : 'text-text-muted'}`}>{notice}</p>
      <fieldset className='grid gap-3 border-t pt-3'><legend className='text-xs font-medium'>Demo controls</legend>
        <div className='flex flex-wrap gap-2'><Button size='sm' variant='outline' disabled={busy} onClick={() => { setConversation(limit - (used - conversation)); setError(false); setNotice('Demo window filled. Free context before sending another turn.'); }}>Fill demo window</Button><Button size='sm' variant='ghost' disabled={busy} onClick={() => reset()}>Reset demo</Button></div>
        <Checkbox label='Fail the next compaction' checked={failNext} onCheckedChange={(value) => setFailNext(value === true)} disabled={busy} />
      </fieldset>
      <p className='text-xs text-text-muted'>Illustrative counts and a prepared summary. Each submitted demo turn adds 800 tokens; real applications supply token counts and compaction policy. No files, services or conversations outside this demo are changed.</p>
    </section>
  );
}
