import { previewSource } from '../../../../.storybook/stories/previewSource';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Textarea from './Textarea';
import Field, { FieldLabel, FieldDescription, FieldError } from '../Field';

export default {
  tags: ['autodocs'],
  title: 'Core/Textarea',
  component: Textarea,
  ...applicationDocs(
    'Multiline fields reuse FieldInput validation and description wiring. Supports native rows, maxLength, required, readOnly and form attributes.',
    "import Textarea from '@gaudi/design-system/core/Textarea';\n\n<Field><FieldLabel>Summary</FieldLabel><Textarea name='summary' placeholder='What should the reader take away?' /><FieldDescription>A short introduction for the article index.</FieldDescription></Field>",
    'Labels and errors are associated with the textarea. Vertical resizing preserves the available width.'
  )
};

export const EditorialSummary = {
  parameters: {
    docs: {
      source: {
        code: "<Field><FieldLabel>Summary</FieldLabel><Textarea name='summary' placeholder='What should the reader take away?' /><FieldDescription>A short introduction for the article index.</FieldDescription></Field>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Field>
        <FieldLabel>Summary</FieldLabel>
        <Textarea
          name='summary'
          placeholder='What should the reader take away?'
        />
        <FieldDescription>
          A short introduction for the article index.
        </FieldDescription>
      </Field>
    </ExampleFrame>
  )
};

export const Validation = {
  parameters: {
    docs: {
      source: {
        code: "<Field><FieldLabel>Review notes</FieldLabel><Textarea invalid defaultValue='' /><FieldError>Add a reason before returning this draft.</FieldError></Field>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Field>
        <FieldLabel>Review notes</FieldLabel>
        <Textarea invalid defaultValue='' />
        <FieldError>Add a reason before returning this draft.</FieldError>
      </Field>
    </ExampleFrame>
  )
};

export const ReadOnly = {
  parameters: {
    docs: {
      source: {
        code: "<Field><FieldLabel>Published summary</FieldLabel><Textarea readOnly defaultValue='A practical introduction to knowledge graphs and the questions they can help answer.' /></Field>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Field>
        <FieldLabel>Published summary</FieldLabel>
        <Textarea
          readOnly
          defaultValue='A practical introduction to knowledge graphs and the questions they can help answer.'
        />
      </Field>
    </ExampleFrame>
  )
};

export const Playground = {
  args: { placeholder: 'Describe your idea…', rows: 4, disabled: false, required: false, invalid: false },
  argTypes: { placeholder: { control: 'text' }, rows: { control: { type: 'range', min: 2, max: 8 } }, disabled: { control: 'boolean' }, required: { control: 'boolean' }, invalid: { control: 'boolean' } },
  render: (args) => (<ExampleFrame><Field><FieldLabel>Article summary</FieldLabel><Textarea {...args} /></Field></ExampleFrame>),
  parameters: { docs: { description: { story: 'Adjust the controls to explore the component. The examples below cover complete usage patterns.' }, source: { type: 'dynamic', transform: (_, context) => previewSource('Textarea', context.args, { imports: "import Textarea from '@gaudi/design-system/core/Textarea';\nimport { Field, FieldLabel } from '@gaudi/design-system/core/Field';", before: '<Field>\n  <FieldLabel>Article summary</FieldLabel>\n', after: '\n</Field>' }) } } }
};
