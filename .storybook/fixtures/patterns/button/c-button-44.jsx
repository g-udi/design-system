'use client';
import { useEffect, useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
          <Spinner aria-hidden='true' />
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
