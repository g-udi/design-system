'use client';
import { useState } from 'react';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { FieldRoot as Field } from '@gaudi/design-system/core/Field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupText
} from '@gaudi/design-system/core/Input';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const models = ['Balanced', 'Fast', 'Deep reasoning'];
const tools = [
  { icon: 'PaperclipIcon', label: 'Add photos and files' },
  { icon: 'ImageIcon', label: 'Create image' },
  { icon: 'SearchIcon', label: 'Deep research' }
];
const more = [
  { icon: 'BookOpenIcon', label: 'Study and learn' },
  { icon: 'LayoutDashboardIcon', label: 'Canvas' }
];

export function Pattern() {
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState('');
  const [model, setModel] = useState(models[0]);
  const [webSearch, setWebSearch] = useState(false);
  return (
    <div className='mx-auto grid w-full max-w-lg gap-4'>
      {/* Single-line prompt bar: a tools menu, the prompt, voice actions. */}
      <Field>
        <InputGroup className='h-11 rounded-full p-1'>
          <InputGroupAddon className='pl-1'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton aria-label='Add' variant='ghost' size='icon-sm' className='rounded-full'>
                  <RegistryIcon lucide='PlusIcon' className='size-5' />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='top' align='start' sideOffset={8} className='w-52'>
                {tools.map((tool) => (
                  <DropdownMenuItem key={tool.label} onSelect={() => setFeedback(`${tool.label} selected in this demo.`)}>
                    <RegistryIcon lucide={tool.icon} />
                    {tool.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <RegistryIcon lucide='SparklesIcon' />
                    More
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className='w-44'>
                    {more.map((tool) => (
                      <DropdownMenuItem key={tool.label} onSelect={() => setFeedback(`${tool.label} selected in this demo.`)}>
                        <RegistryIcon lucide={tool.icon} />
                        {tool.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
          <InputGroupInput value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && prompt.trim()) { setFeedback(`Prompt prepared in this demo: ${prompt.trim()}`); setPrompt(''); } }} aria-label='Ask anything' placeholder='Ask anything' className='px-1' />
          <InputGroupAddon align='inline-end' className='gap-1 pr-0'>
            <InputGroupButton aria-label='Use microphone' disabled title='Recording requires a host integration' variant='ghost' size='icon-sm' className='rounded-full'>
              <RegistryIcon lucide='MicIcon' className='size-4' />
            </InputGroupButton>
            <InputGroupButton aria-label='Start voice chat' disabled title='Voice chat requires a host integration' variant='default' size='icon-sm' className='rounded-full'>
              <RegistryIcon lucide='AudioLinesIcon' className='size-4' />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      {/* Multi-line composer: context chips above, model and actions below. */}
      <Field>
        <InputGroup>
          <InputGroupAddon align='block-start' className='gap-1.5'>
            <InputGroupButton aria-label='Mention someone' disabled title='Mentions require a host directory' variant='outline' size='icon-xs'>
              <RegistryIcon lucide='AtSignIcon' className='size-3.5' />
            </InputGroupButton>
            <InputGroupText className='gap-1 rounded-sm border px-1.5 text-xs'>
              <RegistryIcon lucide='PaperclipIcon' className='size-3.5' />
              brief.pdf
            </InputGroupText>
            <InputGroupText className='gap-1 rounded-sm border px-1.5 text-xs'>
              <RegistryIcon lucide='FileTextIcon' className='size-3.5' />1 tab
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupTextarea value={draft} onChange={(event) => setDraft(event.target.value)} aria-label='Plan, search, build anything' placeholder='Plan, search, build anything' className='min-h-16' />
          <InputGroupAddon align='block-end' className='gap-1'>
            <InputGroupButton aria-label='Use microphone' disabled title='Recording requires a host integration' variant='ghost' size='icon-xs'>
              <RegistryIcon lucide='MicIcon' className='size-4' />
            </InputGroupButton>
            <InputGroupButton
              variant={webSearch ? 'secondary' : 'ghost'}
              size='xs'
              aria-pressed={webSearch}
              onClick={() => setWebSearch((current) => !current)}
            >
              <RegistryIcon lucide='GlobeIcon' className='size-3.5' />
              Search
            </InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton variant='ghost' size='xs' aria-label={`Model: ${model}`}>
                  {model}
                  <RegistryIcon lucide='ChevronDownIcon' className='size-3.5 opacity-60' />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='min-w-36'>
                {models.map((item) => (
                  <DropdownMenuItem key={item} onSelect={() => setModel(item)}>
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className='ml-auto flex items-center gap-1'>
              <InputGroupButton aria-label='Attach image' disabled title='Image selection requires a host integration' variant='ghost' size='icon-xs'>
                <RegistryIcon lucide='ImageIcon' className='size-4' />
              </InputGroupButton>
              <InputGroupButton aria-label='Send message' disabled={!draft.trim()} onClick={() => { setFeedback(`Prompt prepared with ${model}${webSearch ? ' and search' : ''}: ${draft.trim()}`); setDraft(''); }} variant='default' size='icon-xs'>
                <RegistryIcon lucide='ArrowUpIcon' className='size-4' />
              </InputGroupButton>
            </div>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <p role='status' className='text-xs text-text-muted'>{feedback || 'Local composer demo. Recording, attachments and mentions are host integrations.'}</p>
    </div>
  );
}
