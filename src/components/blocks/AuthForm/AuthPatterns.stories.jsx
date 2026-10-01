import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'screens',
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Auth', id: 'blocks-application-authform', tags: ['autodocs'], ...catalogueMeta('screens') };

export const ScreensPattern20 = {
  name: 'Split with imagery',
  ...pattern(20, 'Sign in by password or email link beside stacked editorial images, over a faint grid; the image moves to either side.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Email link' }));
    await expect(canvas.queryByLabelText('Password')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Email me a link' })).toBeVisible();
  }
};
export const ScreensPattern21 = {
  name: 'Split with testimonials',
  ...pattern(21, 'Social sign-in and a password with a reveal toggle, beside rotating customer quotes and a rating over a dot backdrop.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Password'), 'correct horse');
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(canvas.getByLabelText('Password')).toHaveAttribute('type', 'text');
    await userEvent.click(canvas.getByRole('button', { name: 'GitHub' }));
    await expect(await canvas.findByRole('button', { name: 'GitHub' })).toBeEnabled();
  }
};
export const ScreensPattern22 = {
  name: 'Magic link with logos',
  ...pattern(22, 'Passwordless sign-in in a frame, beside a framed rotating testimonial and a customer logo wall.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Work email' }), 'priya@ledger.app');
    await userEvent.click(canvas.getByRole('button', { name: 'Send sign-in link' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Link sent');
  }
};
export const ScreensPattern23 = {
  name: 'Centred card',
  ...pattern(23, 'A centred card over a plain or softened photo backdrop: email or username, stacked Google and Apple buttons, keep me signed in and a legal footer.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Email or username' })).toHaveAttribute('autocomplete', 'username');
    await userEvent.click(canvas.getByRole('radio', { name: 'Plain' }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Email link' }));
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveAttribute('type', 'email');
  }
};
export const ScreensPattern24 = {
  name: 'Free trial sign-up',
  ...pattern(24, 'Sign up with Google, GitHub or a work email beside the trial perks over soft colour fields.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Full name' })).toBeVisible();
    await expect(canvas.getByLabelText('Password')).toHaveAttribute('minlength', '8');
  }
};
export const ScreensPattern25 = {
  name: 'Choose a sign-in method',
  ...pattern(25, 'A full page with an app header and customer logos: passkey, SAML single sign-on with a backup-code fallback, or an email link with Google and GitHub.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Single sign-on (SAML)' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Lost access? Use a backup code' }));
    await expect(canvas.getByRole('button', { name: 'Verify code' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'All sign-in options' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue with email' }));
    await expect(canvas.getByRole('button', { name: 'Google' })).toBeVisible();
  }
};
