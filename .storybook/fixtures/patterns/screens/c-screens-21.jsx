'use client';
import { default as AuthForm } from '../../../../src/components/blocks/AuthForm/index.js';
import { Screen, ScreenTestimonial } from '../../../../src/components/blocks/Screens/Screen.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const wait = () => new Promise((resolve) => setTimeout(resolve, 500));
const quotes = [
  { quote: 'We moved four newsletters into one workspace in an afternoon. Our editors stopped asking where drafts live.', name: 'Maya Lopez', role: 'Editor in chief, Field Notes', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { quote: 'Reviews used to take a week of email. Now they happen in the margin, and the history stays with the post.', name: 'Daniel Okafor', role: 'Founder, The Long Read', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { quote: 'Our readers noticed the faster pages before we told them anything had changed.', name: 'Sofia Brandt', role: 'Head of product, Kiln', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }
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
            <RegistryIcon lucide='PencilIcon' className='size-5' />
            Gaudi
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
        passwordAction={<a href='#reset' className='text-text-muted text-xs underline-offset-4 hover:underline'>Forgot password?</a>}
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
            New to Gaudi? <a href='#signup' className='text-text font-medium underline-offset-4 hover:underline'>Create an account</a>
          </p>
        }
      />
    </Screen>
  );
}
