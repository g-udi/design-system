# Cascader

> Core/Cascader · core · `@gaudi/design-system/core/Cascader`

Select items from hierarchical data using drill-down, columns, search and multiple selection.

## Import

```js
import { Cascader } from '@gaudi/design-system/core/Cascader';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `CASCADER_ACTION_CLASS`, `CASCADER_LABELS`, `CASCADER_LIST_HEIGHT_CLASS`, `CASCADER_LIST_PAD_CLASS`, `CASCADER_MORE_PREFIX`, `CASCADER_ROOT_KEY`, `CASCADER_ROWS_CLASS`, `CASCADER_SCROLL_CLASS`, `Cascader`, `CascaderAction`, `CascaderActionsContext`, `CascaderBack`, `CascaderBreadcrumb`, `CascaderChip`, `CascaderChips`, `CascaderColumnPanel`, `CascaderColumns`, `CascaderContent`, `CascaderEmpty`, `CascaderFooter`, `CascaderGroup`, `CascaderHighlightContext`, `CascaderInput`, `CascaderItem`, `CascaderItems`, `CascaderLabel`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderRenderContext`, `CascaderSeparator`, `CascaderStateContext`, `CascaderStatus`, `CascaderSubmenu`, `CascaderSubmenuContent`, `CascaderSubmenuTrigger`, `CascaderTrigger`, `CascaderValue`, `CascaderVirtualColumn`, `CascaderVirtualItems`, `applyCascadeSelection`, `buildCascaderIndex`, `collapseCascaderPath`, `collectCascaderSubtree`, `createCascaderHighlightStore`, `createCascaderMoreNode`, `filterCascaderLevel`, `findAmbiguousCascaderLabels`, `findCascaderDataIssues`, `flattenCascaderTree`, `foldCascaderText`, `getCascaderCheckedValues`, `getCascaderChildren`, `getCascaderCount`, `getCascaderFooterStops`, `getCascaderIndeterminate`, `getCascaderIndeterminateFrom`, `getCascaderMoreParent`, `getCascaderMoreProps`, `getCascaderPath`, `getCascaderSelectedDescendants`, `getCascaderTabTarget`, `isCascaderBranch`, `isCascaderMoreNode`, `isCascaderRtl`, `isCascaderSelectable`, `matchesCascaderQuery`, `mergeCascaderIndex`, `normalizeCascaderQuery`, `resetCascaderWarnings`, `resolveCascaderLabels`, `resolveCascaderSearchLabel`, `searchCascaderDeep`, `useCascader`, `useCascaderActions`, `useCascaderAnchor`, `useCascaderHasActions`, `useCascaderHighlight`, `useCascaderLoadState`, `useCascaderLoader`, `useCascaderRender`, `useCascaderSelection`, `useCascaderState`, `useCascaderSubmenu`, `useCascaderVirtualizer`, `warnCascaderOnce`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `Array<node>` | — | no | Root nodes; keep node values stable across loads. |
| `value / defaultValue / onValueChange` | `node value \| node value[] / function` | — | no | Controlled or initial selection and changes. |
| `multiple / cascade` | `boolean` | `false` | no | Enable multiple values or branch selection propagation. |
| `selectable` | `leaf \| all \| function` | `leaf` | no | Choose which nodes can be selected. |
| `mode` | `drill \| columns \| tree` | `drill` | no | Hierarchy navigation layout. |
| `getChildren / getParent / resolveValue` | `function` | — | no | Resolve remote children, ancestry and selected values. |
| `onSearch / onLoadError` | `function` | — | no | Remote search and load failure handling. |
| `disabled / readOnly / required / invalid` | `boolean` | — | no | Form and interaction state. |
| `name / form / id` | `string` | — | no | Form association and control identity. |
| `open / defaultOpen` | `boolean` | — | no | Controlled or initial open state. Use one state model for the lifetime of the component. |
| `onOpenChange` | `(open: boolean) => void` | — | no | Responds to open and close requests. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |

## Variants

- `mode`: `drill`, `columns`, `tree`

## Usage

```jsx
import { Cascader, CascaderTrigger, CascaderValue, CascaderContent, CascaderList, CascaderItems } from '@gaudi/design-system/core/Cascader';

<Cascader items={categories} value={category} onValueChange={setCategory}>
  <CascaderTrigger aria-label='Category'><CascaderValue placeholder='Choose category' /></CascaderTrigger>
  <CascaderContent><CascaderList><CascaderItems /></CascaderList></CascaderContent>
</Cascader>
```

## Accessibility

Keep loading and failure messages in the panel. Keyboard users need a clear path back to a parent and a named trigger.

## Notes

- The asynchronous examples demonstrate cancellation, remote lookup and recovery without replacing the current selection.

## Examples

- Playground (Storybook `core-cascader--playground`)
- Read-only columns (Storybook `core-cascader--read-only-columns`)

Curated patterns:

