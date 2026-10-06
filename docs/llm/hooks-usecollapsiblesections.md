# useCollapsibleSections

> Hooks/Layout/useCollapsibleSections · hooks · `@gaudi/design-system/hooks`

Coordinates individual and bulk disclosure for settings pages, filter sidebars, FAQs and inspectors. The initial expansion is read once; onChange receives the expanded ids after each change. The pure reducer is exported too.

## Import

```js
import { useCollapsibleSections } from '@gaudi/design-system/hooks';
```

Exports: `useCollapsibleSections`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `config.sections` | `string[]` | — | no | Every section id. |
| `config.initialExpanded / expandAll` | `string[] / boolean` | `[] / false` | no | Sections open at first, or all of them. |
| `config.onChange` | `(expanded: string[]) => void` | — | no | Called after each change. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `isExpanded(id)` | `boolean` | Whether a section is open. |
| `expandedSections / expandedCount` | `string[] / number` | The open sections. |
| `allExpanded / allCollapsed` | `boolean` | For the bulk buttons. |
| `toggle / expand / collapse` | `(id) => void` | Change one section. |
| `expandAll / collapseAll / setExpanded` | `function` | Change many at once. |

## Usage

```jsx
import { useCollapsibleSections } from '@gaudi/design-system/hooks';

const sections = useCollapsibleSections({ sections: ['profile', 'billing', 'privacy'], initialExpanded: ['profile'] });
```

## Accessibility

Render each section with Collapsible or Accordion so triggers expose aria-expanded. Disable "Expand all" when everything is open rather than hiding it, so the controls do not move.

## Notes

- `collapsibleSectionsReducer`, `createCollapsibleSectionsState` and `areAllSectionsExpanded` are exported.

## Examples

- Settings with expand and collapse all (Storybook `hooks-layout-usecollapsiblesections--settings-page`)

## Related

`core-accordion`
