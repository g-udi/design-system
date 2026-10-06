import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Typewriter } from '../index.js';
import { TypewriterPlayground } from './fixtures/TypewriterExamples.jsx';
import examplesRaw from './fixtures/TypewriterExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { playgroundSource } from '../../../../docs/components/previewSource';
const docs = getComponentDocs('Animations/Text/Typewriter');
const imports = publicSource(examplesRaw, new URL('./fixtures/TypewriterExamples.jsx', import.meta.url));
export default {
  title: 'Animations/Text/Typewriter', id: 'animations-typewriterwriter', component: Typewriter, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {"texts": "object", "typeDelay": "number", "eraseDelay": "number", "holdDelay": "number", "repeat": "boolean", "caret": "boolean", "paused": "boolean"}),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};
export const Playground = {
  args: {"texts": ["Make something memorable.", "Make it yours."], "typeDelay": 80, "eraseDelay": 40, "holdDelay": 1600, "repeat": true, "caret": true, "paused": false},
  render: TypewriterPlayground,
  parameters: { docs: { source: playgroundSource('TypewriterPlayground', { imports }) } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="typewriter"]');
    await expect(effect).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(canvasElement.querySelector('[data-slot="typewriter"]')).toBeVisible();
  }
};
export const Variant = {
  ...Playground, name: "One sentence", args: { ...Playground.args, ...{"texts": ["A single thought, fully formed."], "repeat": false} }
};
