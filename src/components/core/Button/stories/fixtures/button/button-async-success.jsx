'use client';
import { useEffect, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [status, setStatus] = useState('idle');
  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => setStatus('idle'), 2e3);
    return () => clearTimeout(timer);
  }, [status]);
  return (
    <Button
      onClick={() => {
        if (status !== 'idle') return;
        setStatus('loading');
        setTimeout(() => setStatus('success'), 900);
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
