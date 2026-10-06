import { useEffect, useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { categories, posts, primaryLinks } from '../../../../docs/fixtures/site/navigationContent';
import Button from '../../../core/Button';
import Icon from '../../../core/Icon';
import Menu from '../Menu.jsx';
import BrandMark from '../BrandMark.jsx';
import MenuMobile from '../MenuMobile.jsx';
import MenuSearch from '../MenuSearch.jsx';
import { AppleNavigationDemo } from './fixtures/AppleNavigationDemo.jsx';
import appleNavigationSource from './fixtures/AppleNavigationDemo.jsx?raw';
import appleNavigationStyles from './fixtures/AppleNavigationDemo.css?raw';
import { MergingNavigationDemo } from './fixtures/MergingNavigationDemo.jsx';
import mergingNavigationSource from './fixtures/MergingNavigationDemo.jsx?raw';
import mergingNavigationStyles from './fixtures/MergingNavigationDemo.css?raw';

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

const menuImport = "import { Menu } from '@gaudi/design-system/blocks/Navigation';\n\nconst categories = " + JSON.stringify(categories, null, 2) + ';\nconst posts = ' + JSON.stringify(posts, null, 2) + ';';
const code = (source) => ({ source: { code: source, language: 'jsx' } });

export default {
  title: 'Blocks/Navigation',
  id: 'blocks-navigation',
  component: Menu,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { categories: 'object', posts: 'object' }),
  args: { categories, posts, blogLink: { href: '/blog', title: 'Blog' } },
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
    await expect(within(recent).getByRole('link', { name: new RegExp(args.posts[0].title) })).toHaveAttribute('href', args.posts[0].href);
    await expect(within(recent).getByRole('link', { name: 'See all' })).toHaveAttribute('href', args.blogLink.href);
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
      ...code(`${menuImport}\n\n// On a /blog route\n<Menu blogLink={{ href: '/blog/', title: 'Blog' }} categories={categories} posts={posts} />`)
    }
  },
  render: (args) => <Menu {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    if (mobileTrigger(canvas)) {
      const dialog = await openMobileMenu(canvas);
      await expect(dialog.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
      await userEvent.keyboard('{Escape}');
      return;
    }

    await expect(canvas.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.queryByRole('button', { name: 'Blog' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Categories' }));
    await expect(canvas.getByRole('link', { name: new RegExp(categories[0].title, 'i') })).toHaveAttribute('href', categories[0].href);
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

const phoneSource = code(`${menuImport}\n\n// Below lg, the header's menu button opens the phone sheet.\n<Menu blogLink={{ href: '/blog/', title: 'Blog' }} categories={categories} posts={posts} />`);

export const PhoneSheet = {
  args: { onOpenChange: fn(), setLauncherOpen: fn() },
  argTypes: { categories: { table: { disable: true } }, posts: { table: { disable: true } } },
  parameters: {
    docs: {
      description: { story: 'Below `lg` the header collapses to its brand and a menu button that opens the phone sheet: search, the Blog destination with every category and its description, then the other links. The sheet is a named modal dialog that takes focus, closes on Escape or Close, and returns focus to the menu button; it closes itself when the layout reaches `lg`.' },
      ...phoneSource
    }
  },
  // A mounted modal hides the rest of Docs from assistive technology, even in a contained frame.
  render: (args, context) => <PhoneFrame {...args} initiallyOpen={context.viewMode !== 'docs'} />,
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
      ...code("import { useState } from 'react';\nimport { Commander, MenuSearch } from '@gaudi/design-system';\n\nexport function SearchExample() {\n  const [open, setOpen] = useState(false);\n  return <><MenuSearch setOpen={setOpen} /><Commander open={open} setOpen={setOpen} navigation={[{ id: 'posts', title: 'Posts', href: '/posts' }]} /></>;\n}")
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

export const AppleStyle = {
  name: 'Apple-style mega menu',
  args: { onNavigate: fn() },
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'A full-width, hover-triggered header inspired by [Skiper 38](https://skiper-ui.com/v1/skiper38). Larger primary links sit beside two quieter groups, with a short stagger and a blurred page backdrop. Click and keyboard navigation work too. Below 1024px, a named modal menu uses expandable sections and contains its own scrolling. Reduced motion removes the transitions. This is a composition of public NavigationMenu, Dialog, Accordion, Button, and Icon parts; destinations update the local preview so you can try the flow without leaving Storybook. Replace the demo callback with your application router.' },
      source: {
        code: publicSource(appleNavigationSource.replace("import styles from './AppleNavigationDemo.css?raw';", `const styles = \`\n${appleNavigationStyles}\`;`), new URL('./fixtures/AppleNavigationDemo.jsx', import.meta.url)),
        language: 'jsx'
      }
    }
  },
  render: (args) => <AppleNavigationDemo onNavigate={args.onNavigate} />,
  play: async (context) => {
    const { args, canvasElement } = context;
    const canvas = within(canvasElement);
    const desktopTrigger = () => canvas.queryByRole('button', { name: 'Journal', exact: true });
    const openPhone = async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Open studio menu' }));
      return within(await canvas.findByRole('dialog', { name: 'Studio menu' }));
    };
    if (desktopTrigger()) {
      await userEvent.hover(desktopTrigger());
      await waitFor(() => expect(desktopTrigger()).toHaveAttribute('aria-expanded', 'true'));
      await waitFor(() => expect(canvas.getByRole('link', { name: 'Latest stories' })).toBeVisible());
      // A second hover replaces the full-width panel without a separate click.
      const projects = canvas.getByRole('button', { name: 'Projects', exact: true });
      await userEvent.hover(projects);
      await waitFor(() => expect(projects).toHaveAttribute('aria-expanded', 'true'));
      await userEvent.click(canvas.getByRole('link', { name: 'All projects' }));
      await expect(args.onNavigate).toHaveBeenLastCalledWith({ title: 'All projects', href: '/projects/all-projects' });
      await expect(canvas.getByRole('heading', { name: 'All projects' })).toBeVisible();
      await userEvent.unhover(projects);
      desktopTrigger().focus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(desktopTrigger()).toHaveAttribute('aria-expanded', 'true'));
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(desktopTrigger()).toHaveAttribute('aria-expanded', 'true'));
      await expectFocus(canvasElement, canvas.getByRole('link', { name: 'Latest stories' }));
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(desktopTrigger()).toHaveAttribute('aria-expanded', 'false'));
      await expectFocus(canvasElement, desktopTrigger());
      await userEvent.click(desktopTrigger());
      await userEvent.click(canvasElement.querySelector('.apple-navigation-backdrop'));
      await waitFor(() => expect(desktopTrigger()).toHaveAttribute('aria-expanded', 'false'));
    } else {
      const dialog = await openPhone();
      await userEvent.click(dialog.getByRole('button', { name: 'Journal' }));
      const lastLink = dialog.getByRole('link', { name: 'A slower web' });
      lastLink.focus();
      await expectFocus(canvasElement, lastLink);
      await expect(canvasElement.querySelector('.apple-navigation-phone-content').scrollTop).toBeGreaterThan(0);
      await userEvent.click(dialog.getByRole('button', { name: 'Close studio menu' }));
      await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
      const reopened = await openPhone();
      await userEvent.click(reopened.getByRole('button', { name: 'Journal' }));
      await userEvent.click(reopened.getByRole('link', { name: 'Latest stories' }));
      await expect(args.onNavigate).toHaveBeenLastCalledWith({ title: 'Latest stories', href: '/journal/latest-stories' });
      await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
      await expectFocus(canvasElement, canvas.getByRole('button', { name: 'Open studio menu' }));
      await openPhone();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
    }
    await userEvent.click(canvas.getByRole('link', { name: 'Gaudi', exact: true }));
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({
        ...context,
        id: `${context.id}-open`,
        beforeAuditWidth: async ({ width }) => {
          if (width >= 1024) {
            await waitFor(() => expect(desktopTrigger()).toBeInTheDocument());
            if (desktopTrigger().getAttribute('aria-expanded') !== 'true') await userEvent.click(desktopTrigger());
            const panel = canvasElement.querySelector('.apple-navigation-panel');
            await waitFor(() => expect(panel).toBeVisible());
            const frame = canvas.getByTestId('apple-navigation-demo').getBoundingClientRect();
            const rect = panel.getBoundingClientRect();
            await expect(Math.abs(rect.width - frame.width)).toBeLessThan(3);
          } else {
            let dialog = canvas.queryByRole('dialog', { name: 'Studio menu' });
            if (!dialog) { await openPhone(); dialog = canvas.getByRole('dialog', { name: 'Studio menu' }); }
            const journal = within(dialog).getByRole('button', { name: 'Journal' });
            if (journal.getAttribute('aria-expanded') !== 'true') await userEvent.click(journal);
          }
          const links = [...canvasElement.querySelectorAll('.apple-navigation-link')].filter(link => link.checkVisibility());
          for (const link of links) {
            const rect = link.getBoundingClientRect();
            await expect(rect.left).toBeGreaterThanOrEqual(0);
            await expect(rect.right).toBeLessThanOrEqual(width);
            await expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth + 1);
          }
        }
      });
      // The shared afterEach audit also checks the resting state.
      const dialog = canvas.queryByRole('dialog', { name: 'Studio menu' });
      if (dialog) await userEvent.click(within(dialog).getByRole('button', { name: 'Close studio menu' }));
      if (desktopTrigger()?.getAttribute('aria-expanded') === 'true') await userEvent.click(desktopTrigger());
    }
  }
};

