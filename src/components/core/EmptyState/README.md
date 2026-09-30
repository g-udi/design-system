# EmptyState

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
