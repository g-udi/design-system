import { expect, userEvent, waitFor, within } from 'storybook/test';
import { LiquidEther } from '../index.js';
import { checkLiquidEther } from '../../../../../tests/components/animations/LiquidEther/checkLiquidEther.jsx';
import { LiquidEtherPlayground } from './fixtures/LiquidEtherExamples.jsx';
import examplesRaw from './fixtures/LiquidEtherExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Animations/Backgrounds/LiquidEther');
const imports = backgroundDemoSource(examplesRaw, new URL('./fixtures/LiquidEtherExamples.jsx', import.meta.url));

export default {
  title: 'Animations/Backgrounds/LiquidEther',
  id: 'animations-backgrounds-liquid-ether',
  component: LiquidEther,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'text', interactive: 'boolean', height: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { paused: false, speed: 1, intensity: 1, scale: 1, interactive: true, height: 500 },
  render: LiquidEtherPlayground,
  parameters: { docs: { source: playgroundSource('LiquidEtherPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="liquid-ether"]');
    await expect(effect).toBeVisible();
    await expect(effect.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await expect(canvas.getByRole('button', { name: 'Pause animation' })).toBeVisible();
    await waitFor(() => expect(effect).not.toHaveAttribute('data-renderer', 'loading'));
    if (effect.dataset.renderer === 'webgl' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'true'));
      await checkLiquidEther(effect);
    }
    await checkBackgroundDemo(context);
  }
};
