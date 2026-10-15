# Skeleton

> Core/Skeleton · core · `@gaudi/design-system/core/Skeleton`

Skeleton renders non-semantic loading placeholders on the theme border token, so blocks read clearly in light and dark themes. Shimmer is the text counterpart: a highlight that sweeps across a label such as Thinking… while work is in progress. SkeletonMorph grows placeholders into the loaded content block by block instead of swapping them.

## Import

```js
import Skeleton from '@gaudi/design-system/core/Skeleton';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Shimmer`, `SkeletonMorph`, `SkeletonMorphBlock`, `SkeletonRoot`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | no | Defines shape, width, height, radius, and layout placement. |
| `as` | `ElementType` | `div` | no | Element to render; use 'span' inside text such as a paragraph or link. |
| `Shimmer.children` | `ReactNode` | — | no | Text that shimmers while work is in progress, such as Thinking… or Searching the web…; it stays real, readable text. |
| `Shimmer.active` | `boolean` | `true` | no | Run or rest the sweep, seconds per sweep, and band width in pixels per character. |
| `duration` | `number` | `2` | no | Run or rest the sweep, seconds per sweep, and band width in pixels per character. |
| `spread` | `number` | `2` | no | Run or rest the sweep, seconds per sweep, and band width in pixels per character. |
| `Shimmer.as` | `ElementType` | `span` | no | Element to render, such as p or h3. |
| `SkeletonMorph.loading` | `boolean` | — | no | Shows placeholders while true; when it turns false each block resizes into its content in document order. |
| `SkeletonMorph.label` | `string` | — | no | Status message announced while loading, such as Loading profile. |
| `SkeletonMorph.as` | `ElementType` | `div` | no | Element or component for the region, such as CardContent. |
| `SkeletonMorphBlock.width / height` | `number \| string` | — | no | Placeholder size; numbers are pixels. Ignored once loaded, when the block takes its content size. |
| `SkeletonMorphBlock.lines` | `number` | — | no | Text placeholder: that many lines at the content line height, the last one shorter. |
| `lineHeight` | `number \| string` | `20` | no | Text placeholder: that many lines at the content line height, the last one shorter. |
| `SkeletonMorphBlock.shape` | `'circle'` | — | no | Round placeholder and clip for avatars. |

## Usage

```jsx
import { Shimmer, Skeleton, SkeletonMorph, SkeletonMorphBlock } from '@gaudi/design-system';

<>
<Skeleton className='h-4 w-40' />
<p role='status'><Shimmer>Searching the web…</Shimmer></p>
<SkeletonMorph loading={!user} label='Loading profile'>
  <SkeletonMorphBlock shape='circle' width={48} height={48}><Avatar /></SkeletonMorphBlock>
  <SkeletonMorphBlock lines={2}><p>{user?.bio}</p></SkeletonMorphBlock>
</SkeletonMorph>
</>
```

## Accessibility

Skeleton is aria-hidden and should be paired with loading text or a labelled busy region when content loading needs announcement. Shimmer keeps its words as real text; put it in a status region when the change should be announced. Both hold still for reduced motion. SkeletonMorph marks its region aria-busy and announces its label in a status message while loading; placeholders stay hidden, content renders only once loaded, and reduced motion swaps without animating.

## Examples

- Playground (Storybook `core-skeleton--playground`)
- Text shimmer (Storybook `core-skeleton--text-shimmer`)

Curated patterns:

- List with avatars and actions — registry item `@gaudi/skeleton-avatar-list` (uses `Separator`, `SkeletonRoot`)
- Chat messages — registry item `@gaudi/skeleton-chat` (uses `CardContent`, `CardRoot`, `SkeletonRoot`)
- Dashboard stats and table — registry item `@gaudi/skeleton-dashboard` (uses `CardContent`, `CardHeader`, `CardRoot`, `SkeletonRoot`)
- Form — registry item `@gaudi/skeleton-form` (uses `SkeletonRoot`)
- Media card — registry item `@gaudi/skeleton-media-card` (uses `CardContent`, `CardFooter`, `CardHeader`, `CardRoot`, `SkeletonRoot`)
- Skeleton morph — registry item `@gaudi/skeleton-morph` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `CardAction`, `CardContent`, `CardHeader`, `CardRoot`, `CardTitle`, `RegistryIcon`, `SkeletonMorph`, `SkeletonMorphBlock`)
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
- Inside text, such as a paragraph or a link, render it as a span: `<Skeleton as='span' className='inline-block h-4 w-24' />`.
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

### Skeleton morph

`SkeletonMorph` grows its placeholders into the loaded content instead of swapping them: when `loading` turns false, each `SkeletonMorphBlock` resizes from its placeholder to its content as the content fades in, one block after another in document order.

```jsx
import { SkeletonMorph, SkeletonMorphBlock } from '@gaudi/design-system';

<SkeletonMorph loading={!user} label='Loading profile' className='flex items-start gap-3'>
  <SkeletonMorphBlock shape='circle' width={48} height={48}>
    <Avatar>…</Avatar>
  </SkeletonMorphBlock>
  <SkeletonMorphBlock width={140} lines={1}><p className='leading-5'>{user?.name}</p></SkeletonMorphBlock>
  <SkeletonMorphBlock lines={3}><p className='leading-5'>{user?.bio}</p></SkeletonMorphBlock>
</SkeletonMorph>
```

- Size each placeholder like its content: `width`/`height` for a block (numbers are pixels), or `lines` with the content's `lineHeight` (default 20) for text. `shape='circle'` is for avatars.
- Block children render only once loaded, but the JSX is still evaluated while loading, so read optional data (`user?.name`).
- The region is `aria-busy` while loading and announces `label` in a status message; `as` renders it as another element or component, such as `CardContent`. Placeholders stay hidden from assistive tech, and focus is not moved.
- Reduced motion swaps without animating. Use it for cards, short lists and dashboards whose layout is known in advance; keep plain `Skeleton` rows for long tables, where animating layout is costly, and `Loader` for waits longer than a few seconds.
