import { expect, userEvent, waitFor, within } from 'storybook/test';
import { GradientWaves } from '../index.js';
import { GradientWavesPlayground } from './fixtures/GradientWavesExamples.jsx';
import examplesRaw from './fixtures/GradientWavesExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Animations/Backgrounds/GradientWaves');
const imports = backgroundDemoSource(examplesRaw, new URL('./fixtures/GradientWavesExamples.jsx', import.meta.url));

export default {
  title: 'Animations/Backgrounds/GradientWaves',
  id: 'animations-backgrounds-gradient-waves',
  component: GradientWaves,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'text', interactive: 'boolean', height: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { paused: false, speed: 1, intensity: 1, scale: 1, interactive: true, height: 500 },
  render: GradientWavesPlayground,
  parameters: { docs: { source: playgroundSource('GradientWavesPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="gradient-waves"]');
    await expect(effect).toBeVisible();
    await expect(effect.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await expect(canvas.getByRole('button', { name: 'Pause animation' })).toBeVisible();
    await waitFor(() => expect(effect).not.toHaveAttribute('data-renderer', 'loading'));
    if (effect.dataset.renderer === 'webgl' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'true'));
    }
    await checkBackgroundDemo(context);
  }
};
