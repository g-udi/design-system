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

export const Playground = {
  args: { links: primaryLinks },
  parameters: {
    docs: { source: playgroundSource('FloatingMenu', { imports: "import { FloatingMenu } from '@gaudi/design-system';" }) }
  },
  render: (args) => <FloatingMenu {...args} />,
  play: async ({ args, canvasElement }) => {
    const button = backToTop(canvasElement);
    const menu = button.parentElement;
    const originalScrollTo = window.scrollTo;
    await expect(linkNames(canvasElement)).toEqual(args.links.map((link) => link.title));
    await expect(menu).toHaveAttribute('aria-hidden', 'true');

    await scrollWindowTo(200);
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
    await scrollWindowTo(120);
    await waitFor(() => expect(menu).toHaveAttribute('aria-hidden', 'false'));

    window.scrollTo = fn();
    try {
      await userEvent.click(button);
      await expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    } finally {
      window.scrollTo = originalScrollTo;
      await scrollWindowTo(0);
    }
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
  }
};

export const SiteConfigLinks = {
  parameters: { docs: { description: { story: 'Without `links`, the menu reads `navigation.links` from SiteConfig. It stays hidden until the reader scrolls back up.' } } },
  render: () => <FloatingMenu />,
  play: async ({ canvasElement }) => {
    await expect(linkNames(canvasElement)).toEqual(navigationMetadata.links.map((link) => link.title));
  }
};
