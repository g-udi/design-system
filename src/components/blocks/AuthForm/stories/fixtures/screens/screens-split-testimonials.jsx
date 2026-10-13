'use client';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { default as AuthForm } from '@gaudi/design-system/blocks/AuthForm';
import { Screen, ScreenTestimonial } from '@gaudi/design-system/blocks/Screens';
import Link from '@gaudi/design-system/core/Link';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const wait = () => new Promise((resolve) => setTimeout(resolve, 500));
const quotes = [
  { quote: 'We moved four newsletters into one workspace in an afternoon. Our editors stopped asking where drafts live.', name: 'Maya Lopez', role: 'Editor in chief, Field Notes', avatar: '/avatars/person-20.svg' },
  { quote: 'Reviews used to take a week of email. Now they happen in the margin, and the history stays with the post.', name: 'Ansel Mwangi', role: 'Founder, The Long Read', avatar: '/avatars/person-41.svg' },
  { quote: 'Our readers noticed the faster pages before we told them anything had changed.', name: 'Sofia Brandt', role: 'Head of product, Kiln', avatar: '/avatars/person-24.svg' }
];
// Dots drawn from the border token behind the quote.
const dotBackdrop = 'bg-[radial-gradient(var(--ds-color-border)_1px,transparent_1px)] bg-[size:1rem_1rem]';

export function Pattern() {
  return (
    <Screen
      className='max-w-5xl'
      asideSide='start'
      asideClassName={`bg-surface-muted ${dotBackdrop}`}
      aside={
        <div className='flex h-full flex-col justify-between gap-8 p-10'>
          <span className='flex items-center gap-2 font-semibold'>
            <GaudiBrand className='text-sm' />
          </span>
          <ScreenTestimonial quotes={quotes} rating={4.8} />
          <p className='text-text-muted text-xs'>Rated 4.8 out of 5 by 2,140 writers</p>
        </div>
      }
    >
      <AuthForm
        title='Welcome back'
        description='Sign in to keep writing.'
        emailPlaceholder='you@example.com'
        passwordHint={false}
        passwordAction={<Link href='#reset' variant='muted' className='text-xs'>Forgot password?</Link>}
        providers={[
          { id: 'google', label: 'Google', icon: <RegistryIcon lucide='Google' className='size-4' /> },
          { id: 'github', label: 'GitHub', icon: <RegistryIcon lucide='Github' className='size-4' /> }
        ]}
        dividerLabel='or with your email'
        onProvider={wait}
        onSubmit={wait}
        successMessage='Signed in. Opening your drafts…'
        footer={
          <p className='text-text-muted text-center text-sm'>
            New to Gaudi? <Link href='#signup'>Create an account</Link>
          </p>
        }
      />
    </Screen>
  );
}
