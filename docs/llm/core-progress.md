# Progress

> Core/Progress · core · `@gaudi/design-system/core/Progress`

Determinate and indeterminate progress with a readable task label.

## Import

```js
import Progress from '@gaudi/design-system/core/Progress';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `ProgressRing`, `ProgressRoot`, `default`, `normalizeProgress`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | — | no | Accessible name of the progress indicator. |
| `value` | `number` | — | no | Completed amount; omit for indeterminate progress. |
| `max` | `number` | `100` | no | Total amount. |
| `valueText` | `string` | — | no | Human-readable progress such as 3 of 8 files. |
| `tone` | `accent \| success \| warning \| danger` | `accent` | no | Status color. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `tone`: `accent`, `success`, `warning`, `danger`

## Usage

```jsx
import Progress from '@gaudi/design-system/core/Progress';

<Progress value={completed} max={total} label='Upload progress' />
```

## Accessibility

Provide a task label and meaningful value text. Avoid announcing every small progress update.

## Examples

- Playground (Storybook `core-progress--playground`)
- Indeterminate (Storybook `core-progress--indeterminate`)
- Progress ring (Storybook `core-progress--ring`)

Curated patterns:

- Multi-step — registry item `@gaudi/progress-multi-step` (uses `ProgressRoot`, `RegistryIcon`)
- Sizes and colors — registry item `@gaudi/progress-sizes-colors` (uses `ProgressRoot`, `Slider`)
- Status messages — registry item `@gaudi/progress-status-messages` (uses `ProgressRoot`)
- File upload list — registry item `@gaudi/progress-upload-list` (uses `Item`, `ItemContent`, `ItemGroup`, `ItemMedia`, `ItemTitle`, `ProgressRoot`, `RegistryIcon`)

## README

A progress bar for one task. `Progress` adds a label and an optional value text to the `ProgressRoot` bar; use
`ProgressRoot` on its own when the label lives elsewhere (a stepper, a series box, a file row).

```jsx
import Progress, { ProgressRoot } from '@gaudi/design-system/core/Progress';

<Progress label='Uploading references' value={31} max={50} valueText='31 of 50 files' tone='accent' />
<ProgressRoot value={62} aria-label='Series progress' />
```

- `value` is clamped between 0 and a finite positive `max` (default 100). Omit it when the amount of work is unknown: the bar
  stays indeterminate instead of inventing a percentage, and stays still for reduced motion.
- `valueText` is shown beside the label and announced as the value; `tone` is `accent`, `success`, `warning` or `danger`.
- The bar is a `progressbar` named by the label, with `aria-valuenow` and `aria-valuemax`.

### Progress ring

`ProgressRing` is the circular form for compact places such as board cards and table cells. It carries the same
`progressbar` semantics as the bar: pass `label` (or `aria-labelledby`), `value`, `max`, an optional `valueText`, a
`tone` (accent, info, success, warning, danger, discovery, attention, neutral) and a `size` (xs, sm, md, lg). `showValue`
prints the percentage in the centre at md and lg.

```jsx
import { ProgressRing } from '@gaudi/design-system';

<ProgressRing value={58} tone='success' label='BUG-452 completion' />
```