- Async drill-down — registry item `@gaudi/cascader-async-drill-down` (uses `Badge`, `Button`, `Cascader`, `CascaderBreadcrumb`, `CascaderContent`, `CascaderEmpty`, `CascaderInput`, `CascaderItems`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderStatus`, `CascaderTrigger`, `CascaderValue`, `RegistryIcon`)
- Avatars and role badges — registry item `@gaudi/cascader-avatars-roles` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Cascader`, `CascaderBreadcrumb`, `CascaderContent`, `CascaderEmpty`, `CascaderInput`, `CascaderItems`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderStatus`, `CascaderTrigger`, `CascaderValue`)
- Columns mode — registry item `@gaudi/cascader-columns` (uses `Badge`, `Button`, `Cascader`, `CascaderColumns`, `CascaderContent`, `CascaderInput`, `CascaderNav`, `CascaderPanel`, `CascaderStatus`, `CascaderTrigger`, `IconTile`, `RegistryIcon`, `cn`, `useCascaderSelection`)
- Controlled state — registry item `@gaudi/cascader-controlled` (uses `Button`, `Cascader`, `CascaderBack`, `CascaderBreadcrumb`, `CascaderContent`, `CascaderEmpty`, `CascaderInput`, `CascaderItems`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderStatus`, `CascaderTrigger`, `CascaderValue`)
- Drill-down picker — registry item `@gaudi/cascader-drill-down` (uses `Button`, `Cascader`, `CascaderBreadcrumb`, `CascaderContent`, `CascaderEmpty`, `CascaderInput`, `CascaderItems`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderStatus`, `CascaderTrigger`, `CascaderValue`, `Discord`, `Dropbox`, `GithubDark`, `GithubLight`, `GoogleDrive`, `Label`, `Loom`, `RegistryIcon`, `Slack`, `Stripe`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `Zoom`, `useCascaderSelection`)
- Form field — registry item `@gaudi/cascader-form-field` (uses `Button`, `Cascader`, `CascaderBreadcrumb`, `CascaderContent`, `CascaderEmpty`, `CascaderInput`, `CascaderItems`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderStatus`, `CascaderTrigger`, `CascaderValue`, `FieldDescriptionPrimitive`, `FieldLabelPrimitive`, `FieldRoot`)
- Multi-select with chips and presets — registry item `@gaudi/cascader-multi-select-chips` (uses `Badge`, `Button`, `Cascader`, `CascaderAction`, `CascaderBreadcrumb`, `CascaderContent`, `CascaderEmpty`, `CascaderFooter`, `CascaderGroup`, `CascaderInput`, `CascaderItems`, `CascaderLabel`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderSeparator`, `CascaderStatus`, `CascaderSubmenu`, `CascaderSubmenuContent`, `CascaderSubmenuTrigger`, `CascaderTrigger`, `CascaderValue`, `RegistryIcon`, `cn`, `useCascaderSelection`, `useCascaderSubmenu`)
- Cascading tree in a popover — registry item `@gaudi/cascader-popover-tree` (uses `Button`, `Cascader`, `CascaderContent`, `CascaderEmpty`, `CascaderInput`, `CascaderItems`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderStatus`, `CascaderTrigger`, `RegistryIcon`, `useCascaderSelection`)
- Recently used groups — registry item `@gaudi/cascader-recent-groups` (uses `Button`, `Cascader`, `CascaderBreadcrumb`, `CascaderContent`, `CascaderEmpty`, `CascaderGroup`, `CascaderInput`, `CascaderItem`, `CascaderLabel`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderSeparator`, `CascaderStatus`, `CascaderTrigger`, `CascaderValue`, `RegistryIcon`, `useCascaderActions`, `useCascaderState`)
- Translated labels — registry item `@gaudi/cascader-translated` (uses `Button`, `Cascader`, `CascaderBreadcrumb`, `CascaderContent`, `CascaderEmpty`, `CascaderInput`, `CascaderItems`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderStatus`, `CascaderTrigger`, `CascaderValue`)
- Two-line rows with branch colours — registry item `@gaudi/cascader-two-line-rows` (uses `Button`, `Cascader`, `CascaderBreadcrumb`, `CascaderContent`, `CascaderEmpty`, `CascaderInput`, `CascaderItems`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderStatus`, `CascaderTrigger`, `CascaderValue`, `IconTile`, `RegistryIcon`, `cn`)
- Virtualized rows — registry item `@gaudi/cascader-virtualized` (uses `Badge`, `Button`, `Cascader`, `CascaderBreadcrumb`, `CascaderContent`, `CascaderEmpty`, `CascaderInput`, `CascaderList`, `CascaderNav`, `CascaderPanel`, `CascaderStatus`, `CascaderTrigger`, `CascaderValue`, `CascaderVirtualItems`, `LoaderRoot`, `RegistryIcon`)

## Related

`core-select`

## README

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
- `selectable='any'` lets branches be picked, not only leaves; `multiple` adds checkboxes and chips.
- `inline` renders the panel in the page instead of a popup. `CascaderInput`, `CascaderBreadcrumb`, `CascaderEmpty`, `CascaderStatus` and `CascaderFooter` add search, a path, empty and async states, and footer actions.
- `useCascaderLoader` fetches children on demand; `CascaderVirtualItems` windows long levels.
- `readOnly` preserves selection across active and background columns; `disabled` also disables navigation and dims every row. Both constraints follow prop changes.

### Accessibility

The trigger is a combobox. Up and Down move through a level, the inline-end and inline-start arrow keys open and leave a branch, and Enter picks. A live region announces changes, and every visible or announced string comes from `labels`.

### Implementation ownership

`Cascader` coordinates the controlled state and contexts. Owner-local hooks manage prepared rows, announcements, navigation and the Combobox callback contract. Trigger/chip and panel rendering live in private `components/` modules; the loader remains responsible for asynchronous children.
