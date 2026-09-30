import { useEffect, useRef } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { categories } from '../../../../.storybook/fixtures/site/navigationContent';
import MenuLogo from '../MenuLogo';
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
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

const links = ['Publications', 'Projects', 'Thoughts'];

// The blog-route header with the Categories panel open, so the category data is visible without a click.
function BlogHeader({ categories }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.querySelector('[aria-haspopup]').click();
  }, []);
  return (
    <nav ref={ref} aria-label='Blog' className='min-h-[22rem]'>
      <ul className='flex items-center gap-3 border-b border-gray-200 pb-2 text-sm font-medium dark:border-gray-800'>
        <li className='mr-auto'><MenuLogo className='h-8 w-8' /></li>
        {links.map((link) => <li key={link} className='hidden text-gray-700 sm:block dark:text-gray-300'>{link}</li>)}
        <MenuBlog categories={categories} />
      </ul>
    </nav>
  );
}

export const Playground = {
  args: { categories },
  parameters: {
    docs: {
      description: { story: 'The header on a blog route, with the Categories panel open. Edit `categories` to change the destinations and descriptions in the panel.' },
      source: playgroundSource('MenuBlog', { imports: "import { MenuBlog } from '@gaudi/design-system';", before: '<ul>\n', after: '\n</ul>' })
    }
  },
  // MenuBlog renders an <li>, so it sits in the host navigation list. Remount when the data changes.
  render: (args) => <BlogHeader key={JSON.stringify(args.categories)} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Categories' });
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    const links = canvas.getAllByRole('link');
    await expect(links).toHaveLength(args.categories.length);
    await expect(links[0]).toHaveAttribute('href', `/blog/categories/${args.categories[0].id}`);
    await expect(canvas.getByText(args.categories[0].description)).toBeVisible();

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(links[0]).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(trigger).toHaveFocus());

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(document.body);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // Leave the panel open, as the preview starts.
    await userEvent.click(trigger);
  }
};
