# Forms

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

## API

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

## Accessibility

- Errors sit beside their control, are referenced by `aria-describedby` and set `aria-invalid`.
- Format validators pass on empty values, so optional fields stay optional; add `validators.required` when needed.
- `FormErrorSummary` is an alert that receives focus; each link moves focus to its field, or to the first control in a
  group such as a rating or a checkbox list.
- `EditableField` returns focus to its Edit button after Save, Cancel or Escape.
