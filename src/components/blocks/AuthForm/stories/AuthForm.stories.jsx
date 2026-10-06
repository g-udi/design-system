import { previewSource } from '../../../../docs/components/previewSource.js';
import { AuthFooter } from './fixtures/AuthFooter.jsx';
import AuthFooterSource from './fixtures/AuthFooter.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import Link from '../../../core/Link';

import AuthForm from '../AuthForm';

const docs = getComponentDocs('Blocks/Auth');
const email = 'reader@example.com';
const signIn = async (canvas) => {
  await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), email);
  await userEvent.type(canvas.getByLabelText('Password'), 'example-password');
};

const successMessage = 'Signed in within this example.';

// Alternatives and recovery links around the form; the reset link only applies to password mode.

export default {
  title: 'Blocks/Auth', id: 'blocks-application-authform',
  component: AuthForm,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    mode: ['password', 'email', 'signup'],
    title: 'text',
    description: 'text',
    submitLabel: 'text',
    emailLabel: 'text',
    passwordLabel: 'text',
    emailPlaceholder: 'text',
    passwordPlaceholder: 'text',
    pendingLabel: 'text',
    passwordMinLength: 'number'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    mode: 'password',
    title: 'Welcome back',
    description: 'Sign in to continue to your writing workspace.',
    submitLabel: 'Sign in',
    emailLabel: 'Work email',
    passwordLabel: 'Password',
    onSubmit: fn(async () => {})
  },
  parameters: {
    docs: {
      description: { story: 'A complete sign-in screen: credentials, a reset link, social and passkey alternatives, and a sign-up prompt. Switch `mode` to `email` for a magic-link form without the password field or reset link, or to `signup` for a name, email and new password. The eye button reveals the password.' },
      source: { type: 'dynamic', language: 'jsx', transform: (_source, { args }) => previewSource('AuthForm', args, { imports: "import AuthForm from '@gaudi/design-system/blocks/AuthForm';\n" + publicSource(AuthFooterSource, new URL('./fixtures/AuthFooter.jsx', import.meta.url)), attributes: ["passwordMinLength={" + (args.mode === 'signup' ? 8 : 'undefined') + "}", "passwordHint={" + (args.mode === 'signup' ? JSON.stringify('At least 8 characters.') : 'undefined') + "}", "successMessage=" + JSON.stringify(successMessage), 'onSubmit={async () => { /* Simulated successful sign-in. */ }}', 'footer={<AuthFooter mode=' + JSON.stringify(args.mode) + ' />}'] }) }
    }
  },
  render: (args) => <AuthForm passwordMinLength={args.mode === 'signup' ? 8 : undefined} passwordHint={args.mode === 'signup' ? 'At least 8 characters.' : undefined} successMessage={successMessage} footer={<AuthFooter mode={args.mode} />} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: args.emailLabel })).toBeVisible();
    const password = args.mode !== 'email';
    if (args.mode === 'password') await expect(canvas.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
    if (!password) await expect(canvas.queryByLabelText(args.passwordLabel)).not.toBeInTheDocument();
    if (args.mode === 'signup') await userEvent.type(canvas.getByRole('textbox', { name: 'Full name' }), 'Maya Lopez');
    await userEvent.type(canvas.getByRole('textbox', { name: args.emailLabel }), email);
    if (password) {
      await userEvent.type(canvas.getByLabelText(args.passwordLabel), 'example-password');
      // The reveal button turns the field into plain text without losing the value.
      await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
      await expect(canvas.getByRole('textbox', { name: args.passwordLabel })).toHaveValue('example-password');
    }
    await userEvent.click(canvas.getByRole('button', { name: args.submitLabel }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email }));
    await expect(await canvas.findByRole('status')).toHaveTextContent(successMessage);
    await userEvent.click(canvas.getByRole('button', { name: 'GitHub', exact: true }));
    await expect(canvas.getByRole('status', { name: 'Alternative sign-in' })).toHaveTextContent('GitHub sign-in is not connected');
    await userEvent.click(canvas.getByRole('button', { name: 'Passkey', exact: true }));
    await expect(canvas.getByRole('status', { name: 'Alternative sign-in' })).toHaveTextContent('Passkey sign-in is not connected');
  }
};

