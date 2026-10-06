'use client';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import { default as AuthForm } from '@gaudi/design-system/blocks/AuthForm';
import { Screen } from '@gaudi/design-system/blocks/Screens';
import { default as Button } from '@gaudi/design-system/core/Button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@gaudi/design-system/core/InputOtp';
import { Label } from '@gaudi/design-system/core/Field';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { Dropbox } from '@gaudi/design-system/icons/brands/dropbox';
import { Loom } from '@gaudi/design-system/icons/brands/loom';
import { Stripe } from '@gaudi/design-system/icons/brands/stripe';
import { Supabase } from '@gaudi/design-system/icons/brands/supabase';

const wait = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));
const customers = [['Stripe', Stripe], ['Supabase', Supabase], ['Dropbox', Dropbox], ['Loom', Loom]];
const methods = [
  { id: 'passkey', label: 'Sign in with a passkey', icon: 'FingerPrintIcon' },
  { id: 'sso', label: 'Single sign-on (SAML)', icon: 'Building2Icon' },
  { id: 'email', label: 'Continue with email', icon: 'MailIcon' }
];
const supportsPasskeys = () => typeof window !== 'undefined' && 'PublicKeyCredential' in window;

export function Pattern() {
  const [method, setMethod] = useState('');
  const [passkey, setPasskey] = useState('idle');
  const [code, setCode] = useState('');
  const [backup, setBackup] = useState(false);
  // The host would call navigator.credentials.get with a server challenge here; the example waits instead.
  const signInWithPasskey = async () => {
    if (!supportsPasskeys()) return setPasskey('unsupported');
    setPasskey('pending');
    await wait(800);
    setPasskey('done');
  };
  const back = (
    <Button variant='ghost' size='sm' className='justify-self-start' onClick={() => { setMethod(''); setBackup(false); }}>
      <RegistryIcon lucide='ArrowLeftIcon' />
      All sign-in options
    </Button>
  );
  return (
    <Screen
      className='max-w-4xl'
      header={
        <>
          <span className='flex items-center gap-2 font-semibold'><GaudiBrand className='text-sm' /></span>
          <span className='text-text-muted text-sm'>New here? <a href='#signup' className='text-text font-medium underline-offset-4 hover:underline'>Create a workspace</a></span>
        </>
      }
      footer={
        <div className='grid w-full justify-items-center gap-3'>
          <span>Used by product teams at</span>
          <ul aria-label='Customers' className='flex flex-wrap justify-center gap-6'>
            {customers.map(([name, Logo]) => (
              <li key={name} className='flex items-center gap-1.5 text-sm'>
                <Logo className='size-4' aria-hidden='true' />
                {name}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      {method === 'sso' ? (
        <div className='grid gap-4'>
          {back}
          {backup ? (
            <form
              className='grid gap-4'
              aria-label='Backup code'
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <div className='grid gap-1'>
                <h2 className='text-lg font-semibold'>Use a backup code</h2>
                <p className='text-text-muted text-sm'>Each of your eight backup codes works once.</p>
              </div>
              <Label htmlFor='backup-code'>Backup code</Label>
              <InputOTP id='backup-code' maxLength={8} value={code} onChange={setCode}>
                <InputOTPGroup>
                  {[0, 1, 2, 3].map((index) => <InputOTPSlot key={index} index={index} />)}
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  {[4, 5, 6, 7].map((index) => <InputOTPSlot key={index} index={index} />)}
                </InputOTPGroup>
              </InputOTP>
              <Button type='submit' disabled={code.length < 8}>Verify code</Button>
            </form>
          ) : (
            <AuthForm
              title='Single sign-on'
              description='We send you to your identity provider, then straight back here.'
              mode='email'
              emailLabel='Work email'
              emailPlaceholder='name@company.com'
              submitLabel='Continue with SSO'
              pendingLabel='Finding your provider…'
              onSubmit={() => wait()}
              successMessage='Redirecting to your identity provider…'
              footer={<Button variant='link' size='sm' className='justify-self-center' onClick={() => setBackup(true)}>Lost access? Use a backup code</Button>}
            />
          )}
        </div>
      ) : method === 'email' ? (
        <div className='grid gap-4'>
          {back}
          <AuthForm
            title='Sign in to your workspace'
            description='We email you a link; no password needed.'
            mode='email'
            emailLabel='Work email'
            emailPlaceholder='name@company.com'
            submitLabel='Email me a link'
            providers={[
              { id: 'google', label: 'Google', icon: <RegistryIcon lucide='Google' className='size-4' /> },
              { id: 'github', label: 'GitHub', icon: <RegistryIcon lucide='Github' className='size-4' /> }
            ]}
            onProvider={() => wait()}
            onSubmit={() => wait()}
            successMessage='Check your inbox. The link signs you in on this device.'
          />
        </div>
      ) : (
        <section aria-labelledby='methods-title' className='grid gap-5'>
          <div className='grid gap-1 text-center'>
            <h2 id='methods-title' className='text-xl font-semibold'>Sign in to Gaudi</h2>
            <p className='text-text-muted text-sm'>Choose how you want to sign in.</p>
          </div>
          <div className='grid gap-2'>
            {methods.map((item) => (
              <Button
                key={item.id}
                variant={item.id === 'passkey' ? 'solid' : 'outline'}
                tone={item.id === 'passkey' ? undefined : 'neutral'}
                disabled={passkey === 'pending'}
                onClick={() => (item.id === 'passkey' ? signInWithPasskey() : setMethod(item.id))}
              >
                <RegistryIcon lucide={item.icon} />
                {item.id === 'passkey' && passkey === 'pending' ? 'Waiting for your device…' : item.label}
              </Button>
            ))}
          </div>
          <p role='status' className='text-text-muted min-h-5 text-center text-sm'>
            {passkey === 'done' ? 'Passkey accepted. Signing you in…' : passkey === 'unsupported' ? 'This browser cannot use passkeys. Choose another option.' : ''}
          </p>
        </section>
      )}
    </Screen>
  );
}
