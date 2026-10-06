# EmptyState

> Core/EmptyState · core · `@gaudi/design-system/core/EmptyState`

Explain empty collections, unavailable results and the next useful action.

## Import

```js
import EmptyState from '@gaudi/design-system/core/EmptyState';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — | no | Short statement of the empty state. |
| `description` | `ReactNode` | — | no | Cause or next step. |
| `titleAs` | `div \| h2 \| h3 \| h4 \| h5 \| h6` | `div` | no | Renders the title as a heading at the level that fits the page outline; the look stays the same. EmptyTitle takes the same value as `as`. |
| `icon` | `ReactNode` | — | no | Decorative illustration or icon. |
| `actions` | `ReactNode` | — | no | Create, reset or retry actions. |
| `compact` | `boolean` | `false` | no | Reduced spacing inside small panels. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `titleAs`: `div`, `h2`, `h3`, `h4`, `h5`, `h6`

## Usage

```jsx
import EmptyState from '@gaudi/design-system/core/EmptyState';
import Button from '@gaudi/design-system/core/Button';

<EmptyState title='No projects yet' description='Create a project to start organizing your work.'
  actions={<Button onClick={createProject}>Create project</Button>} />
```

## Accessibility

The title and description carry the meaning. Give actions specific names and avoid announcing a stable empty state repeatedly.

## Examples

- Playground (Storybook `core-emptystate--playground`)
- First Article (Storybook `core-emptystate--first-article`)

Curated patterns:

- Illustrated empty states — registry item `@gaudi/empty-illustrated` (uses `Button`, `Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Inside a card — registry item `@gaudi/empty-in-card` (uses `Button`, `CardContent`, `CardDescription`, `CardHeader`, `CardRoot`, `CardTitle`, `Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `RegistryIcon`)
- Not found with search — registry item `@gaudi/empty-not-found` (uses `Button`, `Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyTitle`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `KbdRoot`, `Link`, `RegistryIcon`, `useHotkey`)
- Surfaces and actions — registry item `@gaudi/empty-surfaces-actions` (uses `Button`, `Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `Link`, `RegistryIcon`, `useFileUpload`)

## README

An empty state explains why a list, search or panel has nothing to show and offers the next step: create the first item, clear filters, or go elsewhere.

```jsx
import { Button, EmptyState, Icon } from '@gaudi/design-system';

<EmptyState
  title='Make room for your first idea'
  description='Start a draft and build it into something worth sharing.'
  icon={<Icon name='FileText' decorative size='sm' />}
  actions={<Button onClick={createDraft}>Write an article</Button>}
/>
```

- `icon` sits in a small muted tile and is hidden from assistive tech.
- `actions` takes one or two buttons; lead with the action that fixes the situation.
- `compact` tightens the padding for cards and side panels.
- It is plain content, not a live region. Pass `role='status'` when it appears in response to a user action.
- For custom layouts (illustrations, search fields, inline links), compose `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription` and `EmptyContent`.
