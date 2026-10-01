'use client';
import { default as AuthForm } from '../../../../src/components/blocks/AuthForm/index.js';
import { Screen } from '../../../../src/components/blocks/Screens/Screen.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const wait = () => new Promise((resolve) => setTimeout(resolve, 600));
const perks = [
  ['Unlimited drafts and collaborators', 'UsersIcon'],
  ['Custom domain with HTTPS', 'GlobeIcon'],
  ['Newsletter sends up to 10,000 readers', 'MailIcon'],
  ['Cancel any time; no card needed', 'ShieldCheckIcon']
];

export function Pattern() {
  return (
    <Screen
      className='max-w-5xl'
      asideClassName='bg-surface-muted'
      aside={
        <div className='relative isolate grid h-full content-center gap-6 overflow-hidden p-10'>
          {/* Soft colour fields from the semantic tones; they drift only when motion is allowed. */}
          <span aria-hidden='true' className='bg-accent-subtle absolute -top-16 -right-10 -z-10 size-72 rounded-full blur-3xl motion-safe:animate-pulse' />
          <span aria-hidden='true' className='bg-discovery-subtle absolute -bottom-20 -left-10 -z-10 size-80 rounded-full blur-3xl' />
          <Badge variant='primary-light' className='justify-self-start'>14-day free trial</Badge>
          <p className='text-2xl font-semibold text-balance'>Everything in Pro, free for two weeks</p>
          <ul className='grid gap-3 text-sm'>
            {perks.map(([perk, icon]) => (
              <li key={perk} className='flex items-center gap-3'>
                <span className='bg-surface grid size-8 place-items-center rounded-md border'>
                  <RegistryIcon lucide={icon} className='size-4' />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <AuthForm
        title='Start your free trial'
        description='Set up takes about a minute.'
        mode='signup'
        submitLabel='Create account'
        emailLabel='Work email'
        emailPlaceholder='name@company.com'
        providers={[
          { id: 'google', label: 'Google', icon: <RegistryIcon lucide='Google' className='size-4' /> },
          { id: 'github', label: 'GitHub', icon: <RegistryIcon lucide='Github' className='size-4' /> }
        ]}
        dividerLabel='or sign up with email'
        onProvider={wait}
        onSubmit={wait}
        successMessage='Account created. Check your inbox to confirm your email.'
        footer={
          <p className='text-text-muted text-center text-sm'>
            Already have an account? <a href='#signin' className='text-text font-medium underline-offset-4 hover:underline'>Sign in</a>
          </p>
        }
      >
        <div className='flex items-start gap-2'>
          <Checkbox id='trial-terms' name='terms' required />
          <Label htmlFor='trial-terms' className='font-normal'>I agree to the Terms and the Data Processing Agreement.</Label>
        </div>
      </AuthForm>
    </Screen>
  );
}
