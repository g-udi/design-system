import { previewSource } from '../../../../.storybook/stories/previewSource';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Input from './Input';
import Field, { FieldLabel, FieldDescription, FieldError } from '../Field';

export default {
  tags: ['autodocs'],
  title: 'Core/Input',
  component: Input,
  ...applicationDocs(
    'Text, search, numeric and date fields with prefix/suffix slots. Native attributes and refs reach the control; compose Field for labels, help and errors.',
    "import Input from '@gaudi/design-system/core/Input';\n\n<Field><FieldLabel>Email address</FieldLabel><Input name='email' type='email' autoComplete='email' placeholder='you@example.com' /><FieldDescription>Used for your reading digest.</FieldDescription></Field>",
    'Visible labels are connected through Field. Inputs retain native validation, autocomplete and form submission.'
  )
};

export const Email = {
  parameters: {
    docs: {
      source: {
        code: "<Field><FieldLabel>Email address</FieldLabel><Input name='email' type='email' autoComplete='email' placeholder='you@example.com' /><FieldDescription>Used for your reading digest.</FieldDescription></Field>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Field>
        <FieldLabel>Email address</FieldLabel>
        <Input
          name='email'
          type='email'
          autoComplete='email'
          placeholder='you@example.com'
        />
        <FieldDescription>Used for your reading digest.</FieldDescription>
      </Field>
    </ExampleFrame>
  )
};

export const Adornments = {
  parameters: {
    docs: {
      source: {
        code: "<div className='ds-stack'><Field><FieldLabel>Website</FieldLabel><Input prefix='https://' name='website' placeholder='example.com' /></Field><Field><FieldLabel>Reading goal</FieldLabel><Input type='number' min={1} max={60} defaultValue={20} suffix='minutes' /></Field></div>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <div className='ds-stack'>
        <Field>
          <FieldLabel>Website</FieldLabel>
          <Input prefix='https://' name='website' placeholder='example.com' />
        </Field>
        <Field>
          <FieldLabel>Reading goal</FieldLabel>
          <Input
            type='number'
            min={1}
            max={60}
            defaultValue={20}
            suffix='minutes'
          />
        </Field>
      </div>
    </ExampleFrame>
  )
};

export const InvalidAndDisabled = {
  parameters: {
    docs: {
      source: {
        code: "<div className='ds-stack'><Field><FieldLabel>Article slug</FieldLabel><Input defaultValue='A title with spaces' invalid /><FieldError>Use lowercase letters and hyphens.</FieldError></Field><Field><FieldLabel>Workspace ID</FieldLabel><Input disabled defaultValue='workspace-42' /></Field></div>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <div className='ds-stack'>
        <Field>
          <FieldLabel>Article slug</FieldLabel>
          <Input defaultValue='A title with spaces' invalid />
          <FieldError>Use lowercase letters and hyphens.</FieldError>
        </Field>
        <Field>
          <FieldLabel>Workspace ID</FieldLabel>
          <Input disabled defaultValue='workspace-42' />
        </Field>
      </div>
    </ExampleFrame>
  )
};

export const DateAndTime = {
  parameters: {
    docs: {
      source: {
        code: "<div className='ds-stack'><Field><FieldLabel>Publication date</FieldLabel><Input type='date' name='date' defaultValue='2026-10-01' /></Field><Field><FieldLabel>Publication time</FieldLabel><Input type='time' name='time' defaultValue='09:00' /></Field></div>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <div className='ds-stack'>
        <Field>
          <FieldLabel>Publication date</FieldLabel>
          <Input type='date' name='date' defaultValue='2026-10-01' />
        </Field>
        <Field>
          <FieldLabel>Publication time</FieldLabel>
          <Input type='time' name='time' defaultValue='09:00' />
        </Field>
      </div>
    </ExampleFrame>
  )
};

export const Playground = {
  args: { type: 'email', placeholder: 'you@example.com', disabled: false, required: false, invalid: false, prefix: '', suffix: '' },
  argTypes: { type: { control: 'select', options: ['text', 'email', 'search', 'number', 'date'] }, placeholder: { control: 'text' }, disabled: { control: 'boolean' }, required: { control: 'boolean' }, invalid: { control: 'boolean' }, prefix: { control: 'text' }, suffix: { control: 'text' } },
  render: (args) => (<ExampleFrame><Field><FieldLabel>Email address</FieldLabel><Input {...args} /></Field></ExampleFrame>),
  parameters: { docs: { description: { story: 'Adjust the controls to explore the component. The examples below cover complete usage patterns.' }, source: { type: 'dynamic', transform: (_, context) => previewSource('Input', context.args, { imports: "import Input from '@gaudi/design-system/core/Input';\nimport { Field, FieldLabel } from '@gaudi/design-system/core/Field';", before: '<Field>\n  <FieldLabel>Email address</FieldLabel>\n', after: '\n</Field>' }) } } }
};
