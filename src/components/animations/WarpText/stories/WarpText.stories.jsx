import { expect, userEvent, waitFor, within } from 'storybook/test';
import { WarpText } from '../index.js';
import { WarpTextPlayground } from './fixtures/WarpTextExamples.jsx';
import examplesRaw from './fixtures/WarpTextExamples.jsx?raw';
import { checkWarpText } from '../../../../../tests/components/animations/WarpText/checkWarpText.jsx';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Animations/Text/WarpText');
const imports = publicSource(examplesRaw, new URL('./fixtures/WarpTextExamples.jsx', import.meta.url));
export default {
  title: 'Animations/Text/WarpText', id: 'animations-text-warptext', component: WarpText, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { text: 'text', warpStrength: 'number', warpScale: 'number', speed: 'number', pointerRadius: 'number', pointerStrength: 'number', refraction: 'number', ripple: 'boolean', paused: 'boolean' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};
export const Playground = {
  args: { text: 'Bend the moment', warpStrength: .08, warpScale: 1.7, speed: .55, pointerRadius: .42, pointerStrength: .38, refraction: .018, ripple: true, paused: false },
  render: WarpTextPlayground,
  parameters: { docs: { source: playgroundSource('WarpTextPlayground', { imports }) } },
  play: async ({ canvasElement, args }) => {
    const effect = canvasElement.querySelector('[data-slot="warp-text"]');
    await expect(effect).toBeVisible();
    if (args.paused) return;
    await userEvent.hover(effect);
    await waitFor(() => expect(effect).toHaveAttribute('data-hovered', 'true'));
    await userEvent.unhover(effect);
    await waitFor(() => expect(effect).toHaveAttribute('data-hovered', 'false'));
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'true'));
  }
};
export const HoverOnly = {
  ...Playground, name: 'Hover lens', args: { ...Playground.args, text: 'Follow the pointer', warpStrength: 0, pointerStrength: .65, ripple: false, refraction: 0 },
  play: async context => { await Playground.play(context); await checkWarpText(context.canvasElement); }
};
export const Multiline = {
  ...Playground, name: 'Multiline refraction', args: { ...Playground.args, text: 'Words in\nmotion', pointerStrength: .7, pointerRadius: .6, refraction: .04 }
};
