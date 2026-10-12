# Input

> Core/Input · core · `@gaudi/design-system/core/Input`

Text, search, numeric and date inputs with prefix and suffix slots.

## Import

```js
import Input from '@gaudi/design-system/core/Input';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `EmailInput`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `InputGroupText`, `InputGroupTextarea`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `caretMode` | `native \| smooth` | `provider / smooth` | no | Overrides InputConfigProvider for this field. Smooth mode animates the collapsed caret while supported native text controls retain their editing behavior. |
| `type` | `text \| email \| search \| url \| tel \| password \| number \| date` | `text` | no | Native input type. Use EmailInput for addresses and NumberField for numeric values to retain the default smooth caret. |
| `prefix / suffix` | `ReactNode` | — | no | Content before or after the native control. |
| `placeholder` | `string` | — | no | Example value; never a replacement for a label. |
| `required / disabled` | `boolean` | `false` | no | Native form constraint and availability. |
| `invalid` | `boolean` | — | no | Marks the underlying FieldInput as invalid. |
| `inputClassName` | `string` | — | no | Classes on the input itself. |
| `className` | `string` | — | no | Additional classes on the outer element. |
| `Native input props / ref` | `InputHTMLAttributes<HTMLInputElement>` | — | no | Forwards value, defaultValue, onChange, disabled, required, name, autocomplete and ARIA attributes to the input. |

## Variants

- `caretMode`: `native`, `smooth`

## Usage

```jsx
import Input, { EmailInput } from '@gaudi/design-system/core/Input';

<>
  <Input aria-label='Project name' value={name} onChange={event => setName(event.target.value)} />
  <EmailInput aria-label='Email address' name='email' required />
</>
```

## Accessibility

Compose Field, FieldLabel, FieldDescription and FieldError. Keep labels visible and connect errors to their control.

## Notes

- EmailInput is a named export from the Input entry. It composes Input with a text editor, an email keyboard hint, email autocomplete and single-address pattern validation, so it supports smooth caret mode.
- EmailInput fixes type=text and inputMode=email; multiple addresses are unsupported. An additional pattern narrows the allowed addresses. Invalid author patterns are ignored while email validation remains active.
- EmailInput keeps raw text (spaces are invalid), reports patternMismatch instead of typeMismatch, and leaves custom error copy to FieldError/onInvalid. required, minLength/maxLength, name, form, value/defaultValue, refs and event handlers reach the native editor.
- Smooth caret is enabled by default. Use EmailInput for addresses and NumberField for numeric values throughout forms and examples; reserve native email/number types for documented semantic exceptions. Provider and per-field caretMode=native overrides remain available.

## Examples

- Playground (Storybook `core-input--playground`)
- Smooth Caret Mode (Storybook `core-input--smooth-caret-mode`)
- Email Address (Storybook `core-input--email-address`)

Curated patterns:

- Addon placement — registry item `@gaudi/input-group-addons` (uses `EmailInput`, `FieldLabelPrimitive`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `InputGroupText`, `InputGroupTextarea`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `RegistryIcon`)
- AI prompt inputs — registry item `@gaudi/input-group-ai-prompts` (uses `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `InputGroupText`, `InputGroupTextarea`, `RegistryIcon`)
- Multi-field composer — registry item `@gaudi/input-group-composer` (uses `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `InputGroupText`, `InputGroupTextarea`, `RegistryIcon`, `Separator`)
- Dropdown selectors — registry item `@gaudi/input-group-dropdowns` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `FieldLabelPrimitive`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `RegistryIcon`, `cn`, `useCopyToClipboard`)
- Hints and states — registry item `@gaudi/input-group-hints-states` (uses `EmailInput`, `FieldLabelPrimitive`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `InputGroupText`, `KbdGroup`, `KbdRoot`, `LoaderRoot`, `RegistryIcon`)
- Inline actions — registry item `@gaudi/input-group-inline-actions` (uses `ButtonGroup`, `ButtonGroupText`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `FieldLabelPrimitive`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `PopoverContentPrimitive`, `PopoverDescription`, `PopoverHeader`, `PopoverPrimitive`, `PopoverTitle`, `PopoverTriggerPrimitive`, `RegistryIcon`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`, `useCopyToClipboard`)
- Search with filters — registry item `@gaudi/input-group-search-filters` (uses `CheckboxRoot`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `Label`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RegistryIcon`)
- Labels and messages — registry item `@gaudi/input-labels-messages` (uses `Badge`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`, `RegistryIcon`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Password with strength meter — registry item `@gaudi/input-password-strength` (uses `Button`, `FieldLabelPrimitive`, `FieldRoot`, `Input`, `Link`, `RegistryIcon`)
- Style variants — registry item `@gaudi/input-style-variants` (uses `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`)
- Input types — registry item `@gaudi/input-types` (uses `EmailInput`, `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`)

## Related

`core-numberfield`, `core-field`

## README

A single-line text field for names, emails, URLs, numbers and dates. `prefix` and `suffix` add text or icons inside the border (they render as InputGroup addons); every native attribute and the ref reach the input itself. Wrap it in a Field for its label, help and error.

For buttons, menus or several addons inside the border, compose `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText` and `InputGroupInput` directly.

### Usage

```jsx
import { EmailInput } from '@gaudi/design-system/core/Input';
import { Field, FieldLabel, FieldDescription } from '@gaudi/design-system/core/Field';

<Field>
  <FieldLabel>Email address</FieldLabel>
  <EmailInput
    name='email'
    autoComplete='email'
    placeholder='you@example.com'
  />
  <FieldDescription>Used for your reading digest.</FieldDescription>
</Field>;
```

### Accessibility

Visible labels are connected through Field. Inputs retain native validation, autocomplete and form submission.

### Examples

The Playground uses EmailInput for its email field and NumberField for its monthly budget; both inherit the global Caret toolbar. Other type choices use Input. Its preview controls include a per-field caret override, adornments, invalid and disabled states. The catalogue adds native types, password strength, and every addon placement. The chat composer built on InputGroup is `ChatInput` in the Chat area.

The same `InputGroup` and native control remain mounted when `prefix` or `suffix` appears or disappears. Conditional clear buttons and validation adornments preserve typed values, focus, selection, and the input ref.

### EmailInput

`EmailInput` is the single-address email editor exported from this owner. It uses a text input with `inputMode='email'`, `autoComplete='email'`, no capitalization and no spellcheck. Its caret supports the same provider and field override as Input.

```jsx
import { EmailInput } from '@gaudi/design-system/core/Input';
import { Field, FieldLabel, FieldDescription } from '@gaudi/design-system/core/Field';

<Field>
  <FieldLabel>Email address</FieldLabel>
  <EmailInput name='email' required placeholder='you@example.com' />
  <FieldDescription>Enter one email address, without spaces.</FieldDescription>
</Field>
```

The browser validates the [HTML email-address grammar](https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)) through `pattern`. Invalid addresses block normal form submission and report `validity.patternMismatch`; empty required fields report `validity.valueMissing`. Optional empty fields are valid. This works from server-rendered HTML, without a validation effect or hidden input. `onInvalid`, `checkValidity()`, `reportValidity()`, `setCustomValidity()`, form reset, native validation styles and FormData continue to work.

