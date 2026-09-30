import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { Separator } from '../../core/Separator';
import AuthForm from './AuthForm';

const docs = getComponentDocs('Blocks/Application/AuthForm');
const email = 'reader@example.com';
const signIn = async (canvas, { password = true } = {}) => {
  await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), email);
  if (password) await userEvent.type(canvas.getByLabelText('Password'), 'example-password');
};

const successMessage = 'Signed in within this example.';

// Alternatives and recovery links around the form; the reset link only applies to password mode.
function AuthFooter({ mode }) {
  return (
    <div className='grid gap-4'>
      {mode === 'password' ? (
        <Link href='#reset' variant='muted' className='justify-self-end text-sm'>Forgot password?</Link>
      ) : null}
      <div className='text-text-muted flex items-center gap-3 text-xs'>
        <Separator className='flex-1' />
        or continue with
        <Separator className='flex-1' />
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <Button type='button' variant='outline' tone='neutral'>
          <Icon name='Github' decorative size='sm' />
          GitHub
        </Button>
        <Button type='button' variant='outline' tone='neutral'>
          <Icon name='KeyRound' decorative size='sm' />
          Passkey
        </Button>
      </div>
      <p className='ds-description text-center'>
        New here? <Link href='#sign-up' tone='blue'>Create an account</Link>
      </p>
    </div>
  );
}

export default {
  title: 'Blocks/Application/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    mode: ['password', 'email'],
    title: 'text',
    description: 'text',
    submitLabel: 'text',
    emailLabel: 'text',
    passwordLabel: 'text'
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
      description: { story: 'A complete sign-in screen: credentials, a reset link, social and passkey alternatives, and a sign-up prompt. Switch `mode` to `email` for a magic-link form without the password field or reset link.' },
      source: playgroundSource('AuthForm', {
        imports: "import { AuthForm } from '@gaudi/design-system';",
        attributes: [`successMessage='${successMessage}'`, 'onSubmit={signIn}', 'footer={<AuthFooter />}']
      })
    }
  },
  render: (args) => <AuthForm successMessage={successMessage} footer={<AuthFooter mode={args.mode} />} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: args.emailLabel })).toBeVisible();
    const password = args.mode === 'password';
    if (password) await expect(canvas.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
    else await expect(canvas.queryByLabelText(args.passwordLabel)).not.toBeInTheDocument();
    await userEvent.type(canvas.getByRole('textbox', { name: args.emailLabel }), email);
    if (password) await userEvent.type(canvas.getByLabelText(args.passwordLabel), 'example-password');
    await userEvent.click(canvas.getByRole('button', { name: args.submitLabel }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email }));
    await expect(await canvas.findByRole('status')).toHaveTextContent(successMessage);
  }
};

export const EmailLink = {
  args: { onSubmit: fn(async () => {}) },
  parameters: { docs: { description: { story: 'Any mode other than `password` drops the password field and submits the email alone, for magic-link flows.' } } },
  render: ({ onSubmit }) => (
    <AuthForm
      mode='email'
      title='Sign in with email'
      description='We will send you a sign-in link.'
      submitLabel='Send sign-in link'
      onSubmit={onSubmit}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByLabelText('Password')).not.toBeInTheDocument();
    await signIn(canvas, { password: false });
    await userEvent.click(canvas.getByRole('button', { name: 'Send sign-in link' }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email }));
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
