import { useEffect, useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { categories, posts, primaryLinks } from '../../../../.storybook/fixtures/site/navigationContent';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Menu from './Menu.jsx';
import BrandMark from './parts/BrandMark.jsx';
import MenuMobile from './parts/MenuMobile.jsx';
import MenuSearch from './parts/MenuSearch.jsx';

const docs = getComponentDocs('Blocks/Navigation');
const page = within(document.body);
// Below `lg` the desktop links collapse behind the phone sheet trigger.
const mobileTrigger = (canvas) => canvas.queryByRole('button', { name: 'Open main menu' });
const sheetName = 'Mobile navigation';
const findSheet = async () => within(await page.findByRole('dialog', { name: sheetName }));
const expectSheetClosed = () => waitFor(() => expect(page.queryByRole('dialog', { name: sheetName })).not.toBeInTheDocument());
// Focus assertions need a focused window; headless runs without one skip them.
const expectFocus = (canvasElement, element) => canvasElement.ownerDocument.hasFocus() && waitFor(() => expect(element).toHaveFocus());

const openMobileMenu = async (canvas) => {
  await userEvent.click(mobileTrigger(canvas));
  return findSheet();
};

const menuImport = "import { Menu } from '@gaudi/design-system';";
const code = (source) => ({ source: { code: source, language: 'jsx' } });

export default {
  title: 'Blocks/Navigation',
  id: 'blocks-navigation',
  component: Menu,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { categories: 'object', posts: 'object' }),
  args: { categories, posts },
  parameters: {
    // An open panel adds an aria-hidden focus proxy after its trigger that hands Tab focus into the panel.
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', selector: '[aria-hidden="true"]:not([style*="clip"])' }] } },
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
    const blog = ref.current.querySelector('[data-slot="navigation-menu-trigger"]');
    if (blog?.checkVisibility()) blog.click();
  }, []);
  return <div ref={ref} className='lg:min-h-[25rem]'><Menu {...args} /></div>;
}

