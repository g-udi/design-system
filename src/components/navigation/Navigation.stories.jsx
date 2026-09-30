import { useRef, useState } from 'react';

import { CodeBlock, InlineCode, Page, pageParameters, Section, Table, Td, Th } from '../../../.storybook/stories/StoryDocs';
import Button from '../core/Button';
import Icon from '../core/Icon';
import Link from '../core/Link';
import Typography from '../../foundations/Typography';
import MenuLogo from './MenuLogo';
import MenuMain from './MenuMain';
import MenuSearch from './MenuSearch';

const categories = [
  {
    'description': 'Knowledge graphs, semantic web, linked data, and retrieval systems.',
    'id': 'data',
    'title': 'Data'
  },
  {
    'description': 'Frontend architecture, design systems, and developer tooling.',
    'id': 'engineering',
    'title': 'Engineering'
  },
  {
    'description': 'Systems, workflows, and durable personal infrastructure.',
    'id': 'productivity',
    'title': 'Productivity'
  }
];

const posts = [
  {
    'date': '2026-05-20',
    'slug': 'engineering/design-systems-editorial-rhythm',
    'title': 'Design systems keep editorial rhythm predictable'
  },
  {
    'date': '2026-04-12',
    'slug': 'data/knowledge-graph-retrieval',
    'title': 'Knowledge graph retrieval patterns'
  },
  {
    'date': '2026-03-18',
    'slug': 'engineering/mdx-rendering-pipeline',
    'title': 'The MDX rendering pipeline'
  }
];

const links = [
  { 'href': '/blog', 'title': 'Blog' },
  { 'href': '/publications', 'title': 'Publications' },
  { 'href': '/projects', 'title': 'Projects' },
  { 'href': '/thoughts', 'title': 'Thoughts' },
  { 'href': '/about', 'title': 'About' }
];

const usageCode = `import { Menu, SiteConfigProvider } from '@gaudi/design-system';

function Header({ categories, navigation, posts, projects, publications, siteMetadata, tags, thoughts }) {
  return (
    <SiteConfigProvider metadata={siteMetadata} navigation={navigation}>
      <Menu
        categories={categories}
        posts={posts}
        projects={projects}
        publications={publications}
        tags={tags}
        thoughts={thoughts}
      />
    </SiteConfigProvider>
  );
}`;

const stickyCode = `function StickyHeader() {
  const [visible, setVisible] = useState(true);
  const lastScrollTop = useRef(0);

  const onScroll = (event) => {
    const nextScrollTop = event.currentTarget.scrollTop;
    setVisible(nextScrollTop < lastScrollTop.current || nextScrollTop < 24);
    lastScrollTop.current = nextScrollTop;
  };

  return (
    <div onScroll={onScroll} className='h-[420px] overflow-y-auto'>
      <header className={visible ? 'translate-y-0' : '-translate-y-full'}>
        ...
      </header>
      <article>...</article>
    </div>
  );
}`;

const HeaderSurface = ({ children, label }) => (
  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950'>
    {label ? <div className='mb-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400'>{label}</div> : null}
    {children}
  </div>
);

const HeaderRow = ({ launcherLabel = 'Search opened', mobile = false, onMenuClick = () => {} }) => {
  const [ launcherOpen, setLauncherOpen ] = useState(false);

  return (
    <div className='space-y-3'>
      <header className='flex min-h-14 items-center justify-between gap-4'>
        <Link href='/' aria-label='Ahmad Assaf' variant='bare' className='shrink-0 text-gray-950 dark:text-white'>
          <MenuLogo className={ mobile ? 'h-10 w-10' : 'h-12 w-12' } />
        </Link>

        {mobile ? null : (
          <nav className='hidden items-center gap-6 lg:flex' aria-label='Primary'>
            {links.slice(0, 4).map((link) => (
              <Link key={ link.href } href={ link.href } className='whitespace-nowrap px-1 py-2 text-sm font-medium'>
                {link.title}
              </Link>
            ))}
            <ul className='flex items-center'>
              <MenuMain categories={ categories } allPosts={ posts } />
            </ul>
          </nav>
        )}

        <div className='flex items-center gap-3'>
          {mobile ? null : <MenuSearch className='hidden lg:block' setOpen={ setLauncherOpen } />}
          <Button variant='ghost' tone='neutral' size='sm' className={ mobile ? 'h-11 w-11 p-0' : 'h-11 w-11 p-0 lg:hidden' } onClick={ onMenuClick }>
            <span className='sr-only'>Open menu</span>
            <Icon name='Menu' decorative size='md' />
          </Button>
        </div>
      </header>
      {launcherOpen ? (
        <div className='rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300'>
          {launcherLabel}
        </div>
      ) : null}
    </div>
  );
};

