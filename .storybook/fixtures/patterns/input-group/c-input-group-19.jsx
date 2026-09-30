'use client';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

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
                  <DropdownMenuItem key={tool.label}>
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
                      <DropdownMenuItem key={tool.label}>
                        <RegistryIcon lucide={tool.icon} />
                        {tool.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
          <InputGroupInput aria-label='Ask anything' placeholder='Ask anything' className='px-1' />
          <InputGroupAddon align='inline-end' className='gap-1 pr-0'>
            <InputGroupButton aria-label='Use microphone' variant='ghost' size='icon-sm' className='rounded-full'>
              <RegistryIcon lucide='MicIcon' className='size-4' />
            </InputGroupButton>
            <InputGroupButton aria-label='Start voice chat' variant='default' size='icon-sm' className='rounded-full'>
              <RegistryIcon lucide='AudioLinesIcon' className='size-4' />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      {/* Multi-line composer: context chips above, model and actions below. */}
      <Field>
        <InputGroup>
          <InputGroupAddon align='block-start' className='gap-1.5'>
            <InputGroupButton aria-label='Mention someone' variant='outline' size='icon-xs'>
              <RegistryIcon lucide='AtSignIcon' className='size-3.5' />
            </InputGroupButton>
            <InputGroupButton variant='outline' size='xs'>
              <RegistryIcon lucide='PaperclipIcon' className='size-3.5' />
              brief.pdf
            </InputGroupButton>
            <InputGroupButton variant='outline' size='xs'>
              <RegistryIcon lucide='FileTextIcon' className='size-3.5' />1 tab
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupTextarea aria-label='Plan, search, build anything' placeholder='Plan, search, build anything' className='min-h-16' />
          <InputGroupAddon align='block-end' className='gap-1'>
            <InputGroupButton aria-label='Use microphone' variant='ghost' size='icon-xs'>
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
              <InputGroupButton aria-label='Attach image' variant='ghost' size='icon-xs'>
                <RegistryIcon lucide='ImageIcon' className='size-4' />
              </InputGroupButton>
              <InputGroupButton aria-label='Send message' variant='default' size='icon-xs'>
                <RegistryIcon lucide='ArrowUpIcon' className='size-4' />
              </InputGroupButton>
            </div>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
