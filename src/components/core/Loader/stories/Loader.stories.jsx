import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { PlaygroundDemo, LoaderVariants } from './fixtures/NativeExamples.jsx';
import nativeSource from './fixtures/NativeExamples.jsx?raw';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Loader, { loaderVariants } from '../index.js';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Core/Loader');
const pixels = { xs: 12, sm: 16, md: 20, lg: 32 };
const sizes = Object.keys(pixels);
const saving = 'Saving draft';
const statuses = (canvasElement, name) => within(canvasElement).getAllByRole('status', { name });
// The computed width ignores the spin transform, which inflates the bounding box mid-rotation.
const width = (element) => Number.parseFloat(getComputedStyle(element).width);

export default {
  title: 'Core/Loader',
  id: 'core-loader',
  component: Loader,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { size: sizes, label: 'text', variant: loaderVariants }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { size: 'lg', label: 'Publishing article', variant: 'arc' },
  parameters: {
    docs: {
      description: { story: 'A publish queue: the running task follows `variant`, `size`, and `label`, a queued link check uses a small muted loader, and a busy button carries an `xs` loader beside its text.' },
      source: playgroundSource('PlaygroundDemo', { imports: publicSource(nativeSource, new URL('./fixtures/NativeExamples.jsx', import.meta.url)) })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-md'><Story /></ExampleFrame>],
  render: (args) => <PlaygroundDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [loader] = statuses(canvasElement, args.label);
    await expect([...loader.querySelectorAll('.ds-loader-motion')].some(part => getComputedStyle(part).animationName !== 'none') || getComputedStyle(loader).animationName !== 'none').toBe(true);
    await expect(width(loader)).toBe(pixels[args.size] * (args.variant === 'bar' ? 3 : 1));
    await expect(canvas.getByText(args.label)).toBeVisible();
    const button = canvas.getByRole('button', { name: new RegExp(saving) });
    await expect(button).toBeDisabled();
    await expect(within(button).getByRole('status', { name: saving })).toBeInTheDocument();
  }
};

export const Variants = {
  name: 'Animation variants',
  parameters: { docs: { source: playgroundSource('LoaderVariants', { imports: publicSource(nativeSource, new URL('./fixtures/NativeExamples.jsx', import.meta.url)) }) } },
  render: () => <LoaderVariants />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('status')).toHaveLength(loaderVariants.length);
    for (const variant of loaderVariants) {
      const loader = canvas.getByRole('status', { name: `${variant} loading example` });
      await expect(loader).toBeVisible();
      await expect(width(loader)).toBe(variant === 'bar' ? 96 : 32);
      await expect(Number.parseFloat(getComputedStyle(loader).height)).toBe(32);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        for (const part of loader.querySelectorAll('.ds-loader-motion')) {
          await expect(getComputedStyle(part).animationName).toBe('none');
        }
        await expect(getComputedStyle(loader).animationName).toBe('ds-loading-breathe');
        await expect(getComputedStyle(loader).animationDuration).toBe('2.4s');
      }
      if (variant === 'circle-dots') {
        const bounds = loader.getBoundingClientRect();
        for (const dot of loader.querySelectorAll('circle')) {
          const point = dot.getBoundingClientRect();
          await expect(point.left).toBeGreaterThanOrEqual(bounds.left);
          await expect(point.right).toBeLessThanOrEqual(bounds.right);
          await expect(point.top).toBeGreaterThanOrEqual(bounds.top);
          await expect(point.bottom).toBeLessThanOrEqual(bounds.bottom);
        }
      }
    }
  }
};
