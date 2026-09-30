import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Wizard from './Wizard';
import Field, { FieldLabel, FieldDescription } from '../../core/Field';
import Input from '../../core/Input';
import RadioGroup from '../../core/RadioGroup';
export default {
  tags: ['autodocs'],
  title: 'Blocks/Application/Wizard',
  component: Wizard,
  ...applicationDocs(
    'Sequential setup with async validation, back navigation, serialized submission, failure recovery and completion. Hosts own field values above the wizard, validateStep(index), and onComplete. A changed sequence of step IDs resets the flow and discards stale results.',
    "const [name, setName] = useState('');\n<Wizard title='Create a collection' steps={[{id:'details',label:'Details'},{id:'review',label:'Review'}]} validateStep={() => Boolean(name.trim())} onComplete={saveCollection}>{step => step === 0 ? <Input aria-label='Name' value={name} onChange={e => setName(e.target.value)} /> : <p>{name}</p>}</Wizard>",
    'Stepper marks the active stage; advancing focuses its panel. Validation errors are announced, pending fields are disabled and duplicate submissions are blocked.'
  )
};
function Setup({ fail = false }) {
  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState('private');
  return (
    <ExampleFrame>
      <Wizard
        title='Create a collection'
        description='Give related ideas a place of their own.'
        steps={[
          { id: 'details', label: 'Details' },
          { id: 'audience', label: 'Audience' },
          { id: 'review', label: 'Review' }
        ]}
        validateStep={() => Boolean(name.trim())}
        onComplete={async () => {
          if (fail) throw new Error('Example failure');
        }}
        completeLabel='Create collection'
        completionTitle='Your collection is ready'
        completionDescription='Add your first article whenever you are ready.'
      >
        {(step) =>
          step === 0 ? (
            <Field>
              <FieldLabel>Collection name</FieldLabel>
              <Input
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FieldDescription>
                For example, Field notes or Design practice.
              </FieldDescription>
            </Field>
          ) : step === 1 ? (
            <RadioGroup
              label='Who can read this collection?'
              variant='cards'
              value={visibility}
              onValueChange={setVisibility}
              options={[
                {
                  value: 'private',
                  label: 'Only me',
                  description: 'A space for work in progress.'
                },
                {
                  value: 'public',
                  label: 'Everyone',
                  description: 'Share with your readers.'
                }
              ]}
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
    </ExampleFrame>
  );
}
export const CollectionSetup = {
  render: () => <Setup />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Check the fields'
    );
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Collection name' }),
      'Field notes'
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(
      await canvas.findByRole('group', {
        name: 'Who can read this collection?'
      })
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(canvas.getByRole('textbox')).toHaveValue('Field notes');
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create collection' })
    );
    await expect(
      await canvas.findByText('Your collection is ready')
    ).toBeVisible();
  }
};
export const FailedCompletion = { render: () => <Setup fail /> };
