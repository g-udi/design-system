import { useEffect, useRef } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { categories, posts } from '../../../../.storybook/fixtures/site/navigationContent';
import MenuLogo from '../MenuLogo';
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
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

const links = ['Publications', 'Projects', 'Thoughts'];

// The site header with the Blog panel open: categories on the left, the three newest posts on the right.
function SiteHeader({ allPosts, categories }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.querySelector('[aria-haspopup]').click();
  }, []);
  return (
    <nav ref={ref} aria-label='Site' className='min-h-[22rem]'>
      <ul className='flex items-center justify-center gap-3 border-b border-gray-200 pb-2 text-sm font-medium dark:border-gray-800'>
        <li className='mr-auto'><MenuLogo className='h-8 w-8' /></li>
        {links.map((link) => <li key={link} className='hidden text-gray-700 sm:block dark:text-gray-300'>{link}</li>)}
        <MenuMain categories={categories} allPosts={allPosts} />
      </ul>
    </nav>
  );
}

export const Playground = {
  args: { categories, allPosts: posts },
  parameters: {
    docs: {
      description: { story: 'The site header with the Blog panel open. `categories` fills the left column; the first three `allPosts` become Recent posts on the right.' },
      source: playgroundSource('MenuMain', { imports: "import { MenuMain } from '@gaudi/design-system';", before: '<ul>\n', after: '\n</ul>' })
    }
  },
  // MenuMain renders an <li>, so it sits in the host navigation list. Remount when the data changes.
  render: (args) => <SiteHeader key={JSON.stringify([args.categories, args.allPosts])} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Blog' });
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByRole('link', { name: new RegExp(args.categories[0].title, 'i') })).toHaveAttribute('href', `/blog/categories/${args.categories[0].id}`);

    const heading = canvas.getByRole('heading', { name: 'Recent posts' });
    await expect(canvas.getByRole('link', { name: /See all/ })).toHaveAttribute('href', '/blog');
    for (const post of args.allPosts.slice(0, 3)) await expect(canvas.getByRole('link', { name: post.title })).toHaveAttribute('href', `/blog/${post.slug}`);
    for (const post of args.allPosts.slice(3)) await expect(canvas.queryByText(post.title)).not.toBeInTheDocument();

    await userEvent.click(heading);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    await expect(heading).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  }
};
