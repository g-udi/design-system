'use client';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { default as AuthForm } from '@gaudi/design-system/blocks/AuthForm';
import { Screen, ScreenTestimonial } from '@gaudi/design-system/blocks/Screens';
import { Frame, FramePanel } from '@gaudi/design-system/core/Card';
import { Discord } from '@gaudi/design-system/icons/brands/discord';
import { Dropbox } from '@gaudi/design-system/icons/brands/dropbox';
import { Loom } from '@gaudi/design-system/icons/brands/loom';
import { Redis } from '@gaudi/design-system/icons/brands/redis';
import { Slack } from '@gaudi/design-system/icons/brands/slack';
import { Stripe } from '@gaudi/design-system/icons/brands/stripe';
import { Supabase } from '@gaudi/design-system/icons/brands/supabase';
import { Zoom } from '@gaudi/design-system/icons/brands/zoom';

const wait = () => new Promise((resolve) => setTimeout(resolve, 600));
const logos = [['Slack', Slack], ['Stripe', Stripe], ['Supabase', Supabase], ['Zoom', Zoom], ['Dropbox', Dropbox], ['Loom', Loom], ['Discord', Discord], ['Redis', Redis]];
const quotes = [
  { quote: 'No passwords to reset means our support queue lost a third of its tickets overnight.', name: 'Priya Natarajan', role: 'Support lead, Ledger', avatar: '/avatars/person-07.svg' },
  { quote: 'The sign-in link arrives before I have switched tabs.', name: 'Tom Becker', role: 'Engineer, Northwind', avatar: '/avatars/person-38.svg' }
];

export function Pattern() {
  return (
    <Screen
      className='max-w-5xl'
      asideClassName='bg-surface-muted'
      aside={
        <div className='grid h-full content-center gap-8 p-10'>
          <Frame>
            <FramePanel className='p-6'>
              <ScreenTestimonial quotes={quotes} interval={7000} />
            </FramePanel>
          </Frame>
          <div className='grid gap-3'>
            <p className='text-text-muted text-xs font-medium'>Trusted by teams at</p>
            <ul aria-label='Customers' className='grid grid-cols-4 gap-2'>
              {logos.map(([name, Logo]) => (
                <li key={name} className='bg-surface grid aspect-[3/2] place-items-center rounded-md border'>
                  <Logo className='size-6' aria-hidden='true' />
                  <span className='sr-only'>{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
      header={<span className='flex items-center gap-2 font-semibold'><GaudiBrand className='text-sm' /></span>}
    >
      <Frame>
        <FramePanel className='p-6'>
          <AuthForm
            title='Sign in without a password'
            description='Enter your work email and we send you a link that signs you in on this device.'
            mode='email'
            submitLabel='Send sign-in link'
            emailLabel='Work email'
            emailPlaceholder='name@company.com'
            onSubmit={wait}
            successMessage='Link sent. It works once and expires in 15 minutes.'
          />
        </FramePanel>
      </Frame>
    </Screen>
  );
}
