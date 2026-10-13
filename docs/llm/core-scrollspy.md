# Scrollspy

> Core/Scrollspy · core · `@gaudi/design-system/core/Scrollspy`

Track the visible section and navigate a long document using anchor links.

## Import

```js
import { Scrollspy } from '@gaudi/design-system/core/Scrollspy';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Scrollspy`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `targetRef` | `RefObject<HTMLElement>` | — | no | Scrollable region or ScrollArea viewport to observe. Omit to track the document. |
| `onUpdate` | `(activeId: string \| null) => void` | — | no | Respond to the active section changing. |
| `offset` | `number` | `0` | no | Compensate for sticky headers. |
| `smooth` | `boolean` | `true` | no | Smooth scrolling when an anchor is clicked. |
| `history` | `boolean` | `false` | no | Opt in to rewriting the page URL hash to the active section. |
| `dataAttribute` | `string` | `scrollspy` | no | Attribute identifying tracked content. |
| `fallbackToFirst` | `boolean` | `true` | no | Mark the first section before it reaches the offset. Disable for an index whose first target appears later in the article; onUpdate then receives null before that target. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { Scrollspy } from '@gaudi/design-system/core/Scrollspy';
import Button from '@gaudi/design-system/core/Button';

<>
<Scrollspy targetRef={articleRef}>
  <Button data-scrollspy-anchor='overview'>Overview</Button>
  <Button data-scrollspy-anchor='details'>Details</Button>
</Scrollspy>
<div ref={articleRef}>
  <section id='overview'><h2>Overview</h2>{overview}</section>
  <section id='details'><h2>Details</h2>{details}</section>
</div>
</>
```

## Accessibility

Use real links with valid targets. Preserve focus and allow navigation without motion.

## Examples

- Playground (Storybook `core-scrollspy--playground`)

Curated patterns:

- Top navigation — registry item `@gaudi/scrollspy-top-navigation` (uses `Button`, `ScrollArea`, `Scrollspy`)

## Related

`core-scrollarea`

## README

Highlights the link for the section currently in view and scrolls to a section when its link is clicked. Use it for a table of contents beside a long document or a scrollable panel.

```jsx
import { useRef } from 'react';
import { ScrollArea, Scrollspy } from '@gaudi/design-system';

const targetRef = useRef(null);

<Scrollspy targetRef={targetRef} offset={44}>
  <button data-scrollspy-anchor='overview'>Overview</button>
  <button data-scrollspy-anchor='usage'>Usage</button>
</Scrollspy>
<div ref={targetRef}>
  <ScrollArea className='h-72'>
    <section id='overview'>…</section>
    <section id='usage'>…</section>
  </ScrollArea>
</div>
```

Each anchor names the id of its section; the active anchor gets `data-active="true"` for styling and `onUpdate` receives its id. `offset` reserves room for a sticky header, `smooth` animates the jump, and `history` (off by default) writes the active section to the URL hash. Point `targetRef` at `document` to follow the page scroll.
