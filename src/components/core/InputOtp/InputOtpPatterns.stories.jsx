import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'input-otp',
  import.meta.glob('../../../../.storybook/fixtures/patterns/input-otp/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/input-otp/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/InputOtp', tags: ['autodocs'], ...catalogueMeta('input-otp') };

export const InputOtpPattern1 = { name: 'Grouped slots', ...pattern(1) };
export const InputOtpPattern2 = {
  name: 'Digits only',
  ...pattern(2),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Digits Only');
    await userEvent.click(input);
    await userEvent.keyboard('a1b2');
    await expect(input).toHaveValue('12');
  }
};
export const InputOtpPattern3 = {
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
export const InputOtpPattern4 = { name: 'Letters and numbers', ...pattern(4) };
export const InputOtpPattern5 = { name: 'Four-digit PIN', ...pattern(5) };
export const InputOtpPattern6 = { name: 'Verification card', ...pattern(6) };
