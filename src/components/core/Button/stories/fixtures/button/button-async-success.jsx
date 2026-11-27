'use client';
import { useTimeout } from '@gaudi/design-system/hooks';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [status, setStatus] = useState('idle');
  useTimeout(() => setStatus('success'), status === 'loading' ? 900 : null);
  useTimeout(() => setStatus('idle'), status === 'success' ? 2000 : null);
  return (
    <Button
      onClick={() => {
        if (status !== 'idle') return;
        setStatus('loading');
      }}
      disabled={status === 'loading'}
      aria-busy={status === 'loading'}
      aria-live='polite'
      className='min-w-32'
    >
      {status === 'loading' ? (
        <>
          <Loader aria-hidden='true' />
          Saving…
        </>
      ) : status === 'success' ? (
        <>
          <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
          Saved
        </>
      ) : (
        'Save changes'
      )}
    </Button>
  );
}
