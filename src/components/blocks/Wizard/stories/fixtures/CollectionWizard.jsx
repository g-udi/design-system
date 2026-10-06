import { useState } from 'react';
import Field, { FieldDescription, FieldLabel } from '@gaudi/design-system/core/Field';
import Input from '@gaudi/design-system/core/Input';
import Pill from '@gaudi/design-system/core/Pill';
import RadioGroup from '@gaudi/design-system/core/RadioGroup';
import Select from '@gaudi/design-system/core/Select';
import Wizard from '@gaudi/design-system/blocks/Wizard';

export const steps = [
  { id: 'details', label: 'Details', description: 'Name and topic' },
  { id: 'audience', label: 'Audience', description: 'Who can read it' },
  { id: 'review', label: 'Review', description: 'Check and create' }
];

export const visibilityOptions = [
  { value: 'private', label: 'Only me', description: 'A space for work in progress.' },
  { value: 'subscribers', label: 'Subscribers', description: 'Readers on your mailing list.' },
  { value: 'public', label: 'Everyone', description: 'Share with your readers and search engines.' }
];

export const labelOf = (options, value) => options.find((option) => option.value === value)?.label;

export function CollectionWizard({ topics, ...props }) {
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
