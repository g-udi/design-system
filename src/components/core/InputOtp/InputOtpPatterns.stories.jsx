import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'input-otp',
  import.meta.glob('../../../../.storybook/fixtures/patterns/input-otp/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/input-otp/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Advanced Inputs/InputOtp', id: 'core-inputotp', tags: ['autodocs'], ...catalogueMeta('input-otp') };

export const InputOtpPattern1 = {
  name: 'Code formats',
  ...pattern(1, 'Digit-only and alphanumeric patterns, a four-digit PIN, and a controlled code split into three groups.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const digits = canvas.getByLabelText('Digits only');
    await userEvent.click(digits);
    await userEvent.keyboard('a1b2');
    await expect(digits).toHaveValue('12');
    const controlled = canvas.getByLabelText('Controlled');
    await expect(controlled).toHaveValue('123456');
    await userEvent.click(controlled);
    await userEvent.keyboard('{End}{Backspace}');
    await expect(controlled).toHaveValue('12345');
    await expect(canvas.getByText('Value: 12345')).toBeVisible();
  }
};