const MobilePanelPreview = () => {
  return (
    <div className='rounded-lg border border-gray-200 bg-white px-6 py-8 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:ring-1 sm:ring-gray-900/10'>
      <div className='mb-10 flex items-start justify-end'>
        <Button variant='ghost' tone='neutral' size='sm' className='h-11 w-11 shrink-0 p-0'>
          <span className='sr-only'>Close menu</span>
          <Icon name='X' decorative size='md' />
        </Button>
      </div>
      <div className='flow-root'>
        <nav aria-label='Mobile preview' className='-my-6 divide-y divide-gray-500/10'>
          <div className='space-y-2 pb-6'>
            <Link href='/blog' className='-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-blue-950 hover:bg-blue-50 hover:text-blue-900 dark:text-white dark:hover:text-blue-900'>Blog</Link>
            <div className='-mx-3'>
              <div className='mt-2 space-y-2'>
                {categories.map((category) => (
                  <Link key={ category.id } href={ `/blog/categories/${category.id}` } className='group block rounded-lg py-2 pl-6 pr-3 text-sm font-medium capitalize leading-7 text-blue-950 hover:bg-blue-50 hover:text-blue-900 dark:text-white dark:hover:text-blue-900'>
                    {category.title.replace('-', ' ')}
                    <span className='mt-1 block text-sm font-light leading-6 text-gray-600 group-hover:text-blue-800 dark:text-gray-100 dark:group-hover:text-blue-800'>{category.description}</span>
                  </Link>
                ))}
              </div>
            </div>
            {links.slice(1).map((link) => (
              <Link key={ link.href } href={ link.href } className='-mx-3 block whitespace-nowrap rounded-lg px-3 py-2 text-base font-medium leading-7 text-blue-950 hover:bg-blue-50 hover:text-blue-900 dark:text-white dark:hover:text-blue-900'>{link.title}</Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

const NavigationMenuDemo = () => (
  <HeaderSurface label='Standalone navigation menu'>
    <div className='min-h-96 p-6'>
      <p className='mb-4 text-sm text-gray-600 dark:text-gray-300'>
        Click <InlineCode>Blog</InlineCode> to inspect the dropdown menu in isolation.
      </p>
      <nav aria-label='Navigation menu demo'>
        <ul className='flex items-center gap-5'>
          <MenuMain categories={ categories } allPosts={ posts } />
        </ul>
      </nav>
    </div>
  </HeaderSurface>
);

const ResponsiveHeaderDemo = () => {
  const [ mobileOpen, setMobileOpen ] = useState(true);

  return (
    <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]'>
      <HeaderSurface label='Desktop header'>
        <HeaderRow />
      </HeaderSurface>
      <HeaderSurface label='Mobile header'>
        <div className='space-y-4'>
          <HeaderRow mobile onMenuClick={ () => setMobileOpen((open) => !open) } />
          {mobileOpen ? <MobilePanelPreview /> : null}
        </div>
      </HeaderSurface>
    </div>
  );
};

const StickyHeaderDemo = () => {
  const [ visible, setVisible ] = useState(true);
  const lastScrollTopRef = useRef(0);

  const handleScroll = (event) => {
    const nextScrollTop = event.currentTarget.scrollTop;

    setVisible(nextScrollTop < lastScrollTopRef.current || nextScrollTop < 24);
    lastScrollTopRef.current = nextScrollTop;
  };

  return (
    <div className='rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950'>
      <div className='border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400'>
        Scroll down, then scroll up
      </div>
      <div className='h-[420px] overflow-y-auto' onScroll={ handleScroll }>
        <header
          className={ `sticky top-0 z-10 border-b border-gray-200 bg-white/95 px-5 py-3 shadow-sm backdrop-blur transition-transform duration-200 dark:border-gray-800 dark:bg-gray-950/95 ${visible ? 'translate-y-0' : '-translate-y-full'}` }
        >
          <div className='flex items-center justify-between gap-4'>
            <Link href='/' aria-label='Ahmad Assaf' variant='bare' className='text-gray-950 dark:text-white'>
              <MenuLogo className='h-10 w-10' />
            </Link>
            <nav aria-label='Sticky demo navigation' className='hidden items-center gap-5 md:flex'>
              {links.slice(0, 4).map((link) => (
                <Link key={ link.href } href={ link.href } className='text-sm font-medium'>{link.title}</Link>
              ))}
            </nav>
            <MenuSearch className='hidden md:block' setOpen={ () => {} } />
          </div>
        </header>
        <article className='space-y-8 px-6 py-8'>
          {Array.from({ 'length': 8 }).map((_, index) => (
            <section key={ index } className='space-y-2'>
              <Typography as='h3' variant='heading-sm'>Editorial section {index + 1}</Typography>
              <p className='max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300'>
                This scroll area demonstrates the header behavior used for long reading surfaces: the header moves away while the reader moves down and returns as soon as the reader scrolls back up.
              </p>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
};

const NavigationDocs = () => (
  <Page
    title='Navigation'
    intro='Navigation is documented as one composed header system: logo, primary links, blog menu, search trigger, mobile drawer, and scroll-aware sticky behavior.'
  >
    <Section title='Header Composition' description='Use the top-level header composition in product surfaces. Low-level pieces remain exported for the header implementation, but they are not separate documentation destinations.'>
      <Table>
        <thead>
          <tr><Th>Piece</Th><Th>Use</Th><Th>Notes</Th></tr>
        </thead>
        <tbody>
          <tr><Td mono>Menu</Td><Td>Complete site header composition.</Td><Td>Preferred public entry point for the production navigation shell.</Td></tr>
          <tr><Td mono>MenuLogo</Td><Td>Brand mark at the start of the header.</Td><Td>Wrap it in a home link with an accessible label.</Td></tr>
          <tr><Td mono>DropDown</Td><Td>Disclosure trigger used by navigation menus.</Td><Td>Low-level public primitive; wire it to a labelled controlled panel.</Td></tr>
          <tr><Td mono>MenuMain</Td><Td>Primary blog navigation menu.</Td><Td>Show it on desktop next to top-level links. The dropdown clamps left, center, or right so it stays visible near viewport edges.</Td></tr>
          <tr><Td mono>MenuSearch</Td><Td>Visible command launcher trigger.</Td><Td>Do not add a second shortcut hint beside it.</Td></tr>
          <tr><Td mono>MenuMobile</Td><Td>Mobile drawer implementation.</Td><Td>Open it from the compact header menu button.</Td></tr>
          <tr><Td mono>FloatingMenu</Td><Td>Scroll-up sticky navigation pattern.</Td><Td>Use on long pages when persistent navigation should stay out of the reading path.</Td></tr>
        </tbody>
      </Table>
    </Section>

    <Section title='Usage' description='Use the exported Menu composition. SiteConfigProvider supplies identity and top-level links; Menu receives the searchable content collections.'>
      <CodeBlock code={ usageCode } language='jsx' />
    </Section>

    <Section title='Navigation Menu' description='The blog menu can be inspected on its own without the full header chrome.'>
      <NavigationMenuDemo />
    </Section>

    <Section title='Responsive Header' description='Desktop shows logo, top-level links, blog menu, and search. Mobile keeps the header compact and moves navigation into the drawer without repeating search.'>
      <ResponsiveHeaderDemo />
    </Section>

    <Section title='Sticky On Scroll Up' description='Long pages can use a scroll-aware header: hide while moving down, reveal immediately when moving up.'>
      <StickyHeaderDemo />
      <div className='mt-5'>
        <CodeBlock code={ stickyCode } language='jsx' />
      </div>
    </Section>
  </Page>
);

export default {
  id: 'navigation-overview',
  parameters: pageParameters,
  tags: [ '!autodocs' ],
  title: 'Navigation'
};

export const Default = {
  name: 'Overview',
  'render': () => <NavigationDocs />
};
