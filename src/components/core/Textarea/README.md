# Textarea

Multiline fields reuse FieldInput validation and description wiring. Supports native rows, maxLength, required, readOnly and form attributes.

## Usage

```jsx
import Textarea from '@gaudi/design-system/core/Textarea';

<Field>
  <FieldLabel>Summary</FieldLabel>
  <Textarea name='summary' placeholder='What should the reader take away?' />
  <FieldDescription>
    A short introduction for the article index.
  </FieldDescription>
</Field>;
```

## Accessibility

Labels and errors are associated with the textarea. Vertical resizing preserves the available width.

## Examples

EditorialSummary, Validation, ReadOnly in Storybook. All examples support light and dark themes.
