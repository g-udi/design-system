'use client';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageContent } from '@gaudi/design-system/chat/ChatMessage';
import {
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@gaudi/design-system/core/Sheet';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

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
              <ChatMessage key={index} align={message.role === 'user' ? 'end' : 'start'} aria-label={message.role === 'user' ? 'You' : 'Writing assistant'}>
                <ChatMessageContent>
                  <ChatBubble align={message.role === 'user' ? 'end' : 'start'} variant={message.role === 'user' ? 'default' : 'muted'}>
                    <ChatBubbleContent>{message.text}</ChatBubbleContent>
                  </ChatBubble>
                </ChatMessageContent>
              </ChatMessage>
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
        <div className='border-t p-3'>
          <ChatPromptComposer value={draft} onValueChange={setDraft} onSubmit={send} labels={{ placeholder: 'Ask about this draft…' }} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
