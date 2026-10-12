import { checkBackgroundRendering } from '../../../../../tests/components/animations/checkBackgroundRendering.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { MicroSlats } from '../index.js';
import { MicroSlatsPlayground } from './fixtures/MicroSlatsExamples.jsx';
import examplesRaw from './fixtures/MicroSlatsExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { checkBackgroundBehavior } from '../../../../../tests/components/animations/backgroundBehavior.jsx';

const docs = getComponentDocs('Animations/Backgrounds/MicroSlats');
const imports = backgroundDemoSource(examplesRaw, new URL('./fixtures/MicroSlatsExamples.jsx', import.meta.url));

export default {
  title: 'Animations/Backgrounds/MicroSlats',
  id: 'animations-backgrounds-micro-slats',
  component: MicroSlats,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'color', interactive: 'boolean', height: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { paused: false, speed: 0.6, intensity: 1, scale: 1, interactive: true, height: 500 },
  render: MicroSlatsPlayground,
  parameters: { docs: { source: playgroundSource('MicroSlatsPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement, args } = context;
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="micro-slats"]');
    await expect(effect).toBeVisible();
    await expect(effect.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
    await waitFor(() => expect(effect.getAttribute('data-renderer')).toMatch(/^(webgl|fallback)$/));
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await expect(canvas.getByRole('button', { name: 'Pause animation' })).toBeEnabled();
    if (effect.dataset.renderer === 'webgl' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'true'));
    }
    if (Object.entries(Playground.args).every(([name, value]) => args[name] === value)) {
      await expect(effect).toHaveAttribute('data-renderer', 'webgl');
      await checkBackgroundBehavior(canvasElement);
    }
    await checkBackgroundRendering(canvasElement, MicroSlats);
    await checkBackgroundDemo(context);
  }
};
