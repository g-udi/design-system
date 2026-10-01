'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../../../src/components/core/Sheet/parts/sheet.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

const suggestions = ['Summarise this draft', 'Suggest three titles', 'Find weak arguments', 'Write the newsletter intro'];
const reply = (prompt) => `Here is a first pass at “${prompt.toLowerCase()}”. I kept your tone and flagged two places where a source would help.`;

// Suggestions start a conversation; the composer stays pinned to the bottom.
export function Pattern() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const send = (text) => {
    if (!text.trim()) return;
    setMessages((current) => [...current, { role: 'user', text }, { role: 'assistant', text: reply(text) }]);
    setDraft('');
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='sm' variant='outline'>
          <RegistryIcon lucide='SparklesIcon' aria-hidden='true' />
          Assistant
        </Button>
      </SheetTrigger>
      <SheetContent size='md' className='gap-0'>
        <SheetHeader className='flex-row flex-wrap items-center gap-3 border-b pe-12'>
          <div className='grid min-w-40 flex-1 gap-0.5'>
            <SheetTitle>Writing assistant</SheetTitle>
            <SheetDescription>Works on the draft you have open.</SheetDescription>
          </div>
          <Select defaultValue='balanced'>
            <SelectTrigger aria-label='Model' size='sm' className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position='popper' align='end'>
              <SelectItem value='fast'>Fast</SelectItem>
              <SelectItem value='balanced'>Balanced</SelectItem>
              <SelectItem value='thorough'>Thorough</SelectItem>
            </SelectContent>
          </Select>
        </SheetHeader>
        <div className='grid min-h-0 flex-1 content-start gap-3 overflow-y-auto p-3'>
          {messages.length ? (
            messages.map((message, index) => (
              <p key={index} className={cn('max-w-[85%] rounded-lg px-3 py-2 text-sm', message.role === 'user' ? 'bg-accent text-accent-foreground justify-self-end' : 'bg-surface-muted')}>
                {message.text}
              </p>
            ))
          ) : (
            <div className='grid gap-3 py-6 text-center'>
              <RegistryIcon lucide='BotIcon' aria-hidden='true' className='text-text-muted mx-auto size-6' />
              <p className='text-sm font-medium'>What should we work on?</p>
              <div className='flex flex-wrap justify-center gap-2'>
                {suggestions.map((suggestion) => (
                  <Button key={suggestion} size='xs' variant='outline' className='rounded-full' onClick={() => send(suggestion)}>
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <form
          className='border-t p-3'
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
        >
          <InputGroup>
            <InputGroupTextarea aria-label='Message' placeholder='Ask about this draft…' rows={2} value={draft} onChange={(event) => setDraft(event.target.value)} />
            <InputGroupAddon align='block-end' className='justify-between'>
              <span className='flex gap-1'>
                <InputGroupButton size='icon-xs' aria-label='Attach a file'>
                  <RegistryIcon lucide='PaperclipIcon' aria-hidden='true' />
                </InputGroupButton>
                <InputGroupButton size='icon-xs' aria-label='Mention a document'>
                  <RegistryIcon lucide='AtSignIcon' aria-hidden='true' />
                </InputGroupButton>
              </span>
              <InputGroupButton type='submit' size='icon-xs' variant='default' aria-label='Send' disabled={!draft.trim()}>
                <RegistryIcon lucide='SendIcon' aria-hidden='true' />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </SheetContent>
    </Sheet>
  );
}
