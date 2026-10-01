'use client';
import { useState } from 'react';
import { default as AuthForm } from '../../../../src/components/blocks/AuthForm/index.js';
import { Screen } from '../../../../src/components/blocks/Screens/Screen.jsx';
import { default as Aurora } from '../../../../src/components/layout/Aurora/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const wait = () => new Promise((resolve) => setTimeout(resolve, 500));
const providers = [
  { id: 'google', label: 'Google', icon: <RegistryIcon lucide='Google' className='size-4' /> },
  { id: 'microsoft', label: 'Microsoft', icon: <RegistryIcon lucide='Microsoft' className='size-4' /> }
];

// Two overlapping frames read as a stack of work; the caption carries the editorial voice.
function Media() {
  return (
    <div className='bg-surface-muted relative grid h-full place-items-center p-8'>
      <img src='static/images/art/3.svg' alt='' className='absolute top-10 right-10 w-1/2 rotate-3 rounded-lg border shadow-md' />
      <img src='static/images/art/7.svg' alt='' className='relative w-3/4 -rotate-2 rounded-lg border shadow-lg' />
      <p className='absolute right-8 bottom-8 left-8 text-sm text-balance'>
        <span className='font-medium'>The maps issue.</span> <span className='text-text-muted'>Eleven essays, edited in Gaudi by a team of four.</span>
      </p>
    </div>
  );
}

export function Pattern() {
  const [mode, setMode] = useState('password');
  const [side, setSide] = useState('end');
  return (
    <div className='grid w-full max-w-5xl gap-3'>
      <div className='flex flex-wrap justify-end gap-3'>
        <ToggleGroup aria-label='Sign-in method' type='single' variant='outline' size='sm' spacing={0} value={mode} onValueChange={(next) => setMode(next || mode)}>
          <ToggleGroupItem value='password'>Password</ToggleGroupItem>
          <ToggleGroupItem value='email'>Email link</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup aria-label='Image side' type='single' variant='outline' size='sm' spacing={0} value={side} onValueChange={(next) => setSide(next || side)}>
          <ToggleGroupItem value='start'>Image left</ToggleGroupItem>
          <ToggleGroupItem value='end'>Image right</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {/* The aurora sits behind the form column; the Screen surface stays clear so it shows through. */}
      <Aurora className='min-h-0 items-stretch overflow-hidden rounded-xl'>
      <Screen
        aside={<Media />}
        asideSide={side}
        className='relative bg-transparent'
        header={<span className='flex items-center gap-2 font-semibold'><RegistryIcon lucide='BookOpenIcon' className='size-5' />Gaudi</span>}
        footer={<><span>© 2026 Gaudi</span><a href='#privacy' className='hover:text-text underline-offset-4 hover:underline'>Privacy</a></>}
      >
        <div className='bg-surface rounded-lg border p-6 shadow-xs'>
          <AuthForm
            key={mode}
            title={mode === 'password' ? 'Sign in to the newsroom' : 'Get a sign-in link'}
            description={mode === 'password' ? 'Use your work account.' : 'We email you a link that signs you in.'}
            mode={mode}
            submitLabel={mode === 'password' ? 'Sign in' : 'Email me a link'}
            emailPlaceholder='you@gaudi.dev'
            passwordAction={<a href='#reset' className='text-text-muted text-xs underline-offset-4 hover:underline'>Forgot password?</a>}
            providers={providers}
            onProvider={wait}
            onSubmit={wait}
            successMessage={mode === 'password' ? 'Signed in. Opening the newsroom…' : 'Check your inbox for the link.'}
          />
        </div>
      </Screen>
      </Aurora>
    </div>
  );
}
