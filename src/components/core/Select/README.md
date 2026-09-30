# Select

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
- The trigger, popup and rows share their styling with the `SelectTrigger`, `SelectContent` and `SelectItem` parts.

## Composition

`@gaudi/design-system/core/Select` also exports the compound families: `SelectRoot` with `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`; `Combobox*` (with chips for multiple values); `Autocomplete*`; and `NativeSelect`, `NativeSelectOption`, `NativeSelectOptGroup`.

## Accessibility

The trigger is a button with `aria-haspopup='listbox'`. Arrow keys, Home and End move through enabled options, Enter or Space picks, and Escape closes and returns focus to the trigger. Give every select a visible label or `aria-label`.
