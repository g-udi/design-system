# FileTree

> MDX/FileTree · mdx · `@gaudi/design-system/mdx/FileTree`

Static file and folder listings for technical documentation.

## Import

```js
import FileTree from '@gaudi/design-system/mdx/FileTree';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `Array<{ name, isFolder?, childrenProp?, isOpen? }>` | `[]` | no | Recursive file and folder records. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
<FileTree data={[
  { name: 'content', isFolder: true, childrenProp: [{ name: 'post.mdx' }] },
  { name: 'package.json' }
]} />
```

## Accessibility

The listing preserves nested list semantics and has a named keyboard-scrollable region. isOpen controls which authored branches are shown; use Core/Tree for an interactive file explorer.

## Examples

- Playground (Storybook `mdx-filetree--playground`)

## Related

`core-tree`
