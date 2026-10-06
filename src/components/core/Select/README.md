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
- The options API composes the shared `Combobox` trigger, popup, search input and rows; keyboard navigation, focus and viewport collision handling belong to that primitive.

## Composition

`@gaudi/design-system/core/Select` also exports the compound families: `SelectRoot` with `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`; `Combobox*` (with chips for multiple values); `Autocomplete*`; and `NativeSelect`, `NativeSelectOption`, `NativeSelectOptGroup`.

## Accessibility

The trigger is a button with `aria-haspopup='listbox'`. Arrow keys, Home and End highlight options; disabled options remain discoverable but cannot be selected. Enter selects an enabled option, and Escape closes and returns focus to the trigger. Give every select a visible label or `aria-label`.
