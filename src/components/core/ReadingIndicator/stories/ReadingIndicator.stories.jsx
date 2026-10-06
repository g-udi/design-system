import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ReadingIndicator } from '../index.js';
import { ReadingPlayground, ReadingStyles, ArticleRange, PageReading } from './fixtures/ReadingExamples.jsx';
import examplesRaw from './fixtures/ReadingExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { checkReadingUpdates } from '../../../../../tests/components/core/ReadingIndicator/checkReadingUpdates.jsx';

const docs = getComponentDocs('Core/ReadingIndicator');
const imports = publicSource(examplesRaw, new URL('./fixtures/ReadingExamples.jsx', import.meta.url));
const source = name => playgroundSource(name, { imports });
const checkScroll = async canvasElement => {
  const canvas = within(canvasElement);
  const viewport = canvasElement.querySelector('[data-slot="scroll-area-viewport"]');
  const meters = canvas.getAllByRole('progressbar');
  const scroll = async fraction => {
    viewport.scrollTo({ top: fraction * (viewport.scrollHeight - viewport.clientHeight), behavior: 'instant' });
    await waitFor(() => meters.forEach(meter => expect(Math.abs(Number(meter.getAttribute('aria-valuenow')) - fraction * 100)).toBeLessThan(1)));
  };
  await scroll(0);
  await scroll(0.5);
  await scroll(1);
  await scroll(0);
};

export default {
  title: 'Core/ReadingIndicator', id: 'core-readingindicator', component: ReadingIndicator, tags: ['autodocs'],
  argTypes: {
    ...docsArgTypes(docs, { variant: ['bar', 'ruler', 'ring'], tone: ['accent', 'neutral'], showValue: 'boolean', label: 'text', draggable: 'boolean' }),
    draggable: { ...docsArgTypes(docs, { draggable: 'boolean' }).draggable, if: { arg: 'variant', eq: 'ring' } }
  },
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { variant: 'bar', tone: 'accent', showValue: true, label: 'Reading progress', draggable: false },
  parameters: { docs: { source: source('ReadingPlayground'), description: { story: 'A contained article for trying each style. In a real page, omit targetRef and use the default fixed position.' } }, controlAudit: { interaction: ['draggable'] } },
  render: ReadingPlayground,
  play: async ({ canvasElement }) => { await checkScroll(canvasElement); await checkReadingUpdates(canvasElement); }
};

export const Styles = {
  name: 'Bar, ruler and ring',
  parameters: { docs: { source: source('ReadingStyles'), description: { story: 'Compare the three indicators against the same reading range. The ring includes a bounded drag handle with equivalent keyboard movement.' } } },
  render: () => <ReadingStyles />,
  play: async ({ canvasElement }) => {
    await checkScroll(canvasElement);
    const handle = within(canvasElement).getByRole('button', { name: 'Move reading indicator' });
    const ring = handle.closest('[data-slot="reading-indicator"]');
    const before = ring.getBoundingClientRect().left;
    handle.focus();
    await userEvent.keyboard('{ArrowLeft}{ArrowUp}');
    await waitFor(() => expect(ring.getBoundingClientRect().left).toBeLessThan(before - 5));
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(Math.abs(ring.getBoundingClientRect().left - before)).toBeLessThan(1));
    handle.blur();
  }
};

export const Article = {
  name: 'Article range',
  parameters: { docs: { source: source('ArticleRange'), description: { story: 'Measure the article instead of the whole scroll area. Related content after it does not extend the reading range.' } } },
  render: () => <ArticleRange />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByRole('progressbar');
    await expect(meter).toHaveAttribute('aria-valuenow', '0');
    await userEvent.click(canvas.getByRole('button', { name: 'Skip to related notes' }));
    await waitFor(() => expect(meter).toHaveAttribute('aria-valuenow', '100'));
    await userEvent.click(canvas.getByRole('button', { name: 'Start again' }));
    await waitFor(() => expect(meter).toHaveAttribute('aria-valuenow', '0'));
  }
};

export const Page = {
  name: 'Top of page',
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, height: 480 }, source: source('PageReading'), description: { story: 'The classic document-wide progress line. This preview uses its own frame so scrolling other Docs examples does not affect it.' } } },
  render: () => <PageReading />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('progressbar');
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    await waitFor(() => expect(meter).toHaveAttribute('aria-valuenow', '100'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
};
