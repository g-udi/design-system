import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'radio-group',
  import.meta.glob('../../../../.storybook/fixtures/patterns/radio-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/radio-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Inputs/RadioGroup', id: 'core-radiogroup', tags: ['autodocs'], ...catalogueMeta('radio-group') };

export const RadioGroupPattern6 = {
  name: 'Fieldset, descriptions and states',
  ...pattern(6, 'A legend and description over options with their own descriptions and a disabled option, and an invalid group with its error.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const option = (name) => canvas.getByRole('radio', { name });
    await expect(option('Comfortable')).toHaveAttribute('aria-checked', 'true');
    await expect(option('Compact')).toBeDisabled();
    await userEvent.click(canvas.getByText('Default'));
    await expect(option('Default')).toHaveAttribute('aria-checked', 'true');
    await expect(option('Email only')).toHaveAttribute('aria-invalid', 'true');
  }
};
export const RadioGroupPattern15 = { name: 'Label extras and layouts', ...pattern(15, 'Tooltip hints, Recommended and New badges, an inline horizontal group, and radios in status colours.') };
export const RadioGroupPattern10 = { name: 'Framed lists', ...pattern(10, 'Titled frames of rows, each row one click target, with the radio leading or trailing an icon.') };
export const RadioGroupPattern17 = { name: 'Row cards', ...pattern(17, 'Pricing plans with a leading radio and a person picker with a trailing radio.') };
export const RadioGroupPattern11 = { name: 'Corner-radio cards', ...pattern(11, 'Icon cards in a grid and saved payment methods with the radio in the corner.') };
