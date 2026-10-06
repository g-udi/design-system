# useDocumentTitle

> Hooks/Environment/useDocumentTitle · hooks · `@gaudi/design-system/hooks`

The most recently mounted enabled hook owns the title. Updating that owner updates the title; removing it restores the remaining owner or the original title, even if owners unmount out of order.

## Import

```js
import { useDocumentTitle } from '@gaudi/design-system/hooks';
```

Exports: `useDocumentTitle`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | — | no | Title to display. |
| `options.enabled` | `boolean` | `true` | no | Disable without changing the document title. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `return` | `undefined` | Title changes happen in effects; server output is unchanged. |

## Usage

```jsx
import { useDocumentTitle } from '@gaudi/design-system/hooks';

useDocumentTitle('Draft · Writing room');
```

## Accessibility

Use concise page titles that identify the current content. Avoid rapidly changing titles or announcing pointer movement.

## Notes

- Use framework metadata for server-rendered page titles. This hook handles client-owned surfaces.

## Examples

- Playground (Storybook `hooks-environment-usedocumenttitle--playground`)
