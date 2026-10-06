import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ShapeWaves } from '../index.js';
import { ShapeWavesPlayground } from './fixtures/ShapeWavesExamples.jsx';
import examplesRaw from './fixtures/ShapeWavesExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Animations/Backgrounds/ShapeWaves');
const imports = backgroundDemoSource(examplesRaw, new URL('./fixtures/ShapeWavesExamples.jsx', import.meta.url));

export default {
  title: 'Animations/Backgrounds/ShapeWaves',
  id: 'animations-backgrounds-shape-waves',
  component: ShapeWaves,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'color', interactive: 'boolean', height: 'number', text: 'text', textSize: 'number', cellSize: 'number', dotSize: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { paused: false, speed: 1, intensity: 1, scale: 1, interactive: true, height: 500, text: '', textSize: 0.6, cellSize: 10, dotSize: 0.75 },
  render: ShapeWavesPlayground,
  parameters: { docs: { source: playgroundSource('ShapeWavesPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="shape-waves"]');
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
    await checkBackgroundDemo(context);
  }
};
