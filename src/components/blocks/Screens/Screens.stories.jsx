import { expect, fn, userEvent, within } from 'storybook/test';
import { getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { previewSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import AuthForm from '../AuthForm';
import Icon from '../../core/Icon';
import Screen, { ScreenTestimonial } from './Screen';

const docs = getComponentDocs('Blocks/Screens');
const quotes = [
  { quote: 'We moved four newsletters into one workspace in an afternoon.', name: 'Maya Lopez', role: 'Editor in chief, Field Notes', avatar: '/avatars/women/44.jpg' },
  { quote: 'Reviews happen in the margin now, and the history stays with the post.', name: 'Daniel Okafor', role: 'Founder, The Long Read', avatar: '/avatars/men/32.jpg' }
];
const logos = ['Slack', 'Stripe', 'Supabase', 'Loom', 'Zoom', 'Dropbox'];
const asides = {
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
const asideSource = {
  image: `<img src='/images/cover.jpg' alt='' className='size-full object-cover' />`,
  testimonial: `<ScreenTestimonial quotes={quotes} rating={4.8} className='p-10' />`,
  logos: `<CustomerLogos />`
};

export default {
  title: 'Blocks/Auth',
  id: 'blocks-application-authform',
  component: Screen,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    aside: Object.keys(asides),
    asideSide: ['end', 'start'],
    header: 'boolean',
    footer: 'boolean',
    mode: ['password', 'email', 'signup']
  }),
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const ScreenFrame = {
  name: 'Screen frame',
  args: {
    aside: 'testimonial',
    asideSide: 'end',
    header: true,
    footer: true,
    mode: 'password',
    onSubmit: fn()
  },
  argTypes: { onSubmit: { table: { disable: true } } },
  parameters: {
    docs: {
      description: {
        story: 'A sign-in screen: the AuthForm in the main column beside an `aside` of imagery, customer quotes or logos. `asideSide` moves the aside to the start or end from md up; below md it hides so the form comes first. `header` and `footer` add bands for the logo, account links and legal links. `mode` switches the form between password, email link and sign-up.'
      },
      source: {
        type: 'dynamic',
        language: 'jsx',
        // Slots print as named placeholders; only the scalar args serialize.
        transform: (_source, { args }) =>
          previewSource('Screen', { asideSide: args.asideSide === 'start' ? 'start' : undefined }, {
            imports: `import { AuthForm } from '@gaudi/design-system/blocks/AuthForm';\nimport { Screen, ScreenTestimonial } from '@gaudi/design-system/blocks/Screens';`,
            attributes: [
              ...(args.aside === 'none' ? [] : [`aside={${asideSource[args.aside]}}`]),
              ...(args.header ? ['header={<Logo />}'] : []),
              ...(args.footer ? ['footer={<LegalLinks />}'] : [])
            ],
            children: `  <AuthForm mode='${args.mode}' onSubmit={signIn} />`
          })
      }
    }
  },
  render: ({ aside, header, footer, mode, onSubmit, ...args }) => (
    <Screen
      {...args}
      aside={asides[aside]}
      asideClassName={aside === 'image' ? undefined : 'bg-surface-muted'}
      header={header ? <span className='flex items-center gap-2 font-semibold'><Icon name='BookOpen' decorative size='sm' />Gaudi</span> : null}
      footer={footer ? <><span>© 2026 Gaudi</span><a href='#privacy' className='hover:text-text underline-offset-4 hover:underline'>Privacy</a></> : null}
    >
      <AuthForm
        key={mode}
        mode={mode}
        title={mode === 'signup' ? 'Create your account' : mode === 'email' ? 'Get a sign-in link' : 'Welcome back'}
        submitLabel={mode === 'signup' ? 'Create account' : mode === 'email' ? 'Email me a link' : 'Sign in'}
        successMessage={mode === 'email' ? 'Check your inbox for the link.' : mode === 'signup' ? 'Account created.' : 'Signed in.'}
        onSubmit={onSubmit}
      />
    </Screen>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    // The form leads the reading order whichever side the aside sits on.
    const screen = canvasElement.querySelector('[data-slot=screen]');
    await expect(screen.firstElementChild).toContainElement(canvas.getByRole('form'));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), 'maya@fieldnotes.app');
    if (args.mode === 'signup') await userEvent.type(canvas.getByRole('textbox', { name: 'Full name' }), 'Maya Lopez');
    if (args.mode !== 'email') await userEvent.type(canvas.getByLabelText('Password'), 'correct horse battery');
    await userEvent.click(canvas.getByRole('button', { name: /Sign in|Email me a link|Create account/ }));
    await expect(args.onSubmit).toHaveBeenCalledOnce();
  }
};
