import { useEffect } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { primaryLinks } from '../../../../.storybook/fixtures/site/navigationContent';
import navigationMetadata from '../../../../.storybook/fixtures/site/navigationMetadata.mjs';
import FloatingMenu from './FloatingMenu';

const docs = getComponentDocs('Navigation/FloatingMenu');
const nextFrame = () => new Promise((resolve) => window.setTimeout(resolve, 25));
const scrollWindowTo = async (y) => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
  window.dispatchEvent(new Event('scroll'));
  await nextFrame();
};
const backToTop = (canvasElement) => within(canvasElement).getByRole('button', { name: 'Back to top', hidden: true });
const linkNames = (canvasElement) => within(canvasElement).getAllByRole('link', { hidden: true }).map((link) => link.textContent);

export default {
  title: 'Navigation/FloatingMenu',
  id: 'navigation-floatingmenu',
  component: FloatingMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  // A transformed box becomes the containing block for the fixed menu, so it stays inside the canvas.
  decorators: [(Story) => <div className='relative min-h-16 [transform:translateZ(0)]'><Story /></div>]
};

// Replays "scrolled down, then back up a little" once on mount so the pill starts visible, then hands
// scrolling back to the window: scrolling the page down hides it again, scrolling up brings it back.
function RevealedMenu(args) {
  useEffect(() => {
    const original = Object.getOwnPropertyDescriptor(window, 'scrollY');
    for (const y of [200, 120]) {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
      window.dispatchEvent(new Event('scroll'));
    }
    if (original) Object.defineProperty(window, 'scrollY', original);
    else delete window.scrollY;
  }, []);
  return (
    <>
      <FloatingMenu {...args} />
      <article aria-hidden='true' className='mx-auto max-w-xl space-y-2 px-4 pb-4 pt-20'>
        <div className='h-3 w-24 rounded-full bg-blue-100 dark:bg-blue-950' />
        <div className='h-5 w-4/5 rounded-full bg-gray-200 dark:bg-gray-800' />
        <div className='h-3 w-full rounded-full bg-gray-100 dark:bg-gray-900' />
        <div className='h-3 w-11/12 rounded-full bg-gray-100 dark:bg-gray-900' />
      </article>
    </>
  );
}

export const Playground = {
  args: { links: primaryLinks },
  parameters: {
    docs: {
      description: { story: 'The pill as a reader sees it after scrolling back up an article: every `links` destination plus Back to top. Scroll the page down and it hides; scroll up past 50px and it returns.' },
      source: playgroundSource('FloatingMenu', { imports: "import { FloatingMenu } from '@gaudi/design-system';" })
    }
  },
  render: (args) => <RevealedMenu key={JSON.stringify(args.links)} {...args} />,
  play: async ({ args, canvasElement }) => {
    const button = backToTop(canvasElement);
    const menu = button.parentElement;
    const originalScrollTo = window.scrollTo;
    const originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');
    await expect(linkNames(canvasElement)).toEqual(args.links.map((link) => link.title));
    await waitFor(() => expect(menu).toHaveAttribute('aria-hidden', 'false'));

    window.scrollTo = fn();
    try {
      await userEvent.click(button);
      await expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    } finally {
      window.scrollTo = originalScrollTo;
    }

    await scrollWindowTo(300);
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
    await scrollWindowTo(200);
    await waitFor(() => expect(menu).toHaveAttribute('aria-hidden', 'false'));
    await scrollWindowTo(0);
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
    // Leave the pill revealed, as the preview starts.
    await scrollWindowTo(200);
    await scrollWindowTo(120);
    await waitFor(() => expect(menu).toHaveAttribute('aria-hidden', 'false'));
    if (originalScrollY) Object.defineProperty(window, 'scrollY', originalScrollY);
  }
};

export const SiteConfigLinks = {
  parameters: { docs: { description: { story: 'Without `links`, the menu reads `navigation.links` from SiteConfig. It stays hidden until the reader scrolls back up.' } } },
  render: () => <FloatingMenu />,
  play: async ({ canvasElement }) => {
    await expect(linkNames(canvasElement)).toEqual(navigationMetadata.links.map((link) => link.title));
  }
};
