import { PlaygroundDemo, exampleDefaults } from './fixtures/NativeExamples.jsx';
import { checkScrollAreaResize } from './fixtures/checkScrollAreaResize.jsx';
import { checkSmoothScrollLifecycle } from './fixtures/checkSmoothScroll.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ScrollArea } from '../index.js';
import { SmoothReadingDemo } from './fixtures/SmoothReadingDemo.jsx';
import smoothSource from './fixtures/SmoothReadingDemo.jsx?raw';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Core/ScrollArea');
// A changelog feed: a sticky header over releases that mix features, fixes, and breaking changes.

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Layout & Containers/ScrollArea',
  id: 'core-scrollarea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: ['hover', 'auto', 'always', 'scroll'], smooth: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const SmoothReading = {
  name: 'Smooth blog reading',
  args: { smooth: true, type: 'always' },
  parameters: { docs: {
    description: { story: 'The planned main content area for migrated blog posts: smooth wheel scrolling, native touch and keyboard behavior, real heading links, a nested scroll region, and a ReadingIndicator sharing the viewport ref.' },
    source: playgroundSource('SmoothReadingDemo', { imports: publicSource(smoothSource, new URL('./fixtures/SmoothReadingDemo.jsx', import.meta.url)) })
  } },
  render: args => <SmoothReadingDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvas.getByRole('region', { name: 'Blog post content' });
    const enhanced = args.smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    await waitFor(() => expect(viewport.classList.contains('lenis')).toBe(enhanced));
    try {
      const wheel = new WheelEvent('wheel', { deltaY: 280, bubbles: true, cancelable: true });
      viewport.dispatchEvent(wheel);
      await expect(wheel.defaultPrevented).toBe(enhanced);
      if (enhanced) await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0));
      else viewport.scrollTo({ top: 280, behavior: 'instant' });
      await waitFor(() => expect(Number(canvas.getByRole('progressbar', { name: 'Article reading progress' }).getAttribute('aria-valuenow'))).toBeGreaterThan(0));
      // Keyboard intent cancels wheel inertia without suppressing the native key.
      const key = new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true, cancelable: true });
      viewport.dispatchEvent(key);
      await expect(key.defaultPrevented).toBe(false);
      const list = canvas.getByRole('region', { name: 'Further reading list' });
      const nestedWheel = new WheelEvent('wheel', { deltaY: 40, bubbles: true, cancelable: true });
      list.querySelector('li').dispatchEvent(nestedWheel);
      await expect(nestedWheel.defaultPrevented).toBe(false);
      list.scrollTo({ top: 40 });
      await waitFor(() => expect(list.scrollTop).toBeGreaterThan(0));
      list.scrollTo({ top: 0 });
      await expect(canvas.getByRole('link', { name: 'Back to the first section' })).toHaveAttribute('href', expect.stringContaining('#'));
    } finally {
      viewport.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      viewport.scrollTo({ top: 0, behavior: 'instant' });
    }
    await checkSmoothScrollLifecycle(canvasElement);
  }
};

export const Playground = {
  args: { ...exampleDefaults },
  parameters: {
    docs: {
      description: { story: 'A changelog feed with a sticky header. `always` keeps the scrollbar visible, `auto` shows it while content overflows, and `hover` and `scroll` reveal it on pointer or scroll activity.' },
      source: playgroundSource('PlaygroundDemo', { imports: exampleSource })
    }
  },
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const viewport = within(canvasElement).getByRole('region', { name: args['aria-label'] });
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    const scrollbar = canvasElement.querySelector('[data-slot="scroll-area-scrollbar"]');
    if (args.type === 'always') await expect(scrollbar).toBeVisible();
    await userEvent.tab();
    await expect(viewport).toHaveFocus();
    viewport.scrollTo({ top: viewport.scrollHeight });
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0));
    await expect(within(viewport).getByText('Changelog')).toBeVisible();
    // Leave the preview at the newest release.
    viewport.scrollTo({ top: 0 });
    viewport.blur();
    await checkScrollAreaResize(canvasElement);
  }
};
