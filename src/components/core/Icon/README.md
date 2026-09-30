# Icon

This Gaudi owner includes **icon-stack**, **icon-tile**, with **23 practical examples**.

Import the documented composition from `@gaudi/design-system/core/Icon`. Existing convenience names are preserved; compound roots use explicit aliases where needed.

[Open the first example](http://localhost:6007/?path=/story/core-icon--icon-stack-pattern-1) for the complete JSX and public imports. The Storybook catalogue lists every variant and use case under this owner.

Provide visible labels for controls, preserve heading order, and connect controlled values to application state. The examples exercise keyboard and accessibility behavior; application networking and persistence remain consumer responsibilities.

See [reconciliation and compatibility details](../../../../PATTERN-COVERAGE.md) and [source notices](../../../../THIRD_PARTY_NOTICES.md).

## Interactive icons

`AnimatedIcon` extends this owner with 395 registry names and aliases, a searchable
and paginated gallery, action/status compositions, and controlled motion examples.
The gallery is also at the top of the flat Icons guide.

```jsx
import { AnimatedIcon } from '@gaudi/design-system/icons';

<AnimatedIcon name="Bell" active={hovered || focused} size="md" color="primary" />
<AnimatedIcon name="RefreshCw" active={isSyncing} size="sm" label="Syncing" />
```

`active` defaults to false. Use the parent control's pointer/focus state or application
status, and keep action callbacks and labels on that control. Motion pauses for
reduced motion, offscreen placement, and hidden documents. SVG refs and props are
forwarded; size tokens and semantic colors match static Icon. Numeric size is also
supported. Brands retain static artwork.

The same exports are available through `@gaudi/design-system` and
`@gaudi/design-system/core/Icon`. See [artwork and lifecycle documentation](../../../icons/animated/README.md)
for sources, alias reconciliation, licenses, and regeneration instructions.
