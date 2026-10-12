# Skeleton

> Core/Skeleton · core · `@gaudi/design-system/core/Skeleton`

Skeleton renders non-semantic loading placeholders on the theme border token, so blocks read clearly in light and dark themes. Shimmer is the text counterpart: a highlight that sweeps across a label such as Thinking… while work is in progress.

## Import

```js
import Skeleton from '@gaudi/design-system/core/Skeleton';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Shimmer`, `SkeletonRoot`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | no | Defines shape, width, height, radius, and layout placement. |
| `Shimmer.children` | `ReactNode` | — | no | Text that shimmers while work is in progress, such as Thinking… or Searching the web…; it stays real, readable text. |
| `Shimmer.active` | `boolean` | `true` | no | Run or rest the sweep, seconds per sweep, and band width in pixels per character. |
| `duration` | `number` | `2` | no | Run or rest the sweep, seconds per sweep, and band width in pixels per character. |
| `spread` | `number` | `2` | no | Run or rest the sweep, seconds per sweep, and band width in pixels per character. |
| `Shimmer.as` | `ElementType` | `span` | no | Element to render, such as p or h3. |

## Usage

```jsx
import { Shimmer, Skeleton } from '@gaudi/design-system';

<>
<Skeleton className='h-4 w-40' />
<p role='status'><Shimmer>Searching the web…</Shimmer></p>
</>
```

## Accessibility

Skeleton is aria-hidden and should be paired with loading text or a labelled busy region when content loading needs announcement. Shimmer keeps its words as real text; put it in a status region when the change should be announced. Both hold still for reduced motion.

## Examples

- Playground (Storybook `core-skeleton--playground`)
- Text shimmer (Storybook `core-skeleton--text-shimmer`)

Curated patterns:

- List with avatars and actions — registry item `@gaudi/skeleton-avatar-list` (uses `Separator`, `SkeletonRoot`)
- Chat messages — registry item `@gaudi/skeleton-chat` (uses `CardContent`, `CardRoot`, `SkeletonRoot`)
- Dashboard stats and table — registry item `@gaudi/skeleton-dashboard` (uses `CardContent`, `CardHeader`, `CardRoot`, `SkeletonRoot`)
- Form — registry item `@gaudi/skeleton-form` (uses `SkeletonRoot`)
- Media card — registry item `@gaudi/skeleton-media-card` (uses `CardContent`, `CardFooter`, `CardHeader`, `CardRoot`, `SkeletonRoot`)
- Profile page — registry item `@gaudi/skeleton-profile` (uses `CardContent`, `CardHeader`, `CardRoot`, `Separator`, `SkeletonRoot`)

## README

A skeleton is a grey placeholder in the shape of content that is still loading, so the layout does not jump when it arrives.

```jsx
import { Skeleton } from '@gaudi/design-system';

<section aria-label='Latest article' aria-busy='true' className='grid gap-3'>
  <span role='status' className='sr-only'>Loading the latest article</span>
  <Skeleton className='aspect-video w-full' />
  <Skeleton className='h-4 w-2/3' />
</section>
```

- Shape each block with `className` (height, width, `rounded-full` for avatars) to match the content it stands in for.
- Skeletons are hidden from assistive tech. Mark the region `aria-busy` and add a status message that names what is loading.
- Use a skeleton when the layout is known; use `Loader` for short waits or when the shape is unknown.

### Shimmer

`Shimmer` is the text counterpart: a highlight sweeps across a label while work is in progress, such as "Thinking…" in a chat reply or "Searching the web…" in an agent step.

```jsx
import { Shimmer } from '@gaudi/design-system';

<p role='status'><Shimmer>Searching the web…</Shimmer></p>
<Shimmer as='h3' duration={3} spread={3}>Drafting the summary</Shimmer>
```

- `duration` is one sweep in seconds (default 2); `spread` is the band width in pixels per character (default 2); `active={false}` rests it as plain text.
- The words stay real text, so they are read, selectable and translated. Put the label in a status region when the change should be announced.
- The sweep is the `shimmer` utility on the text tokens; it holds still for reduced motion and in forced-colour modes.
