import { useEffect, useRef } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { categories, posts } from '../../../../.storybook/fixtures/site/navigationContent';
import Menu from './Menu';

const docs = getComponentDocs('Navigation/Menu');
const page = within(document.body);
// Below `lg` the desktop links collapse behind the mobile menu trigger.
const mobileTrigger = (canvas) => canvas.queryByRole('button', { name: 'Open main menu' });

const openMobileMenu = async (canvas) => {
  await userEvent.click(mobileTrigger(canvas));
  return within(await page.findByRole('dialog', { name: 'Mobile navigation' }));
};

export default {
  title: 'Navigation/Menu',
  id: 'navigation-menu',
  component: Menu,
  tags: ['autodocs'],
  args: { categories, posts },
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

// On desktop the Blog panel starts open, so the categories and recent posts are visible without a click.
function OpenBlogPanel(args) {
  const ref = useRef(null);
  useEffect(() => {
    const blog = ref.current.querySelector('[aria-haspopup]');
    if (blog?.checkVisibility()) blog.click();
  }, []);
  return <div ref={ref} className='lg:min-h-[25rem]'><Menu {...args} /></div>;
}

export const Playground = {
  parameters: {
    docs: {
      description: { story: 'The full header: logo, primary links, the Blog panel (open on desktop), search, and theme switch. Below `lg` the links collapse behind the mobile menu. `categories` fills the Blog panel and the mobile menu; the newest three `posts` become Recent posts.' },
      source: playgroundSource('Menu', { imports: "import { Menu } from '@gaudi/design-system';" })
    }
  },
  // Remount when the data changes so the panel reopens with it.
  render: (args) => <OpenBlogPanel key={JSON.stringify([args.categories, args.posts])} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Ahmad Assaf' })).toHaveAttribute('href', '/');

    if (mobileTrigger(canvas)) {
      const dialog = await openMobileMenu(canvas);
      await expect(dialog.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/blog/projects');
      await userEvent.click(dialog.getByRole('button', { name: 'Close menu' }));
      await waitFor(() => expect(page.queryByRole('dialog', { name: 'Mobile navigation' })).not.toBeInTheDocument());
      return;
    }

    const blog = canvas.getByRole('button', { name: 'Blog' });
    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/blog/projects');
    await waitFor(() => expect(blog).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByRole('link', { name: args.posts[0].title })).toHaveAttribute('href', `/blog/${args.posts[0].slug}`);
    await expect(canvas.getByRole('link', { name: new RegExp(args.categories[0].title, 'i') })).toBeVisible();
    await userEvent.click(document.body);
    await expect(blog).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Open search' }));
    await expect(await page.findByRole('dialog')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    // Leave the Blog panel open, as the preview starts.
    await userEvent.click(blog);
    await expect(blog).toHaveAttribute('aria-expanded', 'true');
  }
};

export const BlogRoute = {
  parameters: {
    nextjs: { navigation: { pathname: '/blog/' } },
    docs: { description: { story: 'Inside `/blog`, the Blog link becomes the current page and a Categories dropdown replaces the Blog panel.' } }
  },
  render: (args) => <Menu {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    if (mobileTrigger(canvas)) {
      const dialog = await openMobileMenu(canvas);
      await expect(dialog.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog/');
      await userEvent.keyboard('{Escape}');
      return;
    }

    await expect(canvas.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.queryByRole('button', { name: 'Blog' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Categories' }));
    await expect(canvas.getByRole('link', { name: new RegExp(categories[0].title, 'i') })).toHaveAttribute('href', `/blog/categories/${categories[0].id}`);
  }
};
