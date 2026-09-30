import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'spinner',
  import.meta.glob('../../../../.storybook/fixtures/patterns/spinner/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/spinner/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Spinner', id: 'core-spinner', tags: ['autodocs'], ...catalogueMeta('spinner') };

export const SpinnerPattern2 = { name: 'In buttons, badges and inputs', ...pattern(2, 'Busy buttons, syncing badges and a searching input addon.') };
export const SpinnerPattern9 = { name: 'Inline status', ...pattern(9, 'Spinners beside status text take the tone of the message; three dots mark a typing indicator.') };
export const SpinnerPattern7 = {
  name: 'Overlays and empty states',
  ...pattern(7, 'A refresh overlay on a card, toggled by the switch, and a loading empty state.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status', { name: 'Refreshing data' })).toBeVisible();
    await userEvent.click(canvas.getByRole('switch', { name: 'Refreshing' }));
    await expect(canvas.queryByRole('status', { name: 'Refreshing data' })).not.toBeInTheDocument();
  }
};
