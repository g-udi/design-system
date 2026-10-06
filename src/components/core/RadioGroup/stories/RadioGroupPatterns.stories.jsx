import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'radio-group', import.meta.url,
  import.meta.glob('./fixtures/radio-group/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/radio-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/RadioGroup', id: 'core-radiogroup', tags: ['autodocs'], ...catalogueMeta('radio-group') };

export const FieldsetStates = {
  name: 'Fieldset, descriptions and states',
  ...pattern('fieldset-states', 'A legend and description over options with their own descriptions and a disabled option, and an invalid group with its error.'),
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
export const LabelExtras = { name: 'Label extras and layouts', ...pattern('label-extras', 'Tooltip hints, Recommended and New badges, an inline horizontal group, and radios in status colours.') };
export const FramedLists = { name: 'Framed lists', ...pattern('framed-lists', 'Titled frames of rows, each row one click target, with the radio leading or trailing an icon.') };
export const RowCards = { name: 'Row cards', ...pattern('row-cards', 'Pricing plans with a leading radio and a person picker with a trailing radio.') };
export const CornerCards = { name: 'Corner-radio cards', ...pattern('corner-cards', 'Icon cards in a grid and saved payment methods with the radio in the corner.') };
