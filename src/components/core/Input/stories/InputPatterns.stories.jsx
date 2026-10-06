import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'input', import.meta.url,
  import.meta.glob('./fixtures/input/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/input/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Input', id: 'core-input', tags: ['autodocs'], ...catalogueMeta('input') };

export const Types = { name: 'Input types', ...pattern('types', 'Text, EmailInput and NumberField alongside password, phone, URL and browser-managed date, time, file, colour and range controls.') };
export const LabelsMessages = {
  name: 'Labels and messages',
  ...pattern('labels-messages', 'A tooltip hint with a description, a live character counter, New and Optional badges, a horizontal label, and several error messages at once.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Description' }), 'Docs');
    await expect(canvas.getByText('4/50')).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Security code' })).toHaveAttribute('aria-invalid', 'true');
  }
};
export const PasswordStrength = {
  name: 'Password with strength meter',
  ...pattern('password-strength', 'A visibility toggle, a forgot-password link, and a segmented strength meter with a requirement checklist.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password', { selector: 'input' });
    await userEvent.type(input, 'Gaudi2026!');
    await expect(canvas.getByRole('progressbar', { name: 'Password strength' })).toHaveAttribute('aria-valuenow', '5');
    await expect(canvas.getByText('Strong security')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(input).toHaveAttribute('type', 'text');
    await expect(canvas.getByRole('button', { name: 'Hide password' })).toHaveAttribute('data-slot', 'button');
    await expect(canvas.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '/forgot-password');
  }
};
export const StyleVariants = { name: 'Style variants', ...pattern('style-variants', 'Subtle fill, bottom border only, pill, a custom focus ring, borderless, and a pulsing fill that stops on focus.') };