export const MergingHeader = {
  name: 'Scroll-merging header',
  args: { onSectionChange: fn() },
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Inspired by [Skiper 57](https://skiper-ui.com/v1/skiper57): scroll the workspace and the project breadcrumb gives way to a single sticky row, bringing the section tabs alongside the brand. The same TabsList stays mounted, preserving keyboard focus and selection. Phones keep every section in a contained horizontal tab row. Reduced motion starts with the compact header. The G button returns the local workspace to the top. ScrollArea, Tabs, Breadcrumb, and the shared scroll/measurement hooks own the behavior; sample records are local.' },
      source: {
        code: publicSource(mergingNavigationSource.replace("import styles from './MergingNavigationDemo.css?raw';", `const styles = \`\n${mergingNavigationStyles}\`;`), new URL('./fixtures/MergingNavigationDemo.jsx', import.meta.url)),
        language: 'jsx'
      }
    }
  },
  render: (args) => <MergingNavigationDemo onSectionChange={args.onSectionChange} />,
  play: async (context) => {
    const { canvasElement, args } = context;
    const canvas = within(canvasElement);
    const viewport = canvas.getByRole('region', { name: 'Project workspace' });
    const header = canvasElement.querySelector('.merging-navigation-header');
    const tabs = canvas.getByRole('tablist', { name: 'Project sections' });
    const overview = canvas.getByRole('tab', { name: 'Overview' });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    await expect(header).toHaveAttribute('data-merged', String(reduced));
    await expect(overview).toHaveAttribute('aria-selected', 'true');
    viewport.scrollTo({ top: 200, behavior: 'instant' });
    await waitFor(() => expect(header).toHaveAttribute('data-merged', 'true'));
    await expect(canvas.getByRole('tablist')).toBe(tabs);
    await expect(canvas.queryByRole('navigation', { name: 'Project breadcrumb' })).not.toBeInTheDocument();
    await expect(Math.abs(tabs.getBoundingClientRect().top - viewport.getBoundingClientRect().top)).toBeLessThan(2);
    overview.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Deployments' })).toHaveAttribute('aria-selected', 'true'));
    await expect(args.onSectionChange).toHaveBeenLastCalledWith('deployments');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Recent deployments');
    await expect(viewport.scrollTop).toBeGreaterThan(100);
    await userEvent.keyboard('{End}');
    const settings = canvas.getByRole('tab', { name: 'Settings' });
    await waitFor(() => expect(settings).toHaveAttribute('aria-selected', 'true'));
    await expect(settings.getBoundingClientRect().right).toBeLessThanOrEqual(tabs.getBoundingClientRect().right + 1);
    await expectFocus(canvasElement, settings);
    await userEvent.click(canvas.getByRole('button', { name: 'Back to workspace top' }));
    await waitFor(() => expect(viewport.scrollTop).toBe(0));
    await expect(header).toHaveAttribute('data-merged', String(reduced));
    settings.focus();
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(overview).toHaveAttribute('aria-selected', 'true'));
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({
        ...context,
        id: `${context.id}-merged`,
        beforeAuditWidth: async ({ width }) => {
          viewport.scrollTo({ top: 200, behavior: 'instant' });
          await waitFor(() => expect(header).toHaveAttribute('data-merged', 'true'));
          const box = tabs.getBoundingClientRect();
          const brand = canvas.getByRole('button', { name: 'Back to workspace top' }).getBoundingClientRect();
          await expect(Math.abs(box.top - viewport.getBoundingClientRect().top)).toBeLessThan(2);
          await expect(box.left).toBeGreaterThanOrEqual(brand.right);
          await expect(box.right).toBeLessThanOrEqual(width);
          await expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1);
        }
      });
      viewport.scrollTo({ top: 0, behavior: 'instant' });
      await waitFor(() => expect(header).toHaveAttribute('data-merged', String(reduced)));
    }
  }
};