export const Playground = {
  parameters: {
    docs: {
      description: { story: 'The full header: brand mark, primary links, the two-block Blog panel (open on desktop) with categories beside a muted Recent posts column, search, and theme switch. Below `lg` the links collapse behind the phone sheet. `categories` fills the Blog panel and the sheet; the newest three `posts` become Recent posts. In an app, `LayoutContainer` renders this header from `menuProps`.' },
      source: playgroundSource('Menu', { imports: menuImport })
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
      await expectSheetClosed();
      return;
    }

    const blog = canvas.getByRole('button', { name: 'Blog' });
    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/blog/projects');
    await waitFor(() => expect(blog).toHaveAttribute('aria-expanded', 'true'));
    const recent = canvas.getByRole('group', { name: 'Recent posts' });
    await expect(within(recent).getByRole('link', { name: new RegExp(args.posts[0].title) })).toHaveAttribute('href', `/blog/${args.posts[0].slug}`);
    await expect(within(recent).getByRole('link', { name: 'See all' })).toHaveAttribute('href', '/blog');
    await waitFor(() => expect(canvas.getByRole('link', { name: new RegExp(args.categories[0].title, 'i') })).toBeVisible());
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
    docs: {
      description: { story: 'Inside `/blog`, the Blog link becomes the current page and a Categories dropdown replaces the Blog panel.' },
      ...code(`${menuImport}\n\n// On a /blog route\n<Menu categories={categories} posts={posts} />`)
    }
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

const CustomLogo = () => (
  <span className='flex items-center gap-2'>
    <span aria-hidden='true' className='flex size-10 items-center justify-center rounded-control bg-accent text-sm font-bold text-surface'>FN</span>
    <span className='hidden text-sm font-semibold sm:inline'>Field notes</span>
  </span>
);

export const CustomLogoSlot = {
  name: 'Custom logo',
  parameters: {
    docs: {
      description: { story: 'Pass `logo` to replace the default brand mark with your own. The home link keeps its accessible name from the SiteConfig author or title, so decorative marks need no text of their own.' },
      ...code(`${menuImport}\n\n<Menu\n  categories={categories}\n  posts={posts}\n  logo={<img src='/logo.svg' alt='' className='size-10' />}\n/>`)
    }
  },
  render: (args) => <Menu {...args} logo={<CustomLogo />} />,
  play: async ({ canvasElement }) => {
    const home = within(canvasElement).getByRole('link', { name: 'Ahmad Assaf' });
    await expect(home).toHaveAttribute('href', '/');
    await expect(home).toHaveTextContent('FN');
  }
};

// The phone sheet is mounted only while open, so the header owns the open state and the trigger: here, a
// phone-width header above the start of an article. The sheet renders into this frame, not the body, so it never
// covers the docs page; the transform makes the frame the containing block for the sheet's fixed overlay.
function PhoneFrame({ initiallyOpen = false, onOpenChange, setLauncherOpen }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [frame, setFrame] = useState(null);
  const update = (next) => {
    setOpen(next);
    onOpenChange(next);
  };
  return (
    <div ref={setFrame} data-testid='phone-frame' className={`mx-auto w-full max-w-sm transform-gpu overflow-hidden rounded-card border border-border ${open ? 'h-[36rem]' : ''}`}>
      <header className='flex items-center justify-between border-b border-border px-3 py-1'>
        <BrandMark className='size-9' />
        <Button variant='ghost' tone='neutral' size='icon' className='size-11' aria-label='Open main menu' aria-expanded={open} onClick={() => update(true)}>
          <Icon name='Menu' decorative size='md' />
        </Button>
      </header>
      <div aria-hidden='true' className='grid gap-2 p-4'>
        <div className='h-3 w-20 rounded-control bg-accent-muted' />
        <div className='h-5 w-4/5 rounded-control bg-border/60' />
        <div className='h-3 w-full rounded-control bg-border/60' />
        <div className='h-3 w-2/3 rounded-control bg-border/60' />
      </div>
      {open && frame ? <MenuMobile blogLink={{ href: '/blog', title: 'Blog' }} categories={categories} links={primaryLinks} container={frame} setMobileMenuOpen={update} setLauncherOpen={setLauncherOpen} /> : null}
    </div>
  );
}

const phoneSource = code(`${menuImport}\n\n// Below lg, the header's menu button opens the phone sheet.\n<Menu categories={categories} posts={posts} />`);

export const PhoneSheet = {
  args: { onOpenChange: fn(), setLauncherOpen: fn() },
  argTypes: { categories: { table: { disable: true } }, posts: { table: { disable: true } } },
  parameters: {
    docs: {
      description: { story: 'Below `lg` the header collapses to its brand and a menu button that opens the phone sheet: search, the Blog destination with every category and its description, then the other links. The sheet is a named modal dialog that takes focus, closes on Escape or Close, and returns focus to the menu button; it closes itself when the layout reaches `lg`.' },
      ...phoneSource
    }
  },
  render: (args) => <PhoneFrame {...args} initiallyOpen />,
  play: async ({ args, canvasElement }) => {
    // The sheet starts open; the Close button dismisses it.
    const dialog = await findSheet();
    await expect(page.getByRole('dialog', { name: sheetName })).toHaveAttribute('aria-modal', 'true');
    // Everything outside the dialog is hidden from assistive technology.
    await expect(within(canvasElement).getByTestId('phone-frame').querySelector('header').closest('[aria-hidden="true"]')).not.toBeNull();
    await expectFocus(canvasElement, dialog.getByRole('button', { name: 'Close menu' }));
    await expect(dialog.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
    await expect(within(dialog.getByRole('list', { name: 'Blog categories' })).getAllByRole('link')).toHaveLength(categories.length);
    for (const link of primaryLinks) await expect(dialog.getByRole('link', { name: link.title })).toHaveAttribute('href', link.href);
    await userEvent.click(dialog.getByRole('button', { name: 'Close menu' }));
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expectSheetClosed();

    // Opened from the trigger, Escape closes it and returns focus to the trigger.
    const trigger = within(canvasElement).getByRole('button', { name: 'Open main menu' });
    await userEvent.click(trigger);
    const reopened = await findSheet();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expectFocus(canvasElement, reopened.getByRole('button', { name: 'Close menu' }));
    await userEvent.keyboard('{Escape}');
    await expectSheetClosed();
    await expectFocus(canvasElement, trigger);
    // Leave the sheet open, as it starts.
    await userEvent.click(trigger);
    await findSheet();
  }
};

export const SearchHandoff = {
  args: { onOpenChange: fn(), setLauncherOpen: fn() },
  argTypes: { categories: { table: { disable: true } }, posts: { table: { disable: true } } },
  parameters: {
    docs: {
      description: { story: 'Search from the phone sheet closes the sheet first, then asks the header to open the command launcher, so only one modal layer is ever open.' },
      ...phoneSource
    }
  },
  render: (args) => <PhoneFrame {...args} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open main menu' }));
    const dialog = await findSheet();
    await userEvent.click(dialog.getByRole('button', { name: 'Open search' }));
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
    await expect(args.setLauncherOpen).toHaveBeenCalledWith(true);
    await expectSheetClosed();
  }
};

const headerLinks = ['Publications', 'Projects', 'Thoughts'];

// The search entry in its two homes: a custom desktop header and the full-width row of a phone sheet.
function SearchPlacements({ setOpen }) {
  const [requests, setRequests] = useState(0);
  const open = (next) => {
    setRequests((count) => count + 1);
    setOpen(next);
  };
  return (
    <div className='grid gap-3'>
      <header className='flex items-center gap-4 rounded-card border border-border px-3 py-1'>
        <BrandMark className='size-8' />
        <nav aria-label='Header' className='hidden flex-1 gap-4 text-sm font-medium text-text-muted sm:flex'>
          {headerLinks.map((link) => <span key={link}>{link}</span>)}
        </nav>
        <MenuSearch className='ml-auto w-44 sm:w-48 lg:w-48 xl:w-48' setOpen={open} />
      </header>
      <div className='mx-auto flex w-full max-w-sm items-center gap-2 rounded-card border border-border p-3'>
        <MenuSearch className='w-full sm:w-full lg:w-full xl:w-full' setOpen={open} />
        <span className='flex size-11 shrink-0 items-center justify-center text-text-muted'><Icon name='X' decorative size='sm' /></span>
      </div>
      <p role='status' className='text-center text-xs text-text-muted'>
        {requests ? `Command launcher requested ${requests === 1 ? 'once' : `${requests} times`}` : 'Click either entry or press Enter on it to request the launcher.'}
      </p>
    </div>
  );
}

export const SearchTrigger = {
  name: 'Search trigger',
  args: { setOpen: fn() },
  argTypes: { categories: { table: { disable: true } }, posts: { table: { disable: true } } },
  parameters: {
    docs: {
      description: { story: 'The header search entry is exported as `MenuSearch` for custom headers: a named button with the ⌘K hint that calls `setOpen(true)`. Pair it with Commander, which returns focus to the entry on close. The status line counts each request.' },
      ...code("import { useState } from 'react';\nimport { Commander, MenuSearch } from '@gaudi/design-system';\n\nconst [open, setOpen] = useState(false);\n\n<MenuSearch setOpen={setOpen} />\n<Commander open={open} setOpen={setOpen} />")
    }
  },
  render: (args) => <SearchPlacements {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [header, sheet] = canvas.getAllByRole('button', { name: 'Open search' });
    await expect(header).toHaveTextContent('Search');
    await userEvent.click(header);
    await expect(args.setOpen).toHaveBeenCalledWith(true);
    await expect(canvas.getByRole('status')).toHaveTextContent('requested once');
    sheet.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.setOpen).toHaveBeenCalledTimes(2);
    await expect(canvas.getByRole('status')).toHaveTextContent('requested 2 times');
  }
};
