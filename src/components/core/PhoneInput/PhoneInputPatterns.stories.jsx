import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'phone-input',
  import.meta.glob('../../../../.storybook/fixtures/patterns/phone-input/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/phone-input/*.jsx', { eager: true, query: '?raw', import: 'default' })
);


export default { title: 'Core/Inputs/PhoneInput', id: 'core-phoneinput', tags: ['autodocs'], ...catalogueMeta('phone-input') };

export const PhoneInputPattern1 = {
  name: 'Field states',
  ...pattern(1, 'An empty field with a preselected country, a read-only number, a disabled number, and an error where the country trigger and the input share the invalid border.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const empty = canvas.getByRole('textbox', { name: 'Phone number' });
    await userEvent.type(empty, '0687654321');
    await expect(empty.value.replace(/\D/g, '')).toBe('0687654321');
    const readOnly = canvas.getByRole('textbox', { name: 'Office line' });
    const saved = readOnly.value;
    await userEvent.type(readOnly, '9');
    await expect(readOnly).toHaveValue(saved);
    await expect(canvas.getByRole('textbox', { name: 'Fax' })).toBeDisabled();
    const invalid = canvas.getByRole('textbox', { name: 'Emergency contact' });
    const trigger = invalid.closest('.grid').querySelector('[data-slot="combobox-trigger"]');
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(invalid).toHaveAccessibleDescription('Enter a valid phone number.');
    // Both halves share the destructive border.
    await expect(getComputedStyle(invalid).borderTopColor).toBe(getComputedStyle(trigger).borderTopColor);
  }
};
