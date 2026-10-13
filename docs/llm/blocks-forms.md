# Forms

> Blocks/Forms · blocks · `@gaudi/design-system/blocks/Forms`

Form behaviour on the Core Field parts: validation with accessible errors, a summary that takes focus after a failed submit, values you edit in place and live character counts.

## Import

```js
import Forms from '@gaudi/design-system/blocks/Forms';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `CharacterCount`, `EditableField`, `FormErrorSummary`, `default`, `useFormValidation`, `validators`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `useFormValidation({ initialValues, rules, validateOn })` | `hook` | `validateOn 'blur'` | no | Values, errors and handlers. Rules map a field name to one validator or a list, run in order; errors show on blur or submit and re-check as the person types. |
| `form.field(name, { describedBy })` | `props` | — | no | id, name, value, onChange, onBlur, aria-invalid and aria-describedby for a text-like control. |
| `form.setValue / setValues / handleSubmit / reset` | `functions` | — | no | Update values, block invalid submits (onValid receives the values) and restore a state. |
| `validators` | `required \| email \| minLength \| maxLength \| pattern \| min \| max` | — | no | Message-returning validators; custom rules receive (value, values). |
| `FormErrorSummary.form` | `form` | — | no | Lists errors after a submit, takes focus and links each entry to its control. |
| `labels` | `Record<name, string>` | — | no | Lists errors after a submit, takes focus and links each entry to its control. |
| `title` | `string` | — | no | Lists errors after a submit, takes focus and links each entry to its control. |
| `EditableField.label` | `string` | — | no | A label and value with Edit; Save calls onSave and closes, a thrown error keeps it open. |
| `value` | `any` | — | no | A label and value with Edit; Save calls onSave and closes, a thrown error keeps it open. |
| `onSave` | `(value) => void \| Promise` | — | no | A label and value with Edit; Save calls onSave and closes, a thrown error keeps it open. |
| `EditableField.validate / format / renderControl` | `function` | — | no | Message for an invalid draft, how the value reads, and a custom control instead of Input. |
| `CharacterCount.value` | `string` | — | no | Remaining characters, announced politely near the limit; reference the id from aria-describedby. |
| `max` | `number` | — | no | Remaining characters, announced politely near the limit; reference the id from aria-describedby. |
| `id` | `string` | — | no | Remaining characters, announced politely near the limit; reference the id from aria-describedby. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `validators`: `required`, `email`, `minLength`, `maxLength`, `pattern`, `min`, `max`

## Usage

```jsx
import { FormErrorSummary, useFormValidation, validators } from '@gaudi/design-system/blocks/Forms';
import Button from '@gaudi/design-system/core/Button';
import { EmailInput } from '@gaudi/design-system/core/Input';

