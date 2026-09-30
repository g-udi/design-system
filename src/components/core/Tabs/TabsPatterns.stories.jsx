import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'tabs',
  import.meta.glob('../../../../.storybook/fixtures/patterns/tabs/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/tabs/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tabs', id: 'core-tabs', tags: ['autodocs'], ...catalogueMeta('tabs') };

export const TabsPattern1 = {
  name: 'Settings form tabs',
  ...pattern(1, 'Form panels behind tabs. Switches toggle the line variant, vertical orientation, trigger icons and a full-width list.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Password' }));
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Change your password here.');
    await userEvent.click(canvas.getByRole('switch', { name: 'Vertical' }));
    await expect(canvas.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    await userEvent.click(canvas.getByRole('tab', { name: 'Account' }));
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(canvas.getByRole('switch', { name: 'Vertical' }));
  }
};
export const TabsPattern7 = { name: 'Badge counts', ...pattern(7, 'Line tabs with a count badge per mailbox; the tone marks what needs attention.') };
export const TabsPattern9 = { name: 'Period switch', ...pattern(9, 'Controlled tabs with equal-width triggers that change the figure in one card.') };
