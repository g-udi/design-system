import { expect, userEvent, within } from 'storybook/test';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import AuthForm from './AuthForm';
export default {
  tags: ['autodocs'],
  title: 'Blocks/Application/AuthForm',
  component: AuthForm,
  ...applicationDocs(
    'Password and email-link form recipes with native validation, pending state and recoverable errors. onSubmit receives form values. Applications own providers, credentials, sessions and navigation.',
    "<AuthForm title='Sign in' description='Continue to your writing workspace.' onSubmit={signIn} />",
    'Every input has a visible label and autocomplete purpose. Submitting disables the fields, announces errors and preserves typed values for retry.'
  )
};
export const Password = {
  render: () => (
    <ExampleFrame>
      <AuthForm
        description='Continue to your writing workspace.'
        onSubmit={async () => {}}
        successMessage='Signed in within this example.'
      />
    </ExampleFrame>
  )
};
export const EmailLink = {
  render: () => (
    <ExampleFrame>
      <AuthForm
        mode='email'
        title='Sign in with email'
        description='We will send you a sign-in link.'
        submitLabel='Send sign-in link'
        onSubmit={async () => {}}
      />
    </ExampleFrame>
  )
};
export const FailedSignIn = {
  render: () => (
    <ExampleFrame>
      <AuthForm
        onSubmit={async () => {
          throw new Error('Simulated failure');
        }}
      />
    </ExampleFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Email' }),
      'reader@example.com'
    );
    await userEvent.type(canvas.getByLabelText('Password'), 'example-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Sign-in failed'
    );
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveValue(
      'reader@example.com'
    );
  }
};
