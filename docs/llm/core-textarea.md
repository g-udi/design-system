# Textarea

> Core/Textarea · core · `@gaudi/design-system/core/Textarea`

Multiline text entry that composes with the same labels and errors as Input.

## Import

```js
import Textarea from '@gaudi/design-system/core/Textarea';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `caretMode` | `native \| smooth` | `provider / smooth` | no | Overrides InputConfigProvider for this field. Smooth mode animates the collapsed caret while supported native text controls retain their editing behavior. |
| `rows` | `number` | `4` | no | Initial visible line count. |
| `placeholder` | `string` | — | no | Example value; never a replacement for a label. |
| `Native textarea props / ref` | `TextareaHTMLAttributes<HTMLTextAreaElement>` | — | no | Value, change callback, name, placeholder, limits, disabled, required and ARIA attributes. |
| `invalid` | `boolean` | — | no | Expose invalid state through FieldTextarea. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `caretMode`: `native`, `smooth`

## Usage

```jsx
import Textarea from '@gaudi/design-system/core/Textarea';

<Textarea aria-label='Message' value={message} onChange={event => setMessage(event.target.value)} rows={4} />
```

## Accessibility

Use FieldLabel and FieldError. Preserve entered text after a validation or submission failure.

## Examples

- Playground (Storybook `core-textarea--playground`)

Curated patterns:

- Growing note field with a counter — registry item `@gaudi/textarea-auto-resize` (uses `FieldLabelPrimitive`, `FieldRoot`, `Textarea`)
- Field states — registry item `@gaudi/textarea-field-states` (uses `Field`, `FieldDescription`, `FieldError`, `FieldLabel`, `Textarea`)

## Related

`core-input`

## README

Multiline fields reuse FieldInput validation and description wiring. Supports native rows, maxLength, required, readOnly and form attributes.

### Usage

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

### Accessibility

Labels and errors are associated with the textarea. Vertical resizing preserves the available width.

### Examples

The Playground shows a review note with a counter and the invalid and disabled states; the catalogue adds field states and auto-resize.

`caretMode='smooth'` enables animated caret movement within a line; wrapped-line changes snap vertically. It inherits `InputConfigProvider` when omitted. See [Input caret mode](../Input/README.md#smooth-caret-mode) for native fallbacks.
