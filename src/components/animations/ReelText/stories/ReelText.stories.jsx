import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ReelText } from '../index.js';
import { ReelTextChangingValue, ReelTextPlayground } from './fixtures/ReelTextExamples.jsx';
import examplesRaw from './fixtures/ReelTextExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { textAnimationDemoSource } from '../../../../docs/fixtures/animations/textAnimationDemoSource.js';
import { playgroundSource } from '../../../../docs/components/previewSource';
const docs = getComponentDocs('Animations/Text/ReelText');
const imports = textAnimationDemoSource(examplesRaw, new URL('./fixtures/ReelTextExamples.jsx', import.meta.url));
export default {
  title: 'Animations/Text/ReelText', id: 'animations-text-reeltext', component: ReelText, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { value: 'text', duration: 'number', stagger: 'number', paused: 'boolean' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};
export const Playground = {
  args: { value: '$31,904', duration: 900, stagger: 70, paused: false },
  render: ReelTextPlayground,
  parameters: { docs: { source: playgroundSource('ReelTextPlayground', { imports }) } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const effect = canvas.getByRole('img', { name: '$31,904' });
    await expect(effect).toHaveAttribute('data-slot', 'reel-text');
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="reel-text"]')).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(canvas.getByRole('img', { name: '$31,904' })).toBeVisible();
  }
};
export const ChangingValue = {
  name: 'Changing value',
  args: { duration: 900, stagger: 70, paused: false },
  render: ReelTextChangingValue,
  parameters: { docs: { source: playgroundSource('ReelTextChangingValue', { imports }) } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: '$31,904' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Next value' }));
    await expect(canvas.getByRole('img', { name: '$127,616' })).toBeVisible();
  }
};
