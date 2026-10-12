import { checkBackgroundRendering } from '../../../../../tests/components/animations/checkBackgroundRendering.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DarkVeil } from '../index.js';
import { DarkVeilPlayground } from './fixtures/DarkVeilExamples.jsx';
import examplesRaw from './fixtures/DarkVeilExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Animations/Backgrounds/DarkVeil');
const imports = backgroundDemoSource(examplesRaw, new URL('./fixtures/DarkVeilExamples.jsx', import.meta.url));

export default {
  title: 'Animations/Backgrounds/DarkVeil',
  id: 'animations-backgrounds-dark-veil',
  component: DarkVeil,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'color', interactive: 'boolean', height: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { paused: false, speed: 1, intensity: 1, scale: 1, interactive: false, height: 500 },
  render: DarkVeilPlayground,
  parameters: { docs: { source: playgroundSource('DarkVeilPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="dark-veil"]');
    await expect(effect).toBeVisible();
    await expect(effect.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
    await waitFor(() => expect(effect).toHaveAttribute('data-renderer', 'webgl'));
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await expect(canvas.getByRole('button', { name: 'Pause animation' })).toBeVisible();
    const canAnimate = effect.dataset.renderer === 'webgl' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', String(canAnimate)));
    await checkBackgroundRendering(canvasElement, DarkVeil);
    await checkBackgroundDemo(context);
  }
};
