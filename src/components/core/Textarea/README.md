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

The Playground shows a review note with a counter and the invalid and disabled states; the catalogue adds field states and auto-resize.

`caretMode='smooth'` enables animated caret movement within a line; wrapped-line changes snap vertically. It inherits `InputConfigProvider` when omitted. See [Input caret mode](../Input/README.md#smooth-caret-mode) for native fallbacks.
