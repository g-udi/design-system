// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { ClaudeAiIcon } from '../../../../src/icons/brands/claudeAiIcon.jsx';
import { Gemini } from '../../../../src/icons/brands/gemini.jsx';
import { Openai } from '../../../../src/icons/brands/openai.jsx';
import { OpenaiDark } from '../../../../src/icons/brands/openaiDark.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const menuItems = [
  {
    id: 'gpt4o',
    label: 'GPT-5.4',
    logo: <Openai />,
    logoDark: <OpenaiDark />
  },
  {
    id: 'claude',
    label: 'Claude 4.6 Opus',
    logo: <ClaudeAiIcon />
  },
  { id: 'gemini', label: 'Gemini 3.1 Pro', logo: <Gemini /> }
];
export function Pattern() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='w-36'>
          Select model
          <RegistryIcon
            lucide='ChevronDownIcon'
            className='ml-auto'
            aria-hidden='true'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Model</DropdownMenuLabel>
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.id}>
              {item.logoDark ? (
                <>
                  <span aria-hidden className='dark:hidden'>
                    {item.logo}
                  </span>
                  <span aria-hidden className='hidden dark:block'>
                    {item.logoDark}
                  </span>
                </>
              ) : (
                item.logo
              )}
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
