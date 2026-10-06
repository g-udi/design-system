import { checkBackgroundRendering } from '../../../../../tests/components/animations/checkBackgroundRendering.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { GridScan } from '../index.js';
import { GridScanPlayground } from './fixtures/GridScanExamples.jsx';
import examplesRaw from './fixtures/GridScanExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Animations/Backgrounds/GridScan');
const imports = backgroundDemoSource(examplesRaw, new URL('./fixtures/GridScanExamples.jsx', import.meta.url));

export default {
  title: 'Animations/Backgrounds/GridScan',
  id: 'animations-backgrounds-grid-scan',
  component: GridScan,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { lineWidth: 'number', scanWidth: 'number', scanGlow: 'number', paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'text', interactive: 'boolean', height: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { lineWidth: 1, scanWidth: 1.4, scanGlow: 1, paused: false, speed: 1, intensity: 1, scale: 1, interactive: true, height: 500 },
  render: GridScanPlayground,
  parameters: { docs: { source: playgroundSource('GridScanPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="grid-scan"]');
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
    await checkBackgroundRendering(canvasElement, GridScan, {"lineWidth": 3, "scanGlow": 2});
    await checkBackgroundDemo(context);
  }
};
