# Wizard

> Blocks/Wizard · blocks · `@gaudi/design-system/blocks/Wizard`

A guided multi-step form with validation, progress and recoverable completion.

## Import

```js
import Wizard from '@gaudi/design-system/blocks/Wizard';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `steps` | `Array<{ id, label, description? }>` | `[]` | no | Ordered steps. |
| `children` | `ReactNode \| (activeIndex: number) => ReactNode` | — | no | Render content or fields for the zero-based active step. |
| `validateStep` | `function` | — | no | Validate before allowing the next step. |
| `onComplete` | `function \| async function` | — | no | Commit the completed flow. |
| `title / description` | `ReactNode` | — | no | Flow heading and instructions. |
| `completeLabel / completionTitle` | `string` | `Finish / All set` | no | Final action and completion heading. |
| `completionDescription / errorMessage / validationMessage` | `string` | `Built-in feedback` | no | Completion and recoverable failure text. |
| `labels` | `Record<string, string>` | `{}` | no | Navigation labels. |
| `indicator` | `steps \| progress \| dots \| vertical` | `steps` | no | Numbered steps, a progress bar, compact dots, or a vertical step list beside the form. |
| `aside` | `ReactNode \| (activeIndex, complete) => ReactNode` | — | no | A live summary or preview beside the form. |
| `navigable` | `boolean` | `false` | no | Let people jump back to any completed step; steps ahead stay behind validation. |
| `completion` | `ReactNode` | — | no | Replaces the default finished state, e.g. a celebration with next actions. |

## Variants

- `indicator`: `steps`, `progress`, `dots`, `vertical`

## Usage

```jsx
import Wizard from '@gaudi/design-system/blocks/Wizard';

<Wizard steps={steps} validateStep={validateStep} onComplete={save}>
  {stepIndex => steps[stepIndex].id === 'details' ? detailsForm : review}
</Wizard>
```

## Accessibility

Announce the active step, errors and completion. Keep entered values when validation or saving fails.

## Examples

- Playground (Storybook `blocks-application-wizard--playground`)
- Failed Completion (Storybook `blocks-application-wizard--failed-completion`)

Curated patterns:

- Add a product — registry item `@gaudi/screens-add-product` (uses `Badge`, `Button`, `Field`, `FieldError`, `FieldLabel`, `Input`, `NativeSelect`, `NativeSelectOption`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `RegistryIcon`, `TableBodyPrimitive`, `TableCaption`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`, `Textarea`, `ToggleGroupItem`, `ToggleGroupRoot`, `Wizard`)
- Plan upgrade — registry item `@gaudi/screens-plan-upgrade` (uses `EmailInput`, `Field`, `FieldDescription`, `FieldError`, `FieldLabel`, `Input`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `RadioGroup`, `Separator`, `ToggleGroupItem`, `ToggleGroupRoot`, `Wizard`)
- Send an invoice — registry item `@gaudi/screens-send-invoice` (uses `Button`, `Field`, `FieldError`, `FieldLabel`, `Input`, `NativeSelect`, `NativeSelectOption`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `RegistryIcon`, `TableBodyPrimitive`, `TableCaption`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`, `Textarea`, `Wizard`)
- Send money — registry item `@gaudi/screens-send-money` (uses `Alert`, `AlertDescription`, `AlertTitle`, `Combobox`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxInput`, `ComboboxItem`, `ComboboxList`, `Field`, `FieldDescription`, `FieldError`, `FieldLabel`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `RadioGroup`, `RegistryIcon`, `Wizard`)
- Invite your team — registry item `@gaudi/screens-team-invite` (uses `AvatarFallback`, `AvatarRoot`, `Badge`, `Button`, `Field`, `FieldDescription`, `FieldError`, `FieldLabel`, `Label`, `NativeSelect`, `NativeSelectOption`, `RegistryIcon`, `SwitchRoot`, `Textarea`, `Wizard`)
- Vendor onboarding — registry item `@gaudi/screens-vendor-onboarding` (uses `CheckboxRoot`, `Field`, `FieldDescription`, `FieldError`, `FieldLabel`, `Input`, `Label`, `NativeSelect`, `NativeSelectOption`, `Wizard`)

## Related

`core-flow`, `blocks-navigation`

## README

Sequential setup with async validation, back navigation, serialized submission, failure recovery and completion. Hosts own field values above the wizard, validateStep(index), and onComplete. A changed sequence of step IDs resets the flow and discards stale results.

### Usage

```jsx
const [name, setName] = useState('');
<Wizard
  title='Create a collection'
  steps={[
    { id: 'details', label: 'Details' },
    { id: 'review', label: 'Review' }
  ]}
  validateStep={() => Boolean(name.trim())}
  onComplete={saveCollection}
>
  {(step) =>
    step === 0 ? (
      <Input
        aria-label='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    ) : (
      <p>{name}</p>
    )
  }
</Wizard>;
```

### API

| Prop / export                                               | Type                                           | Contract                                                                               |
| ----------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| `steps`                                                     | {id, label, description?}[]                    | Ordered stable stage IDs; changing the sequence resets the flow.                       |
| `children`                                                  | function(index)                                | Stage content. Keep form values above Wizard.                                          |
| `validateStep`                                              | function(index) => boolean or Promise<boolean> | False prevents progress. All preceding stages are rechecked before advance/completion. |
| `onComplete`                                                | function() => void or Promise<void>            | Required host action; rejection retains the form for retry.                            |
| `title / description`                                       | ReactNode                                      | Flow context.                                                                          |
| `completionTitle / completionDescription`                   | ReactNode                                      | Success content after the callback resolves.                                           |
| `labels / completeLabel / errorMessage / validationMessage` | object / string                                | Localized action and state copy.                                                       |
| `indicator`                                                 | steps, progress, dots or vertical              | Numbered steps, a progress bar, compact dots or a vertical list beside the form.       |
| `aside`                                                     | ReactNode or function(index, complete)         | A live summary or preview beside the form.                                             |
| `navigable`                                                 | boolean                                        | Completed steps become buttons that go back; steps ahead stay behind validation.       |
| `completion`                                                | ReactNode                                      | Replaces the default finished state, for example a celebration with next actions.      |

### Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
