import { checkTextDemoDensity } from '../../../../../tests/components/animations/textDemoBehavior.js';
import { checkSpotlightControls } from '../../../../../tests/components/animations/checkTextControls.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { WordSpotlight } from '../index.js';
import { WordSpotlightPlayground } from './fixtures/WordSpotlightExamples.jsx';
import examplesRaw from './fixtures/WordSpotlightExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { textAnimationDemoSource } from '../../../../docs/fixtures/animations/textAnimationDemoSource.js';
import { playgroundSource } from '../../../../docs/components/previewSource';
const docs = getComponentDocs('Animations/Text/WordSpotlight');
const imports = textAnimationDemoSource(examplesRaw, new URL('./fixtures/WordSpotlightExamples.jsx', import.meta.url));
export default {
  title: 'Animations/Text/WordSpotlight', id: 'animations-text-wordspotlight', component: WordSpotlight, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {"text": "text", "interval": "number", "blur": "number", "paused": "boolean"}),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};
export const Playground = {
  args: {"text": "Focus on what matters", "interval": 1800, "blur": 4, "paused": false},
  render: WordSpotlightPlayground,
  parameters: { docs: { source: playgroundSource('WordSpotlightPlayground', { imports }) } },
  play: async context => {
    const { canvasElement } = context;
    await checkSpotlightControls(canvasElement);
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="word-spotlight"]');
    await expect(effect).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(canvasElement.querySelector('[data-slot="word-spotlight"]')).toBeVisible();
    await checkTextDemoDensity(context);
  }
};
export const Variant = {
  ...Playground, name: "Gentle focus", args: { ...Playground.args, ...{"text": "Clarity through contrast", "blur": 2, "interval": 2600} }
};
