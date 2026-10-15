import { checkBackgroundRendering } from '../../../../../tests/components/animations/checkBackgroundRendering.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';
import Borealis from '../index.js';
import { BorealisPlayground } from './fixtures/BorealisExamples.jsx';
import source from './fixtures/BorealisExamples.jsx?raw';

const docs = getComponentDocs('Animations/Backgrounds/Aurora');
const imports = backgroundDemoSource(source, new URL('./fixtures/BorealisExamples.jsx', import.meta.url));
export default {
  title: 'Animations/Backgrounds/Aurora', id: 'layout-borealis', component: Borealis, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { variant: ['aurora', 'soft'], amplitude: 'number', blend: 'number', fadeEdges: 'boolean', paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'text', transparent: 'boolean', mask: ['bottom', 'edges', 'text', 'none'], height: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => BorealisSurface }) } }
};
export const BorealisSurface = {
  name: 'Aurora', args: { variant: 'aurora', amplitude: 1, blend: 0.5, fadeEdges: true, paused: false, height: 500, speed: 1, intensity: 1, scale: 1 }, render: BorealisPlayground,
  parameters: { __id: 'layout-components--borealis-surface', docs: { source: playgroundSource('BorealisPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Make room for your next idea.' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(canvasElement.querySelector('.borealis')).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await expect(canvas.getByRole('button', { name: 'Pause animation' })).toBeVisible();
    await checkBackgroundRendering(canvasElement, Borealis, { variant: 'soft', amplitude: 0, blend: 1, fadeEdges: false });
    await checkBackgroundDemo(context);
  }
};

export const SoftAurora = {
  name: 'Soft Aurora',
  args: { ...BorealisSurface.args, variant: 'soft', fadeEdges: false },
  render: BorealisPlayground,
  parameters: { docs: { source: playgroundSource('BorealisPlayground', { imports }) } },
  play: async context => {
    await checkBackgroundRendering(context.canvasElement, Borealis, { amplitude: 0, blend: 1 }, { variant: 'soft' });
    await checkBackgroundDemo(context);
  }
};
