# Marker

A row that pairs a small icon with a line of content, for run logs, change lists and status steps. `variant` sets the
look: `default` (plain row), `separator` (a labelled divider between groups) or `border` (rows divided by rules).

```jsx
import { Marker, MarkerContent, MarkerIcon } from '@gaudi/design-system';

<Marker variant='separator'><MarkerContent>Editing</MarkerContent></Marker>
<Marker variant='border'>
  <MarkerIcon><Icon name='SquarePen' decorative /></MarkerIcon>
  <MarkerContent>Edited src/billing/invoice.ts</MarkerContent>
</Marker>
```

`MarkerIcon` is decorative, so keep the meaning in the content. `asChild` renders the marker as your own element, such as a link.
