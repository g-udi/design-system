'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../src/components/core/Popover/parts/popover.jsx';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../../src/components/core/Resizable/parts/resizable.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { AgentMark } from '../../../../src/components/chat/AgentMark/index.js';
import { Bubble, BubbleContent } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import { PromptComposer } from '../../../../src/components/chat/ChatInput/parts/prompt-composer.jsx';
import { Message, MessageContent } from '../../../../src/components/chat/Message/parts/message.jsx';
import { useMediaQuery } from '../../../../src/hooks/use-media-query.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const models = [
  { id: 'fast', label: 'Gaudi Fast', note: 'Quick edits and summaries' },
  { id: 'writer', label: 'Gaudi Writer', note: 'Long-form drafting' },
  { id: 'research', label: 'Gaudi Research', note: 'Sources and citations' },
  { id: 'code', label: 'Gaudi Code', note: 'Site and template changes' }
];
const threads = [
  { id: 't1', title: 'Outline for the archive issue', when: 'Today' },
  { id: 't2', title: 'Rewrite the welcome email', when: 'Today' },
  { id: 't3', title: 'Find sources on RSS adoption', when: 'Yesterday' },
  { id: 't4', title: 'Fix the newsletter template', when: 'Mon' }
];
const initialTasks = [
  { id: 'k1', title: 'Proofread “Small tools, long lifetimes”', done: false },
  { id: 'k2', title: 'Pick three reader letters for Friday', done: false },
  { id: 'k3', title: 'Schedule the archive issue', done: true }
];

