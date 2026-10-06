# Select

> Core/Select · core · `@gaudi/design-system/core/Select`

Select renders a styled option picker with searchable combobox behavior and multi-select support.

## Import

```js
import Select from '@gaudi/design-system/core/Select';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Autocomplete`, `AutocompleteArrow`, `AutocompleteBackdrop`, `AutocompleteClear`, `AutocompleteCollection`, `AutocompleteContent`, `AutocompleteEmpty`, `AutocompleteGroup`, `AutocompleteGroupLabel`, `AutocompleteInput`, `AutocompleteItem`, `AutocompleteList`, `AutocompletePortal`, `AutocompletePositioner`, `AutocompleteRow`, `AutocompleteSeparator`, `AutocompleteStatus`, `AutocompleteTrigger`, `AutocompleteValue`, `Combobox`, `ComboboxChip`, `ComboboxChips`, `ComboboxChipsInput`, `ComboboxCollection`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxGroup`, `ComboboxInput`, `ComboboxItem`, `ComboboxLabel`, `ComboboxList`, `ComboboxSeparator`, `ComboboxTrigger`, `ComboboxValue`, `NativeSelect`, `NativeSelectOptGroup`, `NativeSelectOption`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectRoot`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`, `default`, `useComboboxAnchor`

## When to use

- Use Select when choices are bounded; use search or command palette when users need discovery across content.
- Enable `searchable` once the list is too long to scan comfortably.
- Use `multiple` only when the user truly needs a set; otherwise keep the decision singular.

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options` | `Array<{ label, value, disabled }>` | `[]` | no | Selectable options. Option children are also normalized when options is empty. |
| `value` | `string \| string[]` | — | no | Controlled selected value. Arrays are used for multiple mode. |
| `defaultValue` | `string \| string[]` | — | no | Initial uncontrolled selected value. |
| `onValueChange` | `(value, option) => void` | — | no | Called when selection changes. |
| `multiple` | `boolean` | `false` | no | Allows selecting more than one option. |
| `searchable` | `boolean` | `false` | no | Shows a search field inside the popup and filters options. |
| `placeholder` | `string` | `Select option` | no | Trigger placeholder when nothing is selected. |
| `searchPlaceholder` | `string` | `Search options...` | no | Search input placeholder. |
| `emptyText` | `string` | `No options found.` | no | Empty result text. |
| `defaultOpen` | `boolean` | `false` | no | Initial open state for demos or controlled-looking examples. |
| `disabled` | `boolean` | `false` | no | Disables the trigger. |
| `invalid` | `boolean` | `false` | no | Applies aria-invalid and error styling. |
| `name` | `string` | — | no | Renders hidden form inputs for selected values. |
| `aria-label` | `string` | — | no | Accessible label for icon-only or unlabeled select controls. |
| `children` | `ReactNode` | — | no | Option children normalized when options is empty. |
| `className` | `string` | — | no | Root class override. |
| `classNames` | `{ root, trigger, value, placeholder, chevron, popup, search, option, check, empty }` | — | no | Slot-level class overrides. |

## Usage

```jsx
import { Select } from '@gaudi/design-system';

<Select
  searchable
  multiple
  placeholder='Choose topics'
  options={[
    { label: 'Design systems', value: 'design-systems' },
    { label: 'Knowledge graphs', value: 'knowledge-graphs' },
  ]}
/>
```

## Accessibility

Select uses a native button trigger, listbox semantics, aria-expanded, aria-selected, aria-multiselectable for multi-select, and keyboard support for Arrow keys, Enter, Space, Home, End, and Escape.

## States and recovery

- Keep the existing selection when filtering returns no matches and expose `emptyText` as the recovery message.
- Invalid state must be paired with nearby text that explains the required correction; color and `aria-invalid` alone are insufficient.

## Examples

- Playground (Storybook `core-select--playground`)
- Searchable (Storybook `core-select--searchable`)
- Option children (Storybook `core-select--native-options-input`)

Curated patterns:

