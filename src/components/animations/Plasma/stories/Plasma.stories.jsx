import { checkBackgroundRendering } from '../../../../../tests/components/animations/checkBackgroundRendering.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Plasma } from '../index.js';
import { PlasmaPlayground } from './fixtures/PlasmaExamples.jsx';
import examplesRaw from './fixtures/PlasmaExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Animations/Backgrounds/Plasma');
const imports = backgroundDemoSource(examplesRaw, new URL('./fixtures/PlasmaExamples.jsx', import.meta.url));

export default {
  title: 'Animations/Backgrounds/Plasma',
  id: 'animations-backgrounds-plasma',
  component: Plasma,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { direction: ['forward', 'reverse'], turbulence: 'number', paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'text', interactive: 'boolean', height: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { direction: "forward", turbulence: 1, paused: false, speed: 1, intensity: 1, scale: 1, interactive: true, height: 500 },
  render: PlasmaPlayground,
  parameters: { docs: { source: playgroundSource('PlasmaPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="plasma"]');
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
    await checkBackgroundRendering(canvasElement, Plasma, {"turbulence": 0});
    await checkBackgroundDemo(context);
  }
};
