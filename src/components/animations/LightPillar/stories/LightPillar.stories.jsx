import { expect, userEvent, waitFor, within } from 'storybook/test';
import { LightPillar } from '../index.js';
import { LightPillarPlayground } from './fixtures/LightPillarExamples.jsx';
import examplesRaw from './fixtures/LightPillarExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { backgroundDemoSource } from '../../../../docs/fixtures/animations/backgroundDemoSource.js';
import { checkBackgroundDemo } from '../../../../../tests/components/animations/backgroundDemoBehavior.js';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Animations/Backgrounds/LightPillar');
const imports = backgroundDemoSource(examplesRaw, new URL('./fixtures/LightPillarExamples.jsx', import.meta.url));

export default {
  title: 'Animations/Backgrounds/LightPillar',
  id: 'animations-backgrounds-light-pillar',
  component: LightPillar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { paused: 'boolean', speed: 'number', intensity: 'number', scale: 'number', colors: 'object', background: 'color', interactive: 'boolean', height: 'number' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { paused: false, speed: 1, intensity: 1, scale: 1, interactive: false, height: 500 },
  render: LightPillarPlayground,
  parameters: { docs: { source: playgroundSource('LightPillarPlayground', { imports }) } },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="light-pillar"]');
    await expect(effect).toBeVisible();
    await expect(effect.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
    await waitFor(() => expect(effect).toHaveAttribute('data-renderer', 'webgl'));
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await expect(canvas.getByRole('button', { name: 'Pause animation' })).toBeVisible();
    const canAnimate = effect.dataset.renderer === 'webgl' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', String(canAnimate)));
    await checkBackgroundDemo(context);
  }
};
