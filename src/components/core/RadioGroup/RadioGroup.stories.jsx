import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import RadioGroup from './RadioGroup';

export default {
  tags: ['autodocs'],
  title: 'Core/RadioGroup',
  component: RadioGroup,
  ...applicationDocs(
    'Native single-choice groups with list and card layouts. Options accept value, label, description and disabled. Supports controlled value or defaultValue.',
    "import RadioGroup from '@gaudi/design-system/core/RadioGroup';\n\n<RadioGroup label='Reading digest' name='digest' defaultValue='weekly' options={[{value:'weekly',label:'Weekly',description:'A concise update every Friday.'},{value:'monthly',label:'Monthly',description:'The highlights, once a month.'},{value:'off',label:'Off'}]} />",
    'Fieldset and legend name the group. Native radio navigation, disabled behavior, required validation and form submission are retained.'
  )
};

export const DeliveryFrequency = {
  parameters: {
    docs: {
      source: {
        code: "<RadioGroup label='Reading digest' name='digest' defaultValue='weekly' options={[{value:'weekly',label:'Weekly',description:'A concise update every Friday.'},{value:'monthly',label:'Monthly',description:'The highlights, once a month.'},{value:'off',label:'Off'}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <RadioGroup
        label='Reading digest'
        name='digest'
        defaultValue='weekly'
        options={[
          {
            value: 'weekly',
            label: 'Weekly',
            description: 'A concise update every Friday.'
          },
          {
            value: 'monthly',
            label: 'Monthly',
            description: 'The highlights, once a month.'
          },
          { value: 'off', label: 'Off' }
        ]}
      />
    </ExampleFrame>
  )
};

export const ChoiceCards = {
  parameters: {
    docs: {
      source: {
        code: "<RadioGroup label='Publication visibility' name='visibility' variant='cards' defaultValue='private' options={[{value:'public',label:'Public',description:'Anyone can read this article.'},{value:'private',label:'Private',description:'Only you can see this draft.'},{value:'team',label:'Team',description:'Requires a team workspace.',disabled:true}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <RadioGroup
        label='Publication visibility'
        name='visibility'
        variant='cards'
        defaultValue='private'
        options={[
          {
            value: 'public',
            label: 'Public',
            description: 'Anyone can read this article.'
          },
          {
            value: 'private',
            label: 'Private',
            description: 'Only you can see this draft.'
          },
          {
            value: 'team',
            label: 'Team',
            description: 'Requires a team workspace.',
            disabled: true
          }
        ]}
      />
    </ExampleFrame>
  )
};

export const Disabled = {
  parameters: {
    docs: {
      source: {
        code: "<RadioGroup label='Read-only preferences' disabled defaultValue='email' options={[{value:'email',label:'Email'},{value:'none',label:'No notifications'}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <RadioGroup
        label='Read-only preferences'
        disabled
        defaultValue='email'
        options={[
          { value: 'email', label: 'Email' },
          { value: 'none', label: 'No notifications' }
        ]}
      />
    </ExampleFrame>
  )
};