`value`, `defaultValue`, `onChange`, refs, `name`, `form`, `required`, length constraints, disabled/read-only states, adornments and ARIA attributes follow Input. `autoComplete` can be overridden. An additional `pattern` further restricts valid email addresses; invalid author patterns are ignored without disabling email validation. Use `FieldError` and `onInvalid` for specific, localized feedback, as shown in the Email Address story.

This is a text editor with email validation, not a native `type='email'` input: it preserves typed whitespace (which is invalid), reports `patternMismatch` rather than `typeMismatch`, and accepts one address only. `type`, `inputMode` and `multiple` are fixed by the component. Internationalized domain names must be provided in ASCII/Punycode form; it does not convert them. Keep `Input type='email'` when native email sanitization or multiple-address entry is required.

For numeric values with smooth movement, compose [NumberField](../NumberField/README.md). Put `caretMode` on `NumberFieldInput` for a per-field override; the root manages numeric values, bounds, stepping and formatting.

### Smooth caret mode

Smooth movement is the default, including without a provider. Use `InputConfigProvider` around the application or a form to change that default. `caretMode='smooth'` adds a short glide while typing or moving within a line; `caretMode='native'` keeps the browser caret. The Storybook **Caret** toolbar switches the default across examples. Individual controls override the inherited value without remounting or changing their value.

```jsx
import { InputConfigProvider } from '@gaudi/design-system/context';
import Input from '@gaudi/design-system/core/Input';

<InputConfigProvider caretMode='smooth'>
  <Input aria-label='Project name' />
  <Input caretMode='native' aria-label='Reference code' />
</InputConfigProvider>
```

The setting reaches FieldInput, Input, EmailInput, Textarea, InputGroup controls, phone inputs, chat composers, autocomplete/combobox search fields, command search, Cascader, Questionnaire and NumberField text controls. Native text editor overlays in DataGrid inherit the setting. Set `caretMode` on the actual input part for a local override.

Editing, validation, form data, undo, autofill, selection and refs remain native. The decoration is hidden from assistive technology, stays inside the field, and uses the field's caret color and typography. Only a focused field is measured, with updates batched to animation frames; no motion dependency is required. Wrapped-line changes snap vertically.

Reduced motion, forced colors, touch selection, IME composition, selected text, read-only fields, password masking, bidirectional text and input types without browser selection APIs retain the native caret. Supported types are text, search, URL, telephone and textarea. These fallbacks preserve the browser's specialized editing UI.

Inspired by [Skiper UI's smooth caret input](https://skiper-ui.com/v1/skiper106); Gaudi's implementation uses DOM text layout and its existing motion tokens.