- Async search results — registry item `@gaudi/autocomplete-async-search` (uses `Autocomplete`, `AutocompleteContent`, `AutocompleteInput`, `AutocompleteItem`, `AutocompleteList`, `AutocompleteStatus`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Loader`)
- Autocomplete in a form — registry item `@gaudi/autocomplete-in-form` (uses `AlertDescriptionPrimitive`, `AlertRoot`, `Autocomplete`, `AutocompleteContent`, `AutocompleteEmpty`, `AutocompleteInput`, `AutocompleteItem`, `AutocompleteList`, `Button`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FieldSet`, `RegistryIcon`, `ToastProvider`, `toast`)
- Input options — registry item `@gaudi/autocomplete-input-options` (uses `Autocomplete`, `AutocompleteContent`, `AutocompleteEmpty`, `AutocompleteInput`, `AutocompleteItem`, `AutocompleteList`, `Label`)
- Grouped people search — registry item `@gaudi/autocomplete-people-search` (uses `Autocomplete`, `AutocompleteCollection`, `AutocompleteContent`, `AutocompleteEmpty`, `AutocompleteGroup`, `AutocompleteGroupLabel`, `AutocompleteInput`, `AutocompleteItem`, `AutocompleteList`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`)
- Date presets with a custom picker — registry item `@gaudi/combobox-date-presets` (uses `Button`, `Calendar`, `Combobox`, `ComboboxContent`, `ComboboxItem`, `ComboboxList`, `ComboboxSeparator`, `ComboboxTrigger`, `DialogClosePrimitive`, `DialogContent`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `FieldRoot`, `RegistryIcon`, `cn`)
- Grouped options — registry item `@gaudi/combobox-grouped` (uses `Combobox`, `ComboboxCollection`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxGroup`, `ComboboxInput`, `ComboboxItem`, `ComboboxLabel`, `ComboboxList`, `ComboboxSeparator`, `FieldLabelPrimitive`, `FieldRoot`)
- Combobox inside a dialog — registry item `@gaudi/combobox-in-dialog` (uses `Button`, `Combobox`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxInput`, `ComboboxItem`, `ComboboxList`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `FieldLabelPrimitive`, `FieldRoot`, `ToastProvider`, `toast`)
- Combobox in a form — registry item `@gaudi/combobox-in-form` (uses `Button`, `Combobox`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxInput`, `ComboboxItem`, `ComboboxList`, `FieldLabelPrimitive`, `FieldRoot`, `ToastProvider`, `toast`)
- Input options — registry item `@gaudi/combobox-input-options` (uses `Combobox`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxInput`, `ComboboxItem`, `ComboboxList`, `FieldErrorPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `InputGroupAddon`, `RegistryIcon`)
- Member tags — registry item `@gaudi/combobox-member-tags` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Combobox`, `ComboboxChip`, `ComboboxChips`, `ComboboxChipsInput`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxItem`, `ComboboxList`, `ComboboxValue`, `FieldLabelPrimitive`, `FieldRoot`, `Item`, `ItemContent`, `ItemDescription`, `ItemTitle`, `cn`, `useComboboxAnchor`)
- Multiple selection with chips — registry item `@gaudi/combobox-multiple-chips` (uses `Combobox`, `ComboboxChip`, `ComboboxChips`, `ComboboxChipsInput`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxItem`, `ComboboxList`, `ComboboxValue`, `FieldErrorPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `useComboboxAnchor`)
- Property pickers — registry item `@gaudi/combobox-property-pickers` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Button`, `Combobox`, `ComboboxCollection`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxGroup`, `ComboboxInput`, `ComboboxItem`, `ComboboxLabel`, `ComboboxList`, `ComboboxSeparator`, `ComboboxTrigger`, `ComboboxValue`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `EmailInput`, `Field`, `FieldInput`, `FieldLabel`, `Item`, `ItemContent`, `ItemDescription`, `ItemMedia`, `ItemTitle`, `RegistryIcon`, `cn`)
- Native select fields — registry item `@gaudi/native-select-fields` (uses `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `NativeSelect`, `NativeSelectOptGroup`, `NativeSelectOption`)
- Clearable select — registry item `@gaudi/select-clearable` (uses `Button`, `FieldLabelPrimitive`, `FieldRoot`, `RegistryIcon`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`)
- Options with descriptions — registry item `@gaudi/select-descriptions` (uses `FieldLabelPrimitive`, `FieldRoot`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`)
- Form fields and states — registry item `@gaudi/select-form-states` (uses `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`)
- Grouped options — registry item `@gaudi/select-grouped` (uses `FieldLabelPrimitive`, `FieldRoot`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectRoot`, `SelectSeparator`, `SelectTrigger`, `SelectValue`)
- Select inside a dialog — registry item `@gaudi/select-in-dialog` (uses `Button`, `DialogContent`, `DialogDescription`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `FieldLabelPrimitive`, `FieldRoot`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`)
- Rich option content — registry item `@gaudi/select-rich-options` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `FieldLabelPrimitive`, `FieldRoot`, `RegistryIcon`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `cn`)
- Select in a toolbar — registry item `@gaudi/select-toolbar` (uses `Button`, `FieldInput`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`)

## Related

`layout-search`

## README

Pick one or several values from a list. Use it for form fields with a known set of options; use a combobox when people type to filter a long list, an autocomplete when free text is also allowed, and a native select for the plainest, platform-styled field.

```jsx
import { Select } from '@gaudi/design-system';

<Select
  aria-label='Topics'
  options={[{ value: 'design-systems', label: 'Design systems', description: 'Tokens and components.' }]}
  multiple
  searchable
  onValueChange={setTopics}
/>
```

- `options` takes `{ value, label, description?, disabled? }`; native `<option>` children work when `options` is empty.
- `multiple` keeps the popup open and counts the selection in the trigger. `searchable` adds a filter field that matches labels and descriptions.
- `value` / `defaultValue` / `onValueChange` control the selection; `name` submits it with a form. `invalid`, `disabled` and `loading` cover the field states.
- The options API composes the shared `Combobox` trigger, popup, search input and rows; keyboard navigation, focus and viewport collision handling belong to that primitive.

### Composition

`@gaudi/design-system/core/Select` also exports the compound families: `SelectRoot` with `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`; `Combobox*` (with chips for multiple values); `Autocomplete*`; and `NativeSelect`, `NativeSelectOption`, `NativeSelectOptGroup`.

### Accessibility

The trigger is a button with `aria-haspopup='listbox'`. Arrow keys, Home and End highlight options; disabled options remain discoverable but cannot be selected. Enter selects an enabled option, and Escape closes and returns focus to the trigger. Give every select a visible label or `aria-label`.
