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

export const Playground = {
  parameters: {
    docs: { source: playgroundSource('Menu', { imports: "import { Menu } from '@gaudi/design-system';" }) }
  },
  render: (args) => <Menu {...args} />,
  play: async ({ canvasElement }) => {
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
    await userEvent.click(blog);
    await expect(blog).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('link', { name: posts[0].title })).toHaveAttribute('href', `/blog/${posts[0].slug}`);
    await userEvent.click(document.body);
    await expect(blog).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Open search' }));
    await expect(await page.findByRole('dialog')).toBeVisible();
    await userEvent.keyboard('{Escape}');
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
