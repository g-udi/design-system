import { useRef, useState } from 'react';
import { useHotkey } from '@gaudi/design-system/hooks/interaction/use-hotkey';
import Button from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@gaudi/design-system/core/EmptyState';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import { KbdRoot as Kbd } from '@gaudi/design-system/core/Kbd';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const { ariaKeyShortcuts } = useHotkey('/', () => searchRef.current?.focus());
  return (
    <div className='mx-auto w-full max-w-lg'>
      <Empty className='border'>
        <EmptyHeader>
          <EmptyTitle>404 — Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <form className='grid w-full gap-2' onSubmit={(event) => { event.preventDefault(); setSubmitted(query.trim()); }}>
          <InputGroup>
            <InputGroupInput
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-keyshortcuts={ariaKeyShortcuts}
              aria-label='Try searching for pages…'
              placeholder='Try searching for pages…'
            />
            <InputGroupAddon>
              <RegistryIcon lucide='SearchIcon' />
            </InputGroupAddon>
            <InputGroupAddon align='inline-end'>
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <Button type='submit' size='sm' disabled={!query.trim()}>Search pages</Button>
          {submitted ? <p role='status' className='text-xs text-text-muted'>Search prepared for “{submitted}” in this demo. No service request was sent.</p> : null}
          </form>
          <EmptyDescription>
            Need help? <Link href='/support'>Contact support</Link>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}
