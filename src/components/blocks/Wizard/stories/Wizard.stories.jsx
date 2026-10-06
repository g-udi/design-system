import { CollectionWizard } from './fixtures/CollectionWizard.jsx';
import CollectionWizardSource from './fixtures/CollectionWizard.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { topics } from '../../../../docs/fixtures/application/data';

import Wizard from '../Wizard';

const docs = getComponentDocs('Blocks/Wizard');

const collectionName = 'Field notes';
const completion = {
  completeLabel: 'Create collection',
  completionTitle: 'Your collection is ready',
  completionDescription: 'Add your first article whenever you are ready.'
};

const continueTo = async (canvas, count = 1, label = 'Continue') => {
  for (let index = 0; index < count; index += 1) await userEvent.click(canvas.getByRole('button', { name: label }));
};
const completeFlow = async (canvas, completeLabel) => {
  await userEvent.type(canvas.getByRole('textbox', { name: 'Collection name' }), collectionName);
  await continueTo(canvas, 2);
  await userEvent.click(canvas.getByRole('button', { name: completeLabel }));
};

export default {
  title: 'Blocks/Wizard', id: 'blocks-application-wizard',
  component: Wizard,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { title: 'text', description: 'text', labels: 'object', indicator: ['steps', 'progress', 'vertical'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    title: 'Create a collection',
    description: 'Give related ideas a place of their own.',
    labels: { back: 'Back', continue: 'Continue' },
    indicator: 'steps',
    onComplete: fn(async () => {})
  },
  parameters: {
    docs: {
      description: { story: 'A three-step flow with described steps, a validated name, a topic select, audience cards, and a review summary. `labels` renames the navigation buttons and `indicator` shows progress as numbered steps, a progress bar or a vertical step list beside the form.' },
      source: playgroundSource('CollectionWizard', { imports: publicSource(CollectionWizardSource, new URL('./fixtures/CollectionWizard.jsx', import.meta.url)), attributes: ['topics={' + JSON.stringify(topics) + '}', ...Object.entries(completion).map(([name, value]) => name + '={' + JSON.stringify(value) + '}'), 'onComplete={async () => { /* This local example has no backend. */ }}'] })
    }
  },
  // Changing a control restarts the flow so new labels and copy show on the first step.
  render: (args) => <CollectionWizard topics={topics} key={JSON.stringify([args.title, args.description, args.labels, args.indicator])} {...completion} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const next = (count) => continueTo(canvas, count, args.labels?.continue || 'Continue');
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    await next();
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Check the fields');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Collection name' }), collectionName);
    await next();
    await expect(await canvas.findByRole('group', { name: 'Who can read this collection?' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: args.labels?.back || 'Back' }));
    await expect(canvas.getByRole('textbox', { name: 'Collection name' })).toHaveValue(collectionName);
    await next(2);
    await expect(canvas.getByText('Subscribers')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: completion.completeLabel }));
    await expect(await canvas.findByText(completion.completionTitle)).toBeVisible();
    await expect(args.onComplete).toHaveBeenCalledOnce();
  }
};

export const FailedCompletion = {
  parameters: { docs: { description: { story: 'A rejected `onComplete` shows `errorMessage` on the final step and keeps every answer for a retry.' } } },
  render: () => (
    <CollectionWizard
      topics={topics}
      title='Create a collection'
      completeLabel='Create collection'
      onComplete={async () => {
        throw new Error('Example failure');
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await completeFlow(canvas, 'Create collection');
    await expect(await canvas.findByRole('alert')).toHaveTextContent('We could not save your changes');
    await expect(canvas.getByText(collectionName)).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Create collection' })).toBeEnabled();
  }
};
