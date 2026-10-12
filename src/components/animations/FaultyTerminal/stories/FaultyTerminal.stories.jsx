import { checkBackgroundRendering } from '../../../../../tests/components/animations/checkBackgroundRendering.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { FaultyTerminal } from '../index.js';
import { FaultyTerminalPlayground } from './fixtures/FaultyTerminalExamples.jsx';
import examplesRaw from './fixtures/FaultyTerminalExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Animations/Backgrounds/FaultyTerminal');
const imports = backgroundDemoSource(examplesRaw, new URL('./fixtures/FaultyTerminalExamples.jsx', import.meta.url));

export default {
  title: 'Animations/Backgrounds/FaultyTerminal',
  id: 'animations-backgrounds-faulty-terminal',
  component: FaultyTerminal,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { digitSize: 'number', curvature: 'number', scanlines: 'number', glitch: 'number', paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'text', interactive: 'boolean', height: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { digitSize: 1, curvature: 0.1, scanlines: 0.5, glitch: 1, paused: false, speed: 1, intensity: 1, scale: 1, interactive: true, height: 500 },
  render: FaultyTerminalPlayground,
  parameters: { docs: { source: playgroundSource('FaultyTerminalPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="faulty-terminal"]');
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
    await checkBackgroundRendering(canvasElement, FaultyTerminal, { digitSize: 2.5, curvature: 0.8, scanlines: 0, glitch: 0 });
    await checkBackgroundDemo(context);
  }
};
