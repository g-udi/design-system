import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'checkbox',
  import.meta.glob('../../../../.storybook/fixtures/patterns/checkbox/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/checkbox/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Checkbox', tags: ['autodocs'], ...catalogueMeta('checkbox') };

export const CheckboxPattern1 = {
  name: 'States',
  ...pattern(1, 'Unchecked, checked with a description, indeterminate, disabled and invalid.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('checkbox', { name: 'Some files selected' })).toHaveAttribute('aria-checked', 'mixed');
    await expect(canvas.getByRole('checkbox', { name: 'Managed by your admin' })).toBeDisabled();
    await expect(canvas.getByRole('checkbox', { name: 'Confirm you are over 18' })).toHaveAttribute('aria-invalid', 'true');
    const basic = canvas.getByRole('checkbox', { name: 'Remember this device' });
    await userEvent.click(canvas.getByText('Remember this device'));
    await expect(basic).toHaveAttribute('aria-checked', 'true');
  }
};
export const CheckboxPattern22 = { name: 'Label extras and styles', ...pattern(22, 'A tooltip hint, New and Beta badges, a round to-do checkbox that strikes its label, and checked boxes in status colours.') };
export const CheckboxPattern10 = { name: 'Groups', ...pattern(10, 'Short options inline under a legend, and a framed stacked list where each row is one click target.') };
export const CheckboxPattern9 = { name: 'Row cards', ...pattern(9, 'Bordered rows with a leading checkbox and description, or a trailing checkbox beside a person.') };
export const CheckboxPattern14 = { name: 'Corner-check cards', ...pattern(14, 'Icon cards and a payment method with a round check in the corner, and compact tag chips.') };
export const CheckboxPattern16 = {
  name: 'Nested group',
  ...pattern(16, 'Parents check every child and show the indeterminate state when only some are checked.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const users = canvas.getByRole('checkbox', { name: 'User Management' });
    await expect(canvas.getByRole('checkbox', { name: 'Administration' })).toHaveAttribute('aria-checked', 'mixed');
    await expect(users).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Edit Users' }));
    await expect(users).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(users);
    await expect(canvas.getByRole('checkbox', { name: 'View Users' })).toHaveAttribute('aria-checked', 'false');
  }
};
