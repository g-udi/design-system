import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'field', import.meta.url,
  import.meta.glob('./fixtures/field/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/field/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Field', id: 'core-field', tags: ['autodocs'], ...catalogueMeta('field') };

export const SettingsValidation = {
  name: 'Preferences form that checks itself', ...pattern('settings-validation'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slug = canvas.getByRole('textbox', { name: 'URL Slug' });
    await expect(slug).toHaveAttribute('aria-invalid', 'true');
    await expect(slug).toHaveAccessibleDescription('Slug can only contain lowercase letters, numbers, and hyphens.');
    const bio = canvas.getByRole('textbox', { name: 'Bio' });
    await expect(canvas.getByText(`${bio.value.length}/160`)).toBeVisible();
    await userEvent.clear(slug);
    await userEvent.type(slug, 'alex-johnson');
    await expect(slug).not.toHaveAttribute('aria-invalid');
    await userEvent.click(canvas.getByRole('button', { name: 'Save Changes' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Changes saved in this demo.');
  }
};
export const Controls = {
  name: 'Controls in fields', ...pattern('controls', 'Label, control and description around input groups, selects, a slider, an OTP input and a textarea.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const message = canvas.getByRole('textbox', { name: 'Message' });
    const labelStyle = getComputedStyle(message.labels[0]);
    await expect(parseFloat(labelStyle.lineHeight) / parseFloat(labelStyle.fontSize)).toBeCloseTo(1.375, 2);
    await userEvent.type(message, 'Please review my account.');
    await expect(canvas.getByText(`${message.value.length}/500`)).toBeVisible();
  }
};
export const Fieldsets = { name: 'Fieldsets of choices', ...pattern('fieldsets', 'Legends group switches, checkboxes with a disabled option, and a radio group, split by separators.') };
export const Errors = {
  name: 'Validation errors', ...pattern('errors', 'Single and multiple error messages connected to their invalid fields. Correcting the values enables a local demo submission.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByRole('textbox', { name: /Email/ });
    const password = canvas.getByLabelText('Password *');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription('Please enter a valid email address.');
    await expect(password).toHaveAccessibleDescription('Must be at least 8 characters. Must contain at least one number.');
    await userEvent.clear(email);
    await userEvent.type(email, 'ada@example.com');
    await userEvent.clear(password);
    await userEvent.type(password, 'example123');
    await userEvent.type(canvas.getByLabelText('Confirm Password'), 'example123');
    await expect(email).not.toHaveAttribute('aria-invalid');
    await expect(password).not.toHaveAttribute('aria-invalid');
    await userEvent.click(canvas.getByRole('button', { name: 'Create Account' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Account details validated in this demo.');
  }
};
export const Responsive = {
  name: 'Fields that reflow by width', ...pattern('responsive', 'Labels sit beside their controls on wide screens and stack on narrow ones. The invitation is validated locally; Cancel clears its draft.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'First Name' }), 'Ada');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Last Name' }), 'Lovelace');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email', exact: true }), 'ada@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Send Invite' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Invitation for ada@example.com prepared in this demo.');
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByRole('textbox', { name: 'First Name' })).toHaveValue('');
    await expect(canvas.getByRole('textbox', { name: 'Email', exact: true })).toHaveValue('');
    await expect(canvas.getByRole('status')).toHaveTextContent('Invitation cleared.');
  }
};
