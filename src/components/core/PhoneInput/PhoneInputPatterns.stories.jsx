import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'phone-input',
  import.meta.glob('../../../../.storybook/fixtures/patterns/phone-input/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/phone-input/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/PhoneInput', tags: ['autodocs'], ...catalogueMeta('phone-input') };

export const PhoneInputPattern1 = { name: 'Basic', ...pattern(1) };
const phone = (canvasElement) => within(canvasElement).getByRole('textbox', { name: 'Phone number' });

export const PhoneInputPattern2 = {
  name: 'Small',
  ...pattern(2),
  play: async ({ canvasElement }) => {
    await userEvent.clear(phone(canvasElement));
    await userEvent.type(phone(canvasElement), '0687654321');
    await expect(phone(canvasElement).value.replace(/\D/g, '')).toBe('0687654321');
  }
};
export const PhoneInputPattern3 = { name: 'Large', ...pattern(3) };
export const PhoneInputPattern4 = { name: 'Disabled', ...pattern(4) };
export const PhoneInputPattern5 = { name: 'Preset value', ...pattern(5) };
export const PhoneInputPattern6 = {
  name: 'Error state',
  ...pattern(6, 'The country trigger and the number input both show the invalid state.'),
  play: async ({ canvasElement }) => {
    const input = phone(canvasElement);
    const trigger = canvasElement.querySelector('[data-slot="combobox-trigger"]');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Enter a valid phone number.');
    // Both halves share the destructive border.
    await expect(getComputedStyle(input).borderTopColor).toBe(getComputedStyle(trigger).borderTopColor);
  }
};
export const PhoneInputPattern7 = { name: 'Default country', ...pattern(7) };
export const PhoneInputPattern8 = { name: 'Read-only', ...pattern(8) };