function ContactForm() {
  const form = useFormValidation({
    initialValues: { email: '' },
    rules: { email: [validators.required('Enter an email.'), validators.email()] }
  });
  return <form onSubmit={form.handleSubmit(saveContact)}>
    <FormErrorSummary form={form} labels={{ email: 'Email' }} />
    <EmailInput aria-label='Email' {...form.field('email')} />
    <Button type='submit'>Save contact</Button>
  </form>;
}
```

## Accessibility

Errors sit next to their control, are linked with aria-describedby and mark it aria-invalid. The summary is an alert that receives focus and moves focus to a field from each link. EditableField returns focus to Edit after Save, Cancel or Escape.

## Notes

- Lay out rows with FieldGroup and Field orientation=responsive; Forms adds behaviour, not layout.

## Examples

- Playground (Storybook `blocks-forms--playground`)
- Continue working during a field save (Storybook `blocks-forms--async-field-save`)

Curated patterns:

- Developer · Create an API key — registry item `@gaudi/forms-api-key` (uses `Alert`, `AlertDescription`, `AlertTitle`, `Badge`, `Button`, `CheckboxRoot`, `CodeBlockGroup`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `FormErrorSummary`, `Input`, `RadioGroup`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Textarea`, `useCopyToClipboard`, `useFormValidation`, `validators`)
- Launch · New app with live summary — registry item `@gaudi/forms-app-launch` (uses `Badge`, `Button`, `Calendar`, `CardContent`, `CardFooter`, `CardRoot`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `FormErrorSummary`, `Input`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RadioGroup`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `useFormValidation`, `validators`)
- Feedback · Article survey — registry item `@gaudi/forms-article-feedback` (uses `Button`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `FormErrorSummary`, `ProgressRoot`, `Rating`, `Textarea`, `ToggleGroupItem`, `ToggleGroupRoot`, `useFormValidation`, `validators`)
- Compliance · Business verification — registry item `@gaudi/forms-business-verification` (uses `Badge`, `Button`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FormErrorSummary`, `Input`, `ProgressRoot`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `useFormValidation`, `validators`)
- Checkout · Address and payment — registry item `@gaudi/forms-checkout` (uses `Alert`, `AlertDescription`, `AlertTitle`, `Button`, `CheckboxRoot`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `FormErrorSummary`, `Input`, `PhoneInput`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Separator`, `useFormValidation`, `validators`)
- Contact · Message with error summary — registry item `@gaudi/forms-contact` (uses `Alert`, `AlertDescription`, `AlertTitle`, `Button`, `CharacterCount`, `CheckboxRoot`, `EmailInput`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FormErrorSummary`, `Input`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Textarea`, `useFormValidation`, `validators`)
- Onboarding · Customer intake — registry item `@gaudi/forms-customer-intake` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `CheckboxRoot`, `Combobox`, `ComboboxChip`, `ComboboxChips`, `ComboboxChipsInput`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxItem`, `ComboboxList`, `ComboboxValue`, `EmailInput`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FieldSeparator`, `FormErrorSummary`, `Input`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Textarea`, `ToggleGroupItem`, `ToggleGroupRoot`, `useComboboxAnchor`, `useFormValidation`, `validators`)
- Events · Registration with email code — registry item `@gaudi/forms-event-registration` (uses `Badge`, `Button`, `CheckboxRoot`, `EmailInput`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `FormErrorSummary`, `Input`, `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `NumberField`, `NumberFieldDecrement`, `NumberFieldGroup`, `NumberFieldIncrement`, `NumberFieldInput`, `NumberFieldScrubArea`, `RadioGroup`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `useFormValidation`, `validators`)
- Billing · Hosted checkout setup — registry item `@gaudi/forms-hosted-checkout` (uses `Badge`, `Button`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `CheckboxRoot`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSeparator`, `FieldSet`, `FormErrorSummary`, `Input`, `Link`, `NumberField`, `NumberFieldDecrement`, `NumberFieldGroup`, `NumberFieldIncrement`, `NumberFieldInput`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `SwitchRoot`, `useFormValidation`, `validators`)
- Billing · Invoice with line items — registry item `@gaudi/forms-invoice` (uses `Badge`, `Button`, `Calendar`, `Combobox`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxInput`, `ComboboxItem`, `ComboboxList`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `FormErrorSummary`, `Input`, `InputGroupAddon`, `InputGroupText`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Separator`, `TableBodyPrimitive`, `TableCaption`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`, `Textarea`, `useFormValidation`, `validators`)
- Commerce · New product — registry item `@gaudi/forms-new-product` (uses `Badge`, `Button`, `CharacterCount`, `CheckboxRoot`, `Combobox`, `ComboboxChip`, `ComboboxChips`, `ComboboxChipsInput`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxItem`, `ComboboxList`, `ComboboxValue`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FormErrorSummary`, `Input`, `NumberField`, `NumberFieldDecrement`, `NumberFieldGroup`, `NumberFieldIncrement`, `NumberFieldInput`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `SwitchRoot`, `Textarea`, `cn`, `formatBytes`, `useComboboxAnchor`, `useFileUpload`, `useFormValidation`, `validators`)
- Newsletter · Signup and preferences — registry item `@gaudi/forms-newsletter` (uses `Button`, `CheckboxRoot`, `EmailInput`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `RadioGroup`, `RegistryIcon`, `useFormValidation`, `validators`)
- Profile · Card with completion and office hours — registry item `@gaudi/forms-profile-card` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Calendar`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FieldSeparator`, `Input`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Textarea`, `useFormValidation`, `validators`)
- Profile · Tabs with audit rail — registry item `@gaudi/forms-profile-tabs` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `EmailInput`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `Input`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `SwitchRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `cn`, `useFormValidation`, `validators`)
- Security · Sign-in policy — registry item `@gaudi/forms-sign-in-policy` (uses `Alert`, `AlertDescription`, `AlertTitle`, `Button`, `CheckboxRoot`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `Input`, `NumberField`, `NumberFieldDecrement`, `NumberFieldGroup`, `NumberFieldIncrement`, `NumberFieldInput`, `NumberFieldScrubArea`, `RadioGroup`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Slider`, `SwitchRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `useFormValidation`)
- Support · Ticket details — registry item `@gaudi/forms-support-ticket` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `EditableField`, `Input`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Textarea`, `validators`)
- Team · Invite with permissions — registry item `@gaudi/forms-team-invite` (uses `Alert`, `AlertDescription`, `AlertTitle`, `Badge`, `Button`, `CheckboxRoot`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FormErrorSummary`, `Input`, `InputGroup`, `InputGroupInput`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `SwitchRoot`, `Tree`, `TreeItem`, `TreeItemLabel`, `useFormValidation`, `validators`)

## Related

`core-field`, `core-input`

## README

Form behaviour for blogs and applications on top of the Core Field parts: validation with accessible errors, a summary
that takes focus after a failed submit, values you edit in place and live character counts. Layout stays with
`FieldGroup` and `Field` (use `orientation='responsive'` for label-control rows); Forms adds behaviour, not wrappers.

```jsx
import { FormErrorSummary, useFormValidation, validators } from '@gaudi/design-system/blocks/Forms';
import { FieldError, FieldGroup, FieldLabel, FieldRoot as Field } from '@gaudi/design-system/core/Field';
import { EmailInput } from '@gaudi/design-system/core/Input';

const form = useFormValidation({
  initialValues: { email: '' },
  rules: { email: [validators.required('Enter your email address.'), validators.email()] }
});

<form noValidate onSubmit={form.handleSubmit(subscribe)}>
  <FormErrorSummary form={form} labels={{ email: 'Email' }} />
  <Field data-invalid={form.errors.email ? true : undefined}>
    <FieldLabel htmlFor={form.id('email')}>Email</FieldLabel>
    <EmailInput {...form.field('email')} />
    <FieldError id={form.errorId('email')}>{form.errors.email}</FieldError>
  </Field>
</form>
```

### API

| Prop / export                                        | Type                                      | Contract                                                                                  |
| ---------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `useFormValidation({ initialValues, rules, validateOn })` | hook                                  | Form state. `rules` maps a name to a validator or a list; `validateOn` is `blur` or `submit`. |
| `form.field(name, { describedBy })`                  | props                                     | `id`, `name`, `value`, `onChange`, `onBlur`, `aria-invalid` and `aria-describedby`.       |
| `form.id(name)` / `form.errorId(name)`               | string                                    | Control and error ids, also used by the summary links.                                    |
| `form.setValue` / `setValues` / `handleSubmit` / `reset` | functions                             | Update values, block invalid submits (`onValid(values)`), restore a state.                |
| `validators`                                         | required, email, minLength, maxLength, pattern, min, max | Message-returning checks; custom rules receive `(value, values)`.                |
| `FormErrorSummary`                                   | `form`, `labels`, `title`                 | After a failed submit, lists each error, takes focus and links to the control.            |
| `EditableField`                                      | `label`, `value`, `onSave`, `validate`, `format`, `renderControl` | Value with Edit; Enter saves, Escape cancels, a thrown save error keeps it open. |
| `CharacterCount`                                     | `value`, `max`, `id`                      | Remaining characters, announced politely near the limit.                                  |

### Accessibility

- Errors sit beside their control, are referenced by `aria-describedby` and set `aria-invalid`.
- Format validators pass on empty values, so optional fields stay optional; add `validators.required` when needed.
- `FormErrorSummary` is an alert that receives focus; each link moves focus to its field, or to the first control in a
  group such as a rating or a checkbox list.
- `EditableField` returns focus to its Edit button after Save, Cancel or Escape.
