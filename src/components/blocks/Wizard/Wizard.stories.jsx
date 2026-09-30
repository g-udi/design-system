import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Field, { FieldDescription, FieldLabel } from '../../core/Field';
import Input from '../../core/Input';
import RadioGroup from '../../core/RadioGroup';
import Wizard from './Wizard';

const docs = getComponentDocs('Blocks/Application/Wizard');
const steps = [
  { id: 'details', label: 'Details' },
  { id: 'audience', label: 'Audience' },
  { id: 'review', label: 'Review' }
];
const visibilityOptions = [
  { value: 'private', label: 'Only me', description: 'A space for work in progress.' },
  { value: 'public', label: 'Everyone', description: 'Share with your readers.' }
];
const collectionName = 'Field notes';

function CollectionWizard(props) {
  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState('private');
  return (
    <Wizard steps={steps} validateStep={() => Boolean(name.trim())} {...props}>
      {(step) =>
        step === 0 ? (
          <Field>
            <FieldLabel>Collection name</FieldLabel>
            <Input name='name' value={name} onChange={(event) => setName(event.target.value)} />
            <FieldDescription>For example, Field notes or Design practice.</FieldDescription>
          </Field>
        ) : step === 1 ? (
          <RadioGroup
            label='Who can read this collection?'
            variant='cards'
            value={visibility}
            onValueChange={setVisibility}
            options={visibilityOptions}
          />
        ) : (
          <dl className='ds-stack'>
            <div>
              <dt className='ds-description'>Collection</dt>
              <dd className='ds-label'>{name}</dd>
            </div>
            <div>
              <dt className='ds-description'>Visibility</dt>
              <dd className='ds-label'>{visibility}</dd>
            </div>
          </dl>
        )
      }
    </Wizard>
  );
}

const continueTo = async (canvas, count = 1) => {
  for (let index = 0; index < count; index += 1) await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
};
const completeFlow = async (canvas, completeLabel) => {
  await userEvent.type(canvas.getByRole('textbox', { name: 'Collection name' }), collectionName);
  await continueTo(canvas, 2);
  await userEvent.click(canvas.getByRole('button', { name: completeLabel }));
};

export default {
  title: 'Blocks/Application/Wizard',
  component: Wizard,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    title: 'text',
    description: 'text',
    completeLabel: 'text',
    completionTitle: 'text',
    completionDescription: 'text'
  }),
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
    completeLabel: 'Create collection',
    completionTitle: 'Your collection is ready',
    completionDescription: 'Add your first article whenever you are ready.',
    onComplete: fn(async () => {})
  },
  parameters: {
    docs: {
      source: playgroundSource('Wizard', {
        imports: "import { Wizard } from '@gaudi/design-system';",
        children: '  {(step) => <StepFields step={step} />}'
      })
    }
  },
  render: (args) => <CollectionWizard {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await continueTo(canvas);
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Check the fields');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Collection name' }), collectionName);
    await continueTo(canvas);
    await expect(await canvas.findByRole('group', { name: 'Who can read this collection?' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(canvas.getByRole('textbox')).toHaveValue(collectionName);
    await continueTo(canvas, 2);
    await userEvent.click(canvas.getByRole('button', { name: args.completeLabel }));
    await expect(await canvas.findByText(args.completionTitle)).toBeVisible();
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
