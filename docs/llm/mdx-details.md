# Details

> MDX/Details · mdx · `@gaudi/design-system/mdx/Details`

Expandable article details with an explicit summary.

## Import

```js
import Details from '@gaudi/design-system/mdx/Details';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `articleAccordion`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — | no | Disclosure summary. |
| `headingLevel` | `number` | `2` | no | Level of the heading that wraps the disclosure button; the title renders once. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `HTML div props` | `HTMLAttributes<HTMLDivElement>` | — | no | Additional attributes on the content region. |

## Usage

```jsx
<Details title='Implementation detail'>
  Expanded article content that is useful but not required for the main reading path.
</Details>
```

## Accessibility

The summary button exposes its expanded state and supports keyboard disclosure. Keep the summary descriptive when the content is collapsed.

## Examples

- Playground (Storybook `mdx-details--playground`)
