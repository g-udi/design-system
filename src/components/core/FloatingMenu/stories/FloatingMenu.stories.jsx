import { useRef } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { primaryLinks } from '../../../../docs/fixtures/site/navigationContent';
import Button from '../../Button';
import FloatingMenu from '../FloatingMenu';

const docs = getComponentDocs('Core/FloatingMenu');
const paragraphs = [
  'Design systems earn their keep on the pages nobody planned for. A component that holds up on the homepage has to hold up again three screens down an essay, on a phone, with a reader who just wants to get back to the index.',
  'The floating menu is that way back. It waits until the header has scrolled out of sight, then offers the same destinations in a compact pill without asking the reader to scroll all the way up again.',
  'Because it repeats the site navigation, it stays out of the way: it hides while the reader moves down through the text and returns as soon as they scroll back up, which is the moment they are looking for somewhere else to go.',
  'Keyboard users reach it from anywhere. The pill is always a labelled navigation landmark in the tab order, and focusing one of its links slides it into view.',
  'Reduced motion turns the slide into an instant change and makes Back to top jump rather than glide.'
];

// A framed article page that scrolls inside the canvas. The menu is the frame's first child and sticks to
// its top, observing the frame instead of the window.
function ScrollPage({ height = 'h-[26rem]', ...args }) {
  const pageRef = useRef(null);
  return (
    <div ref={pageRef} data-testid='scroll-page' tabIndex={-1} className={`relative ${height} overflow-y-auto rounded-card border border-border bg-surface`}>
      <FloatingMenu {...args} targetRef={pageRef} position='sticky' />
      <header className='flex items-center justify-between gap-3 border-b border-border px-4 py-3'>
        <span className='text-sm font-semibold text-text'>Field notes</span>
        <span className='text-xs text-text-muted'>Scroll this page</span>
      </header>
      <article className='mx-auto grid max-w-xl gap-4 px-4 py-6 text-sm leading-7 text-text-muted'>
        <h3 className='m-0 text-xl font-semibold text-text'>Navigation that waits its turn</h3>
        {[...paragraphs, ...paragraphs].map((text, index) => <p key={index} className='m-0'>{text}</p>)}
      </article>
    </div>
  );
}

const page = (canvasElement) => within(canvasElement).getByTestId('scroll-page');
const menu = (canvasElement) => within(canvasElement).getByRole('navigation', { name: 'Quick navigation' });
const scrollPageTo = async (canvasElement, top) => {
  const element = page(canvasElement);
  element.scrollTop = top;
  element.dispatchEvent(new Event('scroll'));
  await new Promise((resolve) => window.setTimeout(resolve, 40));
};
const expectState = (canvasElement, state) => waitFor(() => expect(menu(canvasElement)).toHaveAttribute('data-state', state));

const usage = (attributes = '') => `import { useRef } from 'react';
import { Button, FloatingMenu } from '@gaudi/design-system';

const links = ${JSON.stringify(primaryLinks, null, 2)};

export default function ArticleNavigation() {
  const pageRef = useRef(null);
  return (
    <div ref={pageRef} className='h-96 overflow-y-auto'>
      <FloatingMenu targetRef={pageRef} position='sticky' links={links}${attributes} />
      <article>Article content goes here.</article>
    </div>
  );
}`;

export default {
  title: 'Core/Navigation/FloatingMenu',
  id: 'core-floatingmenu',
  component: FloatingMenu,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { links: 'object', revealOn: ['scroll-up', 'scroll'], threshold: 'number', backToTop: 'boolean', label: 'text' }),
  args: { links: primaryLinks, currentPath: '/blog/projects', revealOn: 'scroll-up', threshold: 50, backToTop: true, label: 'Quick navigation' },
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  render: (args) => <ScrollPage {...args} />
};