export const FailedSignIn = {
  parameters: { docs: { description: { story: 'A rejected `onSubmit` announces the error and keeps the typed values for a retry.' } } },
  render: () => (
    <AuthForm
      onSubmit={async () => {
        throw new Error('Simulated failure');
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await signIn(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Sign-in failed');
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveValue(email);
  }
};

// A short simulated request so the pending label is visible in the example.
const requestReset = () => new Promise((resolve) => setTimeout(resolve, 800));

export const ForgotPassword = {
  parameters: {
    docs: {
      description: {
        story:
          'The same recipe as a reset request: `mode=\'email\'` with its own `submitLabel`, a `pendingLabel` shown while the request runs, an `emailPlaceholder`, and a neutral success message that does not reveal whether the address has an account.'
      },
      source: { language: 'jsx', code: "import AuthForm from '@gaudi/design-system/blocks/AuthForm';\n// Simulate a request; replace this callback with the host's reset service.\nconst requestReset = () => new Promise((resolve) => setTimeout(resolve, 800));\n<AuthForm title='Reset your password' description='We will email you a link to choose a new password.' mode='email' submitLabel='Send reset link' pendingLabel='Sending…' emailPlaceholder='you@example.com' successMessage='If that address has an account, a reset link is on its way.' onSubmit={requestReset} />" }
    }
  },
  render: () => (
    <AuthForm
      title='Reset your password'
      description='We will email you a link to choose a new password.'
      mode='email'
      submitLabel='Send reset link'
      pendingLabel='Sending…'
      emailPlaceholder='you@example.com'
      successMessage='If that address has an account, a reset link is on its way.'
      onSubmit={requestReset}
      footer={<Link href='#sign-in' variant='muted' className='text-sm'>Back to sign in</Link>}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox', { name: 'Email' });
    await expect(field).toHaveAttribute('placeholder', 'you@example.com');
    await userEvent.type(field, email);
    await userEvent.click(canvas.getByRole('button', { name: 'Send reset link' }));
    await expect(await canvas.findByRole('button', { name: 'Sending…' })).toBeDisabled();
    await expect(await canvas.findByRole('status')).toHaveTextContent('reset link is on its way');
    await expect(canvas.getByRole('button', { name: 'Send reset link' })).toBeEnabled();
  }
};

export const PasswordHintAndPlaceholders = {
  parameters: {
    docs: {
      description: {
        story:
          '`passwordHint` replaces the generic help text under the password, or hides it with `false` when the screen already explains itself. `emailPlaceholder` and `passwordPlaceholder` add example text; labels stay visible either way.'
      },
      source: { language: 'jsx', code: "import AuthForm from '@gaudi/design-system/blocks/AuthForm';\nconst signIn = async () => { /* Simulated success; the host supplies authentication. */ };\n<div className='grid gap-8'>\n  <AuthForm title='Sign in with a custom hint' emailPlaceholder='you@example.com' passwordPlaceholder='Your password' passwordMinLength={12} passwordHint='At least 12 characters.' onSubmit={signIn} />\n  <AuthForm title='Sign in without a hint' passwordHint={false} onSubmit={signIn} />\n</div>" }
    }
  },
  render: () => (
    <div className='grid gap-8'>
      <AuthForm
        title='Sign in with a custom hint'
        emailPlaceholder='you@example.com'
        passwordPlaceholder='Your password'
        passwordMinLength={12}
        passwordHint='At least 12 characters.'
        onSubmit={async () => {}}
      />
      <AuthForm title='Sign in without a hint' passwordHint={false} onSubmit={async () => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [custom, hidden] = canvas.getAllByRole('form');
    await expect(within(custom).getByText('At least 12 characters.')).toBeVisible();
    await expect(within(custom).getByLabelText('Password')).toHaveAttribute('placeholder', 'Your password');
    await expect(within(hidden).queryByText(/password for your account/)).not.toBeInTheDocument();
  }
};