function ModelPicker({ model, onChange }) {
  const current = models.find((entry) => entry.id === model);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='sm' variant='outline' tone='neutral' aria-label={`Model: ${current.label}`}>
          {current.label}
          <RegistryIcon lucide='ChevronDown' className='size-3.5' aria-hidden='true' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-80 p-2'>
        <ul className='grid grid-cols-2 gap-1.5' aria-label='Models'>
          {models.map((entry) => (
            <li key={entry.id}>
              <button type='button' aria-pressed={entry.id === model} onClick={() => onChange(entry.id)} className='hover:bg-surface-muted aria-pressed:border-accent aria-pressed:bg-accent-subtle grid h-full w-full gap-0.5 rounded-(--ds-radius-control) border p-2.5 text-start'>
                <span className='text-sm font-medium'>{entry.label}</span>
                <span className='text-text-muted text-xs'>{entry.note}</span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function Conversation({ turns, compact = false }) {
  return (
    <div role='log' aria-label='Conversation' aria-live='polite' className={`mx-auto grid w-full gap-4 ${compact ? 'p-3' : 'max-w-2xl p-4'}`}>
      {turns.map((turn) => (
        turn.role === 'user' ? (
          <Message key={turn.id} align='end'>
            <MessageContent><span className='sr-only'>You said</span><Bubble align='end'><BubbleContent>{turn.text}</BubbleContent></Bubble></MessageContent>
          </Message>
        ) : (
          <Message key={turn.id}>
            <AgentMark name='Gaudi' size='sm' decorative />
            <MessageContent><span className='sr-only'>Gaudi said</span><p className='text-sm leading-relaxed'>{turn.text}</p></MessageContent>
          </Message>
        )
      ))}
    </div>
  );
}

export function Pattern() {
  const [model, setModel] = useState('writer');
  const [thread, setThread] = useState('t1');
  const [query, setQuery] = useState('');
  const [assistant, setAssistant] = useState(true);
  const [tasks, setTasks] = useState(initialTasks);
  const [turns, setTurns] = useState([
    { id: 'u1', role: 'user', text: 'Draft an outline for the archive issue: three sections, a short intro.' },
    { id: 'a1', role: 'assistant', text: 'Here is a start: 1. Why the archive matters now. 2. What we moved and what we kept. 3. How to search 12 years of posts. The intro opens with the reader letter from Ana.' }
  ]);
  const wide = useMediaQuery('(min-width: 1024px)', true);
  const send = (text) => text && setTurns((current) => [...current, { id: `u${current.length}`, role: 'user', text }, { id: `a${current.length}`, role: 'assistant', text: 'Noted. I will fold that into the outline and mark the changes.' }]);
  const shownThreads = threads.filter((entry) => entry.title.toLowerCase().includes(query.toLowerCase()));

  const threadList = (
    <div className='flex h-full min-h-0 flex-col'>
      <div className='p-3'>
        <Input type='search' aria-label='Search chats' placeholder='Search chats' value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <ul className='min-h-0 flex-1 overflow-y-auto px-2 pb-2' aria-label='Chats'>
        {shownThreads.map((entry) => (
          <li key={entry.id}>
            <button type='button' aria-current={thread === entry.id ? 'true' : undefined} onClick={() => setThread(entry.id)} className='hover:bg-surface-muted aria-[current=true]:bg-accent-subtle grid w-full gap-0.5 rounded-(--ds-radius-control) px-2.5 py-2 text-start text-sm'>
              <span className='truncate'>{entry.title}</span>
              <span className='text-text-muted text-xs'>{entry.when}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const chat = (
    <div className='flex h-full min-h-0 flex-col'>
      <div className='flex items-center gap-2 border-b px-3 py-2'>
        <ModelPicker model={model} onChange={setModel} />
        <span className='text-text-muted truncate text-xs'>{threads.find((entry) => entry.id === thread)?.title}</span>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto'><Conversation turns={turns} /></div>
      <div className='mx-auto w-full max-w-2xl p-3'><PromptComposer onSubmit={send} labels={{ placeholder: 'Message Gaudi' }} /></div>
    </div>
  );

  return (
    <SidebarProvider shortcut={false} defaultOpen={false} className='bg-surface-muted relative h-[44rem] min-h-0 w-full overflow-hidden rounded-(--ds-radius-card) border'>
      <Sidebar collapsible='icon' variant='floating' className='absolute h-full'>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' tooltip='Gaudi'>
                <AgentMark name='Gaudi' size='md' decorative />
                <span className='font-semibold'>Gaudi</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {[['New chat', 'SquarePen'], ['Chats', 'MessageSquare', true], ['Tasks', 'ClipboardList'], ['Library', 'Bookmark']].map(([label, icon, active]) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton tooltip={label} isActive={active} aria-current={active ? 'page' : undefined}>
                      <RegistryIcon lucide={icon} aria-hidden='true' />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className='min-h-0 min-w-0 bg-[linear-gradient(to_bottom,var(--ds-color-accent-subtle),transparent_16rem)]'>
        <Tabs defaultValue='chat' className='flex min-h-0 flex-1 flex-col gap-0'>
          <div className='flex items-end gap-2 px-3 pt-2'>
            <SidebarTrigger className='mb-1' />
            {/* Folder tabs: the active tab joins the panel below it. */}
            <TabsList variant='type' aria-label='Workspace' className='gap-1 bg-transparent p-0'>
              {[['chat', 'Chat'], ['tasks', 'Tasks']].map(([value, label]) => (
                <TabsTrigger key={value} value={value} className='data-[state=active]:bg-surface rounded-t-(--ds-radius-card) rounded-b-none border border-b-0 border-transparent px-4 py-2 data-[state=active]:border-(--ds-color-border)'>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className='bg-surface mx-2 mb-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-(--ds-radius-card) rounded-tl-none border'>
            <TabsContent value='chat' className='min-h-0 flex-1'>
              {wide ? (
                <ResizablePanelGroup orientation='horizontal'>
                  <ResizablePanel defaultSize='28%' minSize='20%' maxSize='40%' className='border-e'>{threadList}</ResizablePanel>
                  <ResizableHandle withHandle aria-label='Resize chat list' />
                  <ResizablePanel defaultSize='72%'>{chat}</ResizablePanel>
                </ResizablePanelGroup>
              ) : chat}
            </TabsContent>
            <TabsContent value='tasks' className='flex min-h-0 flex-1'>
              <div className='min-h-0 min-w-0 flex-1 overflow-y-auto p-4'>
                <div className='flex items-center justify-between gap-2'>
                  <h1 className='font-semibold'>This week</h1>
                  <Button size='sm' variant={assistant ? 'soft' : 'outline'} tone='neutral' aria-pressed={assistant} onClick={() => setAssistant((open) => !open)}>
                    <RegistryIcon lucide='Sparkles' className='size-4' aria-hidden='true' />Ask Gaudi
                  </Button>
                </div>
                <ul className='mt-4 divide-y rounded-(--ds-radius-card) border'>
                  {tasks.map((task) => (
                    <li key={task.id} className='flex items-center gap-3 px-4 py-3 text-sm'>
                      <Checkbox id={`shell-task-${task.id}`} checked={task.done} onCheckedChange={(checked) => setTasks((current) => current.map((entry) => (entry.id === task.id ? { ...entry, done: Boolean(checked) } : entry)))} />
                      <label htmlFor={`shell-task-${task.id}`} className={task.done ? 'text-text-muted line-through' : undefined}>{task.title}</label>
                      {task.done ? <Badge variant='success-light' className='ms-auto'>Done</Badge> : null}
                    </li>
                  ))}
                </ul>
              </div>
              {assistant ? (
                <aside aria-label='Gaudi assistant' className='bg-surface-muted hidden w-80 shrink-0 flex-col border-s lg:flex'>
                  <div className='min-h-0 flex-1 overflow-y-auto'>
                    <Conversation compact turns={[{ id: 'tq', role: 'user', text: 'Which task should I do first?' }, { id: 'ta', role: 'assistant', text: 'Proofread the essay first: it goes out Friday and the reader letters depend on its theme.' }]} />
                  </div>
                  <div className='p-3'><PromptComposer onSubmit={() => {}} labels={{ placeholder: 'Ask about these tasks' }} /></div>
                </aside>
              ) : null}
            </TabsContent>
          </div>
        </Tabs>
      </SidebarInset>
    </SidebarProvider>
  );
}
