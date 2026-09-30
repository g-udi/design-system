import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'navigation-menu',
  import.meta.glob('../../../../.storybook/fixtures/patterns/navigation-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/navigation-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/NavigationMenu', tags: ['autodocs'], ...catalogueMeta('navigation-menu') };

export const NavigationMenuPattern1 = {
  name: 'Site header menu',
  ...pattern(1, 'One bar with every panel layout: a described list, a two-column grid, an icon list, an icon grid with a call to action, and a plain link.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const components = canvas.getByRole('button', { name: 'Components' });
    await userEvent.click(components);
    await expect(components).toHaveAttribute('aria-expanded', 'true');
    await expect(await canvas.findByRole('link', { name: /Hover Card/ })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Solutions' }));
    await expect(await canvas.findByRole('link', { name: 'Compare plans' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('button', { name: 'Solutions' })).toHaveAttribute('aria-expanded', 'false');
  }
};
