'use client';
import { default as AuthForm } from '../../../../src/components/blocks/AuthForm/index.js';
import { Screen, ScreenTestimonial } from '../../../../src/components/blocks/Screens/Screen.jsx';
import { Frame, FramePanel } from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { Discord } from '../../../../src/icons/brands/discord.jsx';
import { Dropbox } from '../../../../src/icons/brands/dropbox.jsx';
import { Loom } from '../../../../src/icons/brands/loom.jsx';
import { Redis } from '../../../../src/icons/brands/redis.jsx';
import { Slack } from '../../../../src/icons/brands/slack.jsx';
import { Stripe } from '../../../../src/icons/brands/stripe.jsx';
import { Supabase } from '../../../../src/icons/brands/supabase.jsx';
import { Zoom } from '../../../../src/icons/brands/zoom.jsx';

const wait = () => new Promise((resolve) => setTimeout(resolve, 600));
const logos = [['Slack', Slack], ['Stripe', Stripe], ['Supabase', Supabase], ['Zoom', Zoom], ['Dropbox', Dropbox], ['Loom', Loom], ['Discord', Discord], ['Redis', Redis]];
const quotes = [
  { quote: 'No passwords to reset means our support queue lost a third of its tickets overnight.', name: 'Priya Natarajan', role: 'Support lead, Ledger', avatar: '/avatars/women/12.jpg' },
  { quote: 'The sign-in link arrives before I have switched tabs.', name: 'Tom Becker', role: 'Engineer, Northwind', avatar: '/avatars/men/22.jpg' }
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
      header={<span className='flex items-center gap-2 font-semibold'><RegistryIcon lucide='MailIcon' className='size-5' />Gaudi</span>}
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
