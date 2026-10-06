# Skeleton

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

## Shimmer

`Shimmer` is the text counterpart: a highlight sweeps across a label while work is in progress, such as "Thinking…" in a chat reply or "Searching the web…" in an agent step.

```jsx
import { Shimmer } from '@gaudi/design-system';

<p role='status'><Shimmer>Searching the web…</Shimmer></p>
<Shimmer as='h3' duration={3} spread={3}>Drafting the summary</Shimmer>
```

- `duration` is one sweep in seconds (default 2); `spread` is the band width in pixels per character (default 2); `active={false}` rests it as plain text.
- The words stay real text, so they are read, selectable and translated. Put the label in a status region when the change should be announced.
- The sweep is the `shimmer` utility on the text tokens; it holds still for reduced motion and in forced-colour modes.
