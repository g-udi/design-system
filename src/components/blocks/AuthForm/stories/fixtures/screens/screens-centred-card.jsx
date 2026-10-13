'use client';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import { default as AuthForm } from '@gaudi/design-system/blocks/AuthForm';
import { Screen } from '@gaudi/design-system/blocks/Screens';
import { CardRoot as Card, CardContent } from '@gaudi/design-system/core/Card';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import { Label } from '@gaudi/design-system/core/Field';
import Link from '@gaudi/design-system/core/Link';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { cn } from '@gaudi/design-system/utilities/cn';

const wait = () => new Promise((resolve) => setTimeout(resolve, 500));
const providers = [
  { id: 'google', label: 'Continue with Google', icon: <RegistryIcon lucide='Google' className='size-4' /> },
  { id: 'apple', label: 'Continue with Apple', icon: <RegistryIcon lucide='Apple' className='size-4' /> }
];
const links = ['Help', 'Status', 'Privacy', 'Terms'];

export function Pattern() {
  const [mode, setMode] = useState('password');
  const [backdrop, setBackdrop] = useState('photo');
  return (
    <div className='grid w-full max-w-4xl gap-3'>
      <div className='flex flex-wrap justify-end gap-3'>
        <ToggleGroup aria-label='Sign-in method' type='single' variant='outline' size='sm' spacing={0} value={mode} onValueChange={(next) => setMode(next || mode)}>
          <ToggleGroupItem value='password'>Password</ToggleGroupItem>
          <ToggleGroupItem value='email'>Email link</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup aria-label='Backdrop' type='single' variant='outline' size='sm' spacing={0} value={backdrop} onValueChange={(next) => setBackdrop(next || backdrop)}>
          <ToggleGroupItem value='plain'>Plain</ToggleGroupItem>
          <ToggleGroupItem value='photo'>Photo</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Screen
        className={cn('relative isolate', backdrop === 'photo' && 'bg-surface-muted')}
        footer={
          <>
            <span>© 2026 Gaudi</span>
            <nav aria-label='Legal' className='flex gap-4'>
              {links.map((link) => <Link key={link} href={`#${link.toLowerCase()}`} variant='muted'>{link}</Link>)}
            </nav>
          </>
        }
      >
        {backdrop === 'photo' ? (
          // The softened photo sits behind the card; the blur and tint keep the form readable.
          <img src='static/images/art/9.svg' alt='' className='absolute inset-0 -z-10 size-full object-cover opacity-40 blur-sm' />
        ) : null}
        <Card className='shadow-lg'>
          <CardContent className='grid gap-5'>
            <GaudiBrand className='justify-self-center text-base' />
            <AuthForm
              key={mode}
              title='Sign in to Gaudi'
              mode={mode}
              identifier={mode === 'password' ? 'username' : 'email'}
              emailLabel={mode === 'password' ? 'Email or username' : 'Email'}
              submitLabel={mode === 'password' ? 'Sign in' : 'Email me a link'}
              passwordHint={false}
              passwordAction={<Link href='#reset' variant='muted' className='text-xs'>Forgot?</Link>}
              providers={providers}
              providerLayout='stack'
              onProvider={wait}
              onSubmit={wait}
              successMessage={mode === 'password' ? 'Signed in.' : 'Check your inbox for the link.'}
              footer={
                <p className='text-text-muted text-center text-xs text-balance'>
                  By continuing you agree to the <Link href='#terms' variant='bare' className='underline underline-offset-4'>Terms</Link> and <Link href='#privacy' variant='bare' className='underline underline-offset-4'>Privacy Policy</Link>.
                </p>
              }
            >
              {mode === 'password' ? (
                <div className='flex items-center gap-2'>
                  <Checkbox id='kiln-remember' name='remember' defaultChecked />
                  <Label htmlFor='kiln-remember' className='font-normal'>Keep me signed in</Label>
                </div>
              ) : null}
            </AuthForm>
          </CardContent>
        </Card>
      </Screen>
    </div>
  );
}
