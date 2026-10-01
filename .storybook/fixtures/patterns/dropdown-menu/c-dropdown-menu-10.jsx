'use client';
import { useState } from 'react';
import { ClaudeAiIcon } from '../../../../src/icons/brands/claudeAiIcon.jsx';
import { Gemini } from '../../../../src/icons/brands/gemini.jsx';
import { Openai } from '../../../../src/icons/brands/openai.jsx';
import { OpenaiDark } from '../../../../src/icons/brands/openaiDark.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const workspaces = [
  { id: 'studio', name: 'Gaudi Studio', plan: 'Enterprise', image: 'static/images/art/2.svg' },
  { id: 'labs', name: 'Harbor Labs', plan: 'Pro', image: 'static/images/art/6.svg' },
  { id: 'personal', name: 'Alex Wong', plan: 'Personal', image: 'https://randomuser.me/api/portraits/men/32.jpg' }
];
const models = [
  { id: 'gpt', label: 'GPT-5.4', logo: <Openai />, logoDark: <OpenaiDark /> },
  { id: 'claude', label: 'Claude 4.6 Opus', logo: <ClaudeAiIcon /> },
  { id: 'gemini', label: 'Gemini 3.1 Pro', logo: <Gemini /> }
];
const Check = () => <RegistryIcon lucide='CheckIcon' className='text-accent ml-auto size-4' aria-hidden='true' />;
function ModelLogo({ model }) {
  if (!model.logoDark) return <span aria-hidden='true'>{model.logo}</span>;
  return (
    <>
      <span aria-hidden='true' className='dark:hidden'>{model.logo}</span>
      <span aria-hidden='true' className='hidden dark:block'>{model.logoDark}</span>
    </>
  );
}
function WorkspaceImage({ workspace, className }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={workspace.image} alt='' />
      <AvatarFallback className='rounded-md text-xs'>{workspace.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
// Switchers: the trigger shows the current choice and the menu marks it with a check.
export function Pattern() {
  const [workspaceId, setWorkspaceId] = useState('labs');
  const [modelId, setModelId] = useState('claude');
  const workspace = workspaces.find((w) => w.id === workspaceId);
  const model = models.find((m) => m.id === modelId);
  return (
    <div className='flex flex-wrap items-center justify-center gap-3'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='w-48' aria-label={`Workspace: ${workspace.name}`}>
            <WorkspaceImage workspace={workspace} className='size-5 rounded-md' />
            <span className='truncate text-sm font-medium'>{workspace.name}</span>
            <RegistryIcon lucide='ChevronsUpDownIcon' className='ml-auto size-3.5 opacity-60' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='start' sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            {workspaces.map((item) => (
              <DropdownMenuItem key={item.id} onSelect={() => setWorkspaceId(item.id)}>
                <WorkspaceImage workspace={item} className='size-6 rounded-md' />
                <span className='flex min-w-0 flex-col'>
                  <span className='truncate text-sm font-medium'>{item.name}</span>
                  <span className='text-text-muted text-xs'>{item.plan}</span>
                </span>
                {item.id === workspaceId && <Check />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
              Create workspace
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
              Manage workspaces
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='w-44' aria-label={`Model: ${model.label}`}>
            <ModelLogo model={model} />
            <span className='truncate'>{model.label}</span>
            <RegistryIcon lucide='ChevronDownIcon' className='ml-auto' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-52'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Model</DropdownMenuLabel>
            {models.map((item) => (
              <DropdownMenuItem key={item.id} onSelect={() => setModelId(item.id)}>
                <ModelLogo model={item} />
                {item.label}
                {item.id === modelId && <Check />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
