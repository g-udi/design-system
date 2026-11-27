'use client';
import { useRef, useState } from 'react';
import { useHotkey } from '@gaudi/design-system/hooks/interaction/use-hotkey';
import { default as Button } from '@gaudi/design-system/core/Button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gaudi/design-system/core/Input';
import Kbd from '@gaudi/design-system/core/Kbd';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const components = ['Button', 'Calendar', 'Command', 'Dialog', 'Navigation Menu', 'Tooltip'];

export function Pattern() {
  const form = useRef(null);
  const input = useRef(null);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const clear = () => {
    setQuery('');
    setSubmitted(null);
    input.current?.focus();
  };
  const focusShortcut = useHotkey('mod+k', () => input.current?.focus());
  const clearShortcut = useHotkey('escape', clear, { target: form, enableInInputs: true });
  const matches = components.filter((name) => name.toLowerCase().includes(submitted?.toLowerCase() ?? ''));
  return (
    <TooltipProvider>
      <form
        ref={form}
        className='mx-auto flex w-full max-w-md flex-wrap items-center justify-center gap-2'
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(query.trim());
        }}
      >
        <InputGroup className='w-56'>
          <InputGroupAddon>
            <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput
            ref={input}
            aria-label='Search components'
            aria-keyshortcuts={focusShortcut.ariaKeyShortcuts}
            placeholder='Find a component…'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <InputGroupAddon align='inline-end'>
            <Kbd keys={focusShortcut.kbdKeys} size='sm' aria-hidden='true' />
          </InputGroupAddon>
        </InputGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              aria-label='Clear search'
              aria-keyshortcuts={clearShortcut.ariaKeyShortcuts}
              size='icon'
              variant='outline'
              onClick={clear}
            >
              <RegistryIcon lucide='XIcon' aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent className='pr-1.5'>
            <span className='flex items-center gap-2'>
              Clear search <Kbd keys='escape' size='sm' aria-hidden='true' />
            </span>
          </TooltipContent>
        </Tooltip>
        <Button type='submit' variant='outline'>
          Search
          <Kbd keys='enter' size='sm' aria-hidden='true' />
        </Button>
        <p role='status' className='w-full text-center text-sm text-text-muted'>
          {submitted !== null && (matches.length ? matches.join(', ') : 'No matching components')}
        </p>
      </form>
    </TooltipProvider>
  );
}
