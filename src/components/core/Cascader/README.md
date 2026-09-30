# Cascader

Pick a value from a nested tree: a help topic, a folder, a region and its markets. Use it when options only make sense within their parent; use a Select for a flat list.

```jsx
import { Cascader, CascaderTrigger, CascaderValue, CascaderContent, CascaderPanel, CascaderList, CascaderItems } from '@gaudi/design-system';

<Cascader items={topics} onValueChange={setTopic}>
  <CascaderTrigger aria-label='Topic'><CascaderValue /></CascaderTrigger>
  <CascaderContent>
    <CascaderPanel>
      <CascaderList><CascaderItems /></CascaderList>
    </CascaderPanel>
  </CascaderContent>
</Cascader>
```

- `items` are `{ value, label, children?, description?, icon?, disabled? }`. `mode` shows the tree as a drill-down list, Miller columns (`CascaderColumns`) or an expanding tree.
- `selectable='all'` lets branches be picked, not only leaves; `multiple` adds checkboxes and chips.
- `inline` renders the panel in the page instead of a popup. `CascaderInput`, `CascaderBreadcrumb`, `CascaderEmpty`, `CascaderStatus` and `CascaderFooter` add search, a path, empty and async states, and footer actions.
- `useCascaderLoader` fetches children on demand; `CascaderVirtualItems` windows long levels.

## Accessibility

The trigger is a combobox. Up and Down move through a level, the inline-end and inline-start arrow keys open and leave a branch, and Enter picks. A live region announces changes, and every visible or announced string comes from `labels`.
