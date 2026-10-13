# Code

> MDX/Code · mdx · `@gaudi/design-system/mdx/Code`

Article code rendered through the Core CodeBlock: CodeFence maps MDX pre, CodeGroup renders ::: code-group fences as tabs.

## Import

```js
import Code from '@gaudi/design-system/mdx/Code';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `CodeFence`, `CodeGroup`, `default`, `readFence`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `CodeFence` | `MDX pre props` | — | no | Reads code, language and the remarkCode data-title, data-highlight, data-line-numbers, data-start-line and data-words attributes. |
| `CodeGroup.children` | `CodeFence elements` | — | no | One tab per fence, titled by data-title or the language. |
| `CodeGroup.label` | `string` | `Code examples` | no | Accessible name for the tab list. |
| `remarkCode` | `remark plugin` | — | no | From @gaudi/design-system/mdx/remark; turns fence meta and ::: code-group blocks into what CodeFence and CodeGroup read. |

## Usage

```jsx
```tsx title="app/page.tsx" {2} showLineNumbers
export default function Page() {
  return <main>Article</main>;
}
```

::: code-group labels=[pnpm, npm]

```bash
pnpm add @gaudi/design-system
```

```bash
npm install @gaudi/design-system
```

:::
```

## Accessibility

Fences are keyboard-scrollable regions with a labelled copy button; groups are Gaudi Tabs with roving focus and labelled panels.

## Notes

- Map pre to CodeFence and CodeGroup to CodeGroup in the MDX components; add remarkCode to the remark plugins.

## Examples

- Playground (Storybook `mdx-code--playground`)

## Related

`blocks-blog-article`, `core-codeblock`, `core-map`, `core-tabs`
