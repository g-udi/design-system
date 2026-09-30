import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Stepper from './Stepper';

export default {
  tags: ['autodocs'],
  title: 'Core/Stepper',
  component: Stepper,
  ...applicationDocs(
    'Sequential progress with stable step IDs, labels and optional descriptions. activeStep is zero-based; set it to steps.length for completion. Use Wizard for guarded navigation.',
    "import Stepper from '@gaudi/design-system/core/Stepper';\n\n<Stepper activeStep={1} steps={[{id:'details',label:'Details',description:'Name and summary'},{id:'audience',label:'Audience',description:'Who can read this?'},{id:'review',label:'Review',description:'Confirm and publish'}]} />",
    'The active item uses aria-current=step and completed items include a text alternative. This component does not create fake tab semantics.'
  )
};

export const InProgress = {
  parameters: {
    docs: {
      source: {
        code: "<Stepper activeStep={1} steps={[{id:'details',label:'Details',description:'Name and summary'},{id:'audience',label:'Audience',description:'Who can read this?'},{id:'review',label:'Review',description:'Confirm and publish'}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Stepper
        activeStep={1}
        steps={[
          { id: 'details', label: 'Details', description: 'Name and summary' },
          {
            id: 'audience',
            label: 'Audience',
            description: 'Who can read this?'
          },
          { id: 'review', label: 'Review', description: 'Confirm and publish' }
        ]}
      />
    </ExampleFrame>
  )
};

export const Completed = {
  parameters: {
    docs: {
      source: {
        code: "<Stepper activeStep={3} steps={[{id:'one',label:'Details'},{id:'two',label:'Audience'},{id:'three',label:'Review'}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Stepper
        activeStep={3}
        steps={[
          { id: 'one', label: 'Details' },
          { id: 'two', label: 'Audience' },
          { id: 'three', label: 'Review' }
        ]}
      />
    </ExampleFrame>
  )
};

export const LongLabels = {
  parameters: {
    docs: {
      source: {
        code: "<Stepper steps={[{id:'one',label:'Configure your publication preferences'},{id:'two',label:'Invite reviewers to your workspace'},{id:'three',label:'Confirm the details and finish setup'}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Stepper
        steps={[
          { id: 'one', label: 'Configure your publication preferences' },
          { id: 'two', label: 'Invite reviewers to your workspace' },
          { id: 'three', label: 'Confirm the details and finish setup' }
        ]}
      />
    </ExampleFrame>
  )
};