export const Playground = {
  parameters: {
    docs: {
      description: { story: 'Scroll the framed article down, then back up: the pill appears once the page is past `threshold` and the reader moves up, and hides again on the way down. Projects is the current page. In an app, `LayoutContainer` renders it fixed over the window with SiteConfig `navigation.links`.' },
      source: { code: usage(), language: 'jsx' }
    }
  },
  play: async ({ args, canvasElement }) => {
    const nav = menu(canvasElement);
    await expectState(canvasElement, 'hidden');
    await expect(within(nav).getAllByRole('link').map((link) => link.textContent)).toEqual(args.links.map((link) => link.title));
    await expect(within(nav).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');

    await scrollPageTo(canvasElement, 600);
    await expectState(canvasElement, 'hidden');
    await scrollPageTo(canvasElement, 480);
    await expectState(canvasElement, 'visible');
    await scrollPageTo(canvasElement, 20);
    await expectState(canvasElement, 'hidden');

    // Back to top scrolls the observed container.
    await scrollPageTo(canvasElement, 600);
    await scrollPageTo(canvasElement, 480);
    const element = page(canvasElement);
    const original = element.scrollTo;
    element.scrollTo = fn();
    try {
      await userEvent.click(within(nav).getByRole('button', { name: 'Back to top' }));
      await expect(element.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    } finally {
      element.scrollTo = original;
    }
    await expectState(canvasElement, 'visible');
  }
};

export const RevealPastThreshold = {
  args: { revealOn: 'scroll', threshold: 120 },
  parameters: {
    docs: {
      description: { story: "`revealOn='scroll'` keeps the pill visible whenever the page is past `threshold` (here 120px), whichever way the reader scrolls. Use it for long reference pages where the destinations are always useful." },
      source: { code: usage(" revealOn='scroll' threshold={120}"), language: 'jsx' }
    }
  },
  play: async ({ canvasElement }) => {
    await expectState(canvasElement, 'hidden');
    await scrollPageTo(canvasElement, 400);
    await expectState(canvasElement, 'visible');
    await scrollPageTo(canvasElement, 600);
    await expectState(canvasElement, 'visible');
    await scrollPageTo(canvasElement, 60);
    await expectState(canvasElement, 'hidden');
    await scrollPageTo(canvasElement, 400);
    await expectState(canvasElement, 'visible');
  }
};

export const WithCallToAction = {
  args: {
    revealOn: 'scroll',
    backToTop: false
  },
  render: (args) => <ScrollPage {...args} actions={<Button href='/subscribe' size='sm' className='h-10 rounded-control bg-surface px-3 text-text hover:bg-surface/90'>Subscribe</Button>} />,
  parameters: {
    docs: {
      description: { story: '`actions` adds controls after the links, such as a Subscribe call to action; `backToTop={false}` drops the Back to top button. Keep actions short so the pill fits on a phone.' },
      source: { code: usage(" revealOn='scroll' backToTop={false} actions={<Button href='/subscribe' size='sm'>Subscribe</Button>}"), language: 'jsx' }
    }
  },
  play: async ({ canvasElement }) => {
    const nav = menu(canvasElement);
    await expect(within(nav).queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument();
    await scrollPageTo(canvasElement, 400);
    await expectState(canvasElement, 'visible');
    await expect(within(nav).getByRole('link', { name: 'Subscribe' })).toBeVisible();
    await expect(within(nav).getByRole('link', { name: 'Subscribe' })).toHaveAttribute('href', '/subscribe');
  }
};

export const KeyboardReveal = {
  parameters: {
    docs: {
      description: { story: 'The hidden pill stays in the tab order: tabbing into it slides it into view, and it hides again once focus leaves while the page is at the top.' },
      source: { code: usage(), language: 'jsx' }
    }
  },
  play: async ({ canvasElement }) => {
    await expectState(canvasElement, 'hidden');
    page(canvasElement).focus();
    await userEvent.tab();
    await expect(within(menu(canvasElement)).getAllByRole('link')[0]).toHaveFocus();
    await expectState(canvasElement, 'visible');
    page(canvasElement).focus();
    await expectState(canvasElement, 'hidden');
  }
};
