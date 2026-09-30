import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'input',
  import.meta.glob('../../../../.storybook/fixtures/patterns/input/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/input/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Inputs/Input', id: 'core-input', tags: ['autodocs'], ...catalogueMeta('input') };

export const InputPattern1 = { name: 'Input types', ...pattern(1, 'Native types side by side: text, email, password, phone, URL, number, date, time, file, colour and range.') };
export const InputPattern3 = {
  name: 'Labels and messages',
  ...pattern(3, 'A tooltip hint with a description, a live character counter, New and Optional badges, a horizontal label, and several error messages at once.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Description' }), 'Docs');
    await expect(canvas.getByText('4/50')).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Security code' })).toHaveAttribute('aria-invalid', 'true');
  }
};
export const InputPattern23 = {
  name: 'Password with strength meter',
  ...pattern(23, 'A visibility toggle, a forgot-password link, and a segmented strength meter with a requirement checklist.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password', { selector: 'input' });
    await userEvent.type(input, 'Gaudi2026!');
    await expect(canvas.getByRole('progressbar', { name: 'Password strength' })).toHaveAttribute('aria-valuenow', '5');
    await expect(canvas.getByText('Strong security')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(input).toHaveAttribute('type', 'text');
  }
};
export const InputPattern26 = { name: 'Style variants', ...pattern(26, 'Subtle fill, bottom border only, pill, a custom focus ring, borderless, and a pulsing fill that stops on focus.') };
