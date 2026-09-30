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
- Use a skeleton when the layout is known; use `Spinner` for short waits or when the shape is unknown.
