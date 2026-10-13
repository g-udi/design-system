'use client';
import { default as AuthForm } from '@gaudi/design-system/blocks/AuthForm';
import { Screen } from '@gaudi/design-system/blocks/Screens';
import { Badge } from '@gaudi/design-system/core/Pill';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import { Label } from '@gaudi/design-system/core/Field';
import Link from '@gaudi/design-system/core/Link';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

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
        passwordMinLength={8}
        passwordHint='At least 8 characters.'
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
            Already have an account? <Link href='#signin'>Sign in</Link>
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
