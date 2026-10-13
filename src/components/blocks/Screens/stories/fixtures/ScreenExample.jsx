import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import AuthForm from '@gaudi/design-system/blocks/AuthForm';
import Screen, { ScreenTestimonial } from '@gaudi/design-system/blocks/Screens';
import Link from '@gaudi/design-system/core/Link';

export const quotes = [
  { quote: 'We moved four newsletters into one workspace in an afternoon.', name: 'Maya Lopez', role: 'Editor in chief, Field Notes', avatar: '/avatars/person-20.svg' },
  { quote: 'Reviews happen in the margin now, and the history stays with the post.', name: 'Ansel Mwangi', role: 'Founder, The Long Read', avatar: '/avatars/person-41.svg' }
];

export const logos = ['Slack', 'Stripe', 'Supabase', 'Loom', 'Zoom', 'Dropbox'];

export const asides = {
  image: <img src='static/images/art/7.svg' alt='' className='size-full object-cover' />,
  testimonial: (
    <div className='grid h-full content-center p-10'>
      <ScreenTestimonial quotes={quotes} rating={4.8} />
    </div>
  ),
  logos: (
    <div className='grid h-full content-center gap-3 p-10'>
      <p className='text-text-muted text-xs font-medium'>Trusted by teams at</p>
      <ul className='grid grid-cols-3 gap-2 text-sm'>
        {logos.map((name) => <li key={name} className='bg-surface rounded-md border px-3 py-4 text-center'>{name}</li>)}
      </ul>
    </div>
  ),
  none: null
};

export const ScreenExample = ({ aside, header, footer, mode, onSubmit, ...args }) => (
    <Screen
      {...args}
      aside={asides[aside]}
      asideClassName={aside === 'image' ? undefined : 'bg-surface-muted'}
      header={header ? <span className='flex items-center gap-2 font-semibold'><GaudiBrand className='text-sm' /></span> : null}
      footer={footer ? <><span>© 2026 Gaudi</span><Link href='#privacy' variant='muted'>Privacy</Link></> : null}
    >
      <AuthForm
        key={mode}
        mode={mode}
        passwordMinLength={mode === 'signup' ? 8 : undefined}
        passwordHint={mode === 'signup' ? 'At least 8 characters.' : undefined}
        title={mode === 'signup' ? 'Create your account' : mode === 'email' ? 'Get a sign-in link' : 'Welcome back'}
        submitLabel={mode === 'signup' ? 'Create account' : mode === 'email' ? 'Email me a link' : 'Sign in'}
        successMessage={mode === 'email' ? 'Check your inbox for the link.' : mode === 'signup' ? 'Account created.' : 'Signed in.'}
        onSubmit={onSubmit}
      />
    </Screen>
  );
