// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'phone-input',
  import.meta.glob('../../../../.storybook/fixtures/reui/phone-input/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/phone-input/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/PhoneInput', tags: ['autodocs'], ...catalogueMeta('phone-input') };

export const ReuiPhoneInput1 = { name: 'Basic', ...pattern(1) };
const phone = (canvasElement) => within(canvasElement).getByRole('textbox', { name: 'Phone number' });

export const ReuiPhoneInput2 = {
  name: 'Small',
  ...pattern(2),
  play: async ({ canvasElement }) => {
    await userEvent.clear(phone(canvasElement));
    await userEvent.type(phone(canvasElement), '0687654321');
    await expect(phone(canvasElement).value.replace(/\D/g, '')).toBe('0687654321');
  }
};
export const ReuiPhoneInput3 = { name: 'Large', ...pattern(3) };
export const ReuiPhoneInput4 = { name: 'Disabled', ...pattern(4) };
export const ReuiPhoneInput5 = { name: 'Preset value', ...pattern(5) };
export const ReuiPhoneInput6 = {
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
export const ReuiPhoneInput7 = { name: 'Default country', ...pattern(7) };
export const ReuiPhoneInput8 = { name: 'Read-only', ...pattern(8) };
