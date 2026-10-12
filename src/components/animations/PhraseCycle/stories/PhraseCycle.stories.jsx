import { checkTextDemoDensity } from '../../../../../tests/components/animations/textDemoBehavior.js';
import { checkPhraseControls } from '../../../../../tests/components/animations/checkTextControls.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { PhraseCycle } from '../index.js';
import { PhraseCyclePlayground } from './fixtures/PhraseCycleExamples.jsx';
import examplesRaw from './fixtures/PhraseCycleExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { textAnimationDemoSource } from '../../../../docs/fixtures/animations/textAnimationDemoSource.js';
import { playgroundSource } from '../../../../docs/components/previewSource';
const docs = getComponentDocs('Animations/Text/PhraseCycle');
const imports = textAnimationDemoSource(examplesRaw, new URL('./fixtures/PhraseCycleExamples.jsx', import.meta.url));
export default {
  title: 'Animations/Text/PhraseCycle', id: 'animations-text-phrasecycle', component: PhraseCycle, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {"texts": "object", "interval": "number", "direction": ["up", "down"], "paused": "boolean"}),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};
export const Playground = {
  args: {"texts": ["thoughtfully", "boldly", "together"], "interval": 2200, "direction": "up", "paused": false},
  render: PhraseCyclePlayground,
  parameters: { docs: { source: playgroundSource('PhraseCyclePlayground', { imports }) } },
  play: async context => {
    const { canvasElement } = context;
    await checkPhraseControls(canvasElement);
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="phrase-cycle"]');
    await expect(effect).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(canvasElement.querySelector('[data-slot="phrase-cycle"]')).toBeVisible();
    await checkTextDemoDensity(context);
  }
};
export const Variant = {
  ...Playground, name: "Downward rotation", args: { ...Playground.args, ...{"texts": ["small ideas", "big possibilities"], "direction": "down", "interval": 3000} }
};
