import { expect, userEvent, waitFor, within } from 'storybook/test';
import { CipherReveal } from '../index.js';
import { CipherRevealPlayground } from './fixtures/CipherRevealExamples.jsx';
import examplesRaw from './fixtures/CipherRevealExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { playgroundSource } from '../../../../docs/components/previewSource';
const docs = getComponentDocs('Animations/Text/CipherReveal');
const imports = publicSource(examplesRaw, new URL('./fixtures/CipherRevealExamples.jsx', import.meta.url));
export default {
  title: 'Animations/Text/CipherReveal', id: 'animations-text-cipherreveal', component: CipherReveal, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {"text": "text", "duration": "number", "direction": ["start", "end", "center"], "trigger": ["view", "hover"], "characterSet": "text", "paused": "boolean"}),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};
export const Playground = {
  args: {"text": "Ideas into interfaces", "duration": 1200, "direction": "start", "trigger": "view", "characterSet": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", "paused": false},
  render: CipherRevealPlayground,
  parameters: { docs: { source: playgroundSource('CipherRevealPlayground', { imports }) } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="cipher-reveal"]');
    await expect(effect).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(canvasElement.querySelector('[data-slot="cipher-reveal"]')).toBeVisible();
  }
};
export const Variant = {
  ...Playground, name: "Reveal from the center", args: { ...Playground.args, ...{"text": "The answer is within", "direction": "center", "trigger": "hover"} }
};
