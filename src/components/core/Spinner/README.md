# Spinner

A spinner shows that something is working: a save, a search, a page loading. It is announced as a status with its `label`.

```jsx
import { Button, Spinner } from '@gaudi/design-system';

<Button disabled>
  <Spinner size='xs' label='Saving draft' className='text-current' />
  Saving draft
</Button>
```

- `size`: `xs` 12px for inline text and buttons, `sm` 16px, `md` 20px, `lg` 32px for panels and page states.
- It uses the accent colour; pass `className='text-current'` to follow the surrounding text, or a tone class such as `text-text-muted`.
- Give it a `label` that says what is happening. Use `Skeleton` instead when the shape of the coming content is known.
