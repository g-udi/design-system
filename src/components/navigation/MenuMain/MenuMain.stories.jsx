import { useEffect, useRef } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { categories, posts } from '../../../../.storybook/fixtures/site/navigationContent';
import { NavigationMenu, NavigationMenuLink, NavigationMenuList } from '../../core/NavigationMenu';
import MenuLogo from '../MenuLogo';
import MenuMain from './MenuMain';

const docs = getComponentDocs('Navigation/MenuMain');

export default {
  title: 'Navigation/MenuMain',
  id: 'navigation-menumain',
  component: MenuMain,
  tags: ['autodocs'],
  parameters: {
    // An open panel adds an aria-hidden focus proxy after its trigger that hands Tab focus into the panel.
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', selector: '[aria-hidden="true"]:not([style*="clip"])' }] } },
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

const links = ['Publications', 'Projects', 'Thoughts'];
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The site header with the Blog panel open: categories on the left, the three newest posts on the right.
function SiteHeader({ allPosts, categories }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.querySelector('[data-slot="navigation-menu-trigger"]').click();
  }, []);
  return (
    <div ref={ref} className='flex min-h-[22rem] items-start gap-3'>
      <MenuLogo className='size-9 shrink-0' />
      <NavigationMenu label='Site' className='w-auto flex-1 justify-end'>
        <NavigationMenuList>
          {links.map((link) => <NavigationMenuLink key={link} href={`/${link.toLowerCase()}`} className='max-sm:hidden'>{link}</NavigationMenuLink>)}
          <MenuMain categories={categories} allPosts={allPosts} />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export const Playground = {
  args: { categories, allPosts: posts },
  parameters: {
    docs: {
      description: { story: 'The site header with the Blog panel open. `categories` fills the left column; the first three `allPosts` become Recent posts on the right.' },
      source: playgroundSource('MenuMain', { imports: "import { MenuMain, NavigationMenu, NavigationMenuList } from '@gaudi/design-system';", before: '<NavigationMenu>\n  <NavigationMenuList>\n', after: '\n  </NavigationMenuList>\n</NavigationMenu>' })
    }
  },
  // MenuMain is a NavigationMenu dropdown, so it sits in the host NavigationMenuList. Remount when the data changes.
  render: (args) => <SiteHeader key={JSON.stringify([args.categories, args.allPosts])} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Blog' });
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByRole('link', { name: new RegExp(args.categories[0].title, 'i') })).toHaveAttribute('href', `/blog/categories/${args.categories[0].id}`);

    const heading = canvas.getByRole('heading', { name: 'Recent posts' });
    await expect(canvas.getByRole('link', { name: /See all/ })).toHaveAttribute('href', '/blog');
    for (const post of args.allPosts.slice(0, 3)) await expect(canvas.getByRole('link', { name: new RegExp(escape(post.title)) })).toHaveAttribute('href', `/blog/${post.slug}`);
    for (const post of args.allPosts.slice(3)) await expect(canvas.queryByText(post.title)).not.toBeInTheDocument();

    await userEvent.click(heading);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    await waitFor(() => expect(heading).not.toBeInTheDocument());
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  }
};
