import { navigationMenuA11y } from '../../../../docs/components/navigationMenuA11y';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { auditOverlayState } from '../../Popover/stories/auditOverlayState.js';

const pattern = patternStories(
  'navigation-menu', import.meta.url,
  import.meta.glob('./fixtures/navigation-menu/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/navigation-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Navigation/NavigationMenu', id: 'core-navigationmenu', tags: ['autodocs'], ...catalogueMeta('navigation-menu') };

export const SiteHeader = {
  name: 'Site header menu',
  ...pattern('site-header', 'One bar with every panel layout: a described list, a two-column grid, an icon list, an icon grid with a call to action, and a plain link.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const panels = [
      ['Getting started', /Introduction/],
      ['Components', /Calendar/],
      ['Foundations', 'Colours'],
      ['Blocks', 'Browse all blocks']
    ];
    for (const [index, [name, linkName]] of panels.entries()) {
      const trigger = canvas.getByRole('button', { name });
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(canvas.getByRole('link', { name: linkName })).toBeVisible());
      for (const link of canvas.getAllByRole('link')) {
        await expect(link.getAttribute('href')).toMatch(/^https:\/\/design\.gaudi\.site\/docs(?:\/|$)/);
      }
      await auditOverlayState(context, `open-${index + 1}`);
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
      trigger.blur();
    }
  }
};

const blogPattern = pattern('blog-recent-posts', 'A blog header: Publications, Projects and Thoughts as plain links, and a Blog panel in two blocks. Categories with their descriptions fill the first column; a muted NavigationMenuAside lists the three most recent posts with their dates and a See all link. The blocks stack below `sm`.');

export const BlogRecentPosts = {
  name: 'Blog menu with recent posts',
  ...blogPattern,
  parameters: {
    ...blogPattern.parameters,
    a11y: navigationMenuA11y
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'Blog navigation' })).toBeVisible();
    for (const name of ['Publications', 'Projects', 'Thoughts']) await expect(canvas.getByRole('link', { name })).toBeVisible();
    const blog = canvas.getByRole('button', { name: 'Blog' });
    await userEvent.click(blog);
    await expect(blog).toHaveAttribute('aria-expanded', 'true');
    const category = await canvas.findByRole('link', { name: /Productivity, tools and tips/ });
    await waitFor(() => expect(category).toBeVisible());
    const recent = canvas.getByRole('group', { name: 'Recent posts' });
    await expect(within(recent).getAllByRole('link')).toHaveLength(4);
    await expect(within(recent).getByRole('link', { name: 'See all' })).toHaveAttribute('href', 'https://assaf.website/blog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(blog).toHaveAttribute('aria-expanded', 'false'));
    // Leave the panel open so the two blocks stay visible.
    await userEvent.click(blog);
    await expect(blog).toHaveAttribute('aria-expanded', 'true');
  }
};
