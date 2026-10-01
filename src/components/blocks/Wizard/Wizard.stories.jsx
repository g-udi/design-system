import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { topics } from '../../../../.storybook/fixtures/application/data';
import Field, { FieldDescription, FieldLabel } from '../../core/Field';
import Input from '../../core/Input';
import Pill from '../../core/Pill';
import RadioGroup from '../../core/RadioGroup';
import Select from '../../core/Select';
import Wizard from './Wizard';

const docs = getComponentDocs('Blocks/Wizard');
const steps = [
  { id: 'details', label: 'Details', description: 'Name and topic' },
  { id: 'audience', label: 'Audience', description: 'Who can read it' },
  { id: 'review', label: 'Review', description: 'Check and create' }
];
const visibilityOptions = [
  { value: 'private', label: 'Only me', description: 'A space for work in progress.' },
  { value: 'subscribers', label: 'Subscribers', description: 'Readers on your mailing list.' },
  { value: 'public', label: 'Everyone', description: 'Share with your readers and search engines.' }
];
const collectionName = 'Field notes';
const completion = {
  completeLabel: 'Create collection',
  completionTitle: 'Your collection is ready',
  completionDescription: 'Add your first article whenever you are ready.'
};
const labelOf = (options, value) => options.find((option) => option.value === value)?.label;

function CollectionWizard(props) {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('research');
  const [visibility, setVisibility] = useState('subscribers');
  return (
    <Wizard steps={steps} validateStep={() => Boolean(name.trim())} {...props}>
      {(step) =>
        step === 0 ? (
          <div className='grid gap-5'>
            <Field>
              <FieldLabel>Collection name</FieldLabel>
              <Input name='name' value={name} onChange={(event) => setName(event.target.value)} />
              <FieldDescription>For example, Field notes or Design practice.</FieldDescription>
            </Field>
            <div className='grid gap-2'>
              <span className='ds-label' aria-hidden='true'>Topic</span>
              <Select aria-label='Topic' options={topics} value={topic} onValueChange={setTopic} className='max-w-none' />
            </div>
          </div>
        ) : step === 1 ? (
          <RadioGroup
            label='Who can read this collection?'
            variant='cards'
            value={visibility}
            onValueChange={setVisibility}
            options={visibilityOptions}
          />
        ) : (
          <dl className='grid gap-3'>
            <div className='flex items-center justify-between gap-3'>
              <dt className='ds-description'>Collection</dt>
              <dd className='ds-label'>{name}</dd>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <dt className='ds-description'>Topic</dt>
              <dd><Pill size='sm' variant='soft' tone='indigo'>{labelOf(topics, topic)}</Pill></dd>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <dt className='ds-description'>Visibility</dt>
              <dd><Pill size='sm' variant='soft' tone={visibility === 'private' ? 'gray' : 'green'}>{labelOf(visibilityOptions, visibility)}</Pill></dd>
            </div>
          </dl>
        )
      }
    </Wizard>
  );
}

const continueTo = async (canvas, count = 1, label = 'Continue') => {
  for (let index = 0; index < count; index += 1) await userEvent.click(canvas.getByRole('button', { name: label }));
};
const completeFlow = async (canvas, completeLabel) => {
  await userEvent.type(canvas.getByRole('textbox', { name: 'Collection name' }), collectionName);
  await continueTo(canvas, 2);
  await userEvent.click(canvas.getByRole('button', { name: completeLabel }));
};

export default {
  title: 'Blocks/To Sort/Wizard', id: 'blocks-application-wizard',
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
      source: playgroundSource('Wizard', {
        imports: "import { Wizard } from '@gaudi/design-system';",
        attributes: ['steps={steps}', 'validateStep={validateStep}', `completeLabel='${completion.completeLabel}'`, `completionTitle='${completion.completionTitle}'`, 'onComplete={createCollection}'],
        children: '  {(step) => <StepFields step={step} />}'
      })
    }
  },
  // Changing a control restarts the flow so new labels and copy show on the first step.
  render: (args) => <CollectionWizard key={JSON.stringify([args.title, args.description, args.labels, args.indicator])} {...completion} {...args} />,
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
