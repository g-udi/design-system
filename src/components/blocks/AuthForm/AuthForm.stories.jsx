import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import AuthForm from './AuthForm';

const docs = getComponentDocs('Blocks/Application/AuthForm');
const email = 'reader@example.com';
const signIn = async (canvas, { password = true } = {}) => {
  await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), email);
  if (password) await userEvent.type(canvas.getByLabelText('Password'), 'example-password');
};

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
    passwordLabel: 'text',
    successMessage: 'text',
    errorMessage: 'text'
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
    title: 'Sign in',
    description: 'Continue to your writing workspace.',
    submitLabel: 'Sign in',
    successMessage: 'Signed in within this example.',
    onSubmit: fn(async () => {})
  },
  parameters: {
    docs: { source: playgroundSource('AuthForm', { imports: "import { AuthForm } from '@gaudi/design-system';" }) }
  },
  render: (args) => <AuthForm {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await signIn(canvas, { password: args.mode === 'password' });
    await userEvent.click(canvas.getByRole('button', { name: args.submitLabel }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email }));
    await expect(await canvas.findByRole('status')).toHaveTextContent(args.successMessage);
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
