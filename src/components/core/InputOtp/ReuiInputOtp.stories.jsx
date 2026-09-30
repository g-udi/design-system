// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = reuiPatterns(
  'input-otp',
  import.meta.glob('../../../../.storybook/fixtures/reui/input-otp/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/input-otp/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/InputOtp', tags: ['autodocs'], ...catalogueMeta('input-otp') };

export const ReuiInputOtp1 = { name: 'Grouped slots', ...pattern(1) };
export const ReuiInputOtp2 = {
  name: 'Digits only',
  ...pattern(2),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Digits Only');
    await userEvent.click(input);
    await userEvent.keyboard('a1b2');
    await expect(input).toHaveValue('12');
  }
};
export const ReuiInputOtp3 = {
  name: 'Controlled with multiple separators',
  ...pattern(3),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Multi-Separator');
    await expect(input).toHaveValue('123456');
    await userEvent.click(input);
    await userEvent.keyboard('{End}{Backspace}');
    await expect(input).toHaveValue('12345');
  }
};
export const ReuiInputOtp4 = { name: 'Letters and numbers', ...pattern(4) };
export const ReuiInputOtp5 = { name: 'Four-digit PIN', ...pattern(5) };
export const ReuiInputOtp6 = { name: 'Verification card', ...pattern(6) };
