import { expect, userEvent, waitFor, within } from 'storybook/test';
import { PatternWaves } from '../index.js';
import { PatternWavesPlayground } from './fixtures/PatternWavesExamples.jsx';
import examplesRaw from './fixtures/PatternWavesExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Animations/Backgrounds/PatternWaves');
const imports = backgroundDemoSource(examplesRaw, new URL('./fixtures/PatternWavesExamples.jsx', import.meta.url));

export default {
  title: 'Animations/Backgrounds/PatternWaves',
  id: 'animations-backgrounds-pattern-waves',
  component: PatternWaves,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'color', interactive: 'boolean', height: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { paused: false, speed: 0.35, intensity: 1, scale: 1, interactive: true, height: 500 },
  render: PatternWavesPlayground,
  parameters: { docs: { source: playgroundSource('PatternWavesPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="pattern-waves"]');
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
