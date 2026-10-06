# Mermaid

> MDX/Mermaid · mdx · `@gaudi/design-system/mdx/Mermaid`

Renders host-supplied Mermaid source as a labelled diagram with a local loading and error state. Diagram colors and typography use Gaudi tokens and update when the root theme changes. Wide diagrams keep readable labels and scroll within a keyboard-focusable figure.

## Import

```js
import Mermaid from '@gaudi/design-system/mdx/Mermaid';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `chart` | `string` | — | no | Mermaid chart definition. |
| `description` | `string` | `Diagram` | no | Accessible text alternative for the rendered diagram. |
| `id` | `string` | `generated` | no | Stable Mermaid render identifier. |
| `className` | `string` | — | no | Root figure class override. |

## Usage

```jsx
<Mermaid
  id='architecture-flow'
  description='Draft moves to review before publication.'
  chart={`flowchart TD
  A[Draft] --> B[Review]`}
/>
```

## Accessibility

Mermaid exposes the rendered diagram as one labelled figure. Provide a concise description that communicates the diagram meaning without relying on shape, position, or color.

## States and recovery

- Render a readable diagram error next to the source context when Mermaid cannot parse the chart.
- Keep the page usable after a rendering failure and let authors correct the chart without losing surrounding article content.

## Examples

- Playground (Storybook `mdx-mermaid--playground`)
