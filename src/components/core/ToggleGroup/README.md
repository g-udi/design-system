# ToggleGroup

Single or multiple selection for view modes and formatting. Pass label, options, type, controlled value and onValueChange, or defaultValue. Single selection can be cleared.

## Usage

```jsx
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';

<ToggleGroup
  label='Collection view'
  defaultValue='list'
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'board', label: 'Board' }
  ]}
/>;
```

## Accessibility

Radix owns roving focus and pressed/checked semantics. Every option has readable text or an explicit ariaLabel.

## Examples

ViewMode, Multiple, DisabledOptions in Storybook. All examples support light and dark themes.
