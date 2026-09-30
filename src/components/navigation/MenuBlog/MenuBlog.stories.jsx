import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { categories } from '../../../../.storybook/fixtures/site/navigationContent';
import MenuBlog from './MenuBlog';

const docs = getComponentDocs('Navigation/MenuBlog');

export default {
  title: 'Navigation/MenuBlog',
  id: 'navigation-menublog',
  component: MenuBlog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { categories },
  parameters: {
    docs: { source: playgroundSource('MenuBlog', { imports: "import { MenuBlog } from '@gaudi/design-system';" }) }
  },
  // MenuBlog renders an <li>, so it sits in the host navigation list.
  render: (args) => <ul className='flex'><MenuBlog {...args} /></ul>,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Categories' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const links = canvas.getAllByRole('link');
    await expect(links).toHaveLength(args.categories.length);
    await expect(links[0]).toHaveAttribute('href', `/blog/categories/${args.categories[0].id}`);

    await userEvent.keyboard('{ArrowDown}');
    await expect(links[0]).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(trigger).toHaveFocus());

    await userEvent.click(trigger);
    await userEvent.click(document.body);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
};
