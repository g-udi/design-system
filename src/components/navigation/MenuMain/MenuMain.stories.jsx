import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { categories, posts } from '../../../../.storybook/fixtures/site/navigationContent';
import MenuMain from './MenuMain';

const docs = getComponentDocs('Navigation/MenuMain');

export default {
  title: 'Navigation/MenuMain',
  id: 'navigation-menumain',
  component: MenuMain,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { categories, allPosts: posts },
  parameters: {
    docs: { source: playgroundSource('MenuMain', { imports: "import { MenuMain } from '@gaudi/design-system';" }) }
  },
  // MenuMain renders an <li>, so it sits in the host navigation list.
  render: (args) => <ul><MenuMain {...args} /></ul>,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Blog' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('link', { name: new RegExp(args.categories[0].title, 'i') })).toHaveAttribute('href', `/blog/categories/${args.categories[0].id}`);

    const heading = canvas.getByRole('heading', { name: 'Recent posts' });
    await expect(canvas.getByRole('link', { name: /See all/ })).toHaveAttribute('href', '/blog');
    for (const post of args.allPosts.slice(0, 3)) await expect(canvas.getByRole('link', { name: post.title })).toHaveAttribute('href', `/blog/${post.slug}`);
    await expect(canvas.queryByText(args.allPosts[3].title)).not.toBeInTheDocument();

    await userEvent.click(heading);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    await expect(heading).not.toBeInTheDocument();
  }
};
