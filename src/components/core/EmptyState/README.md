# EmptyState

Empty collection, failed search, permission and recovery presentation. Supply prepared title, description, icon and action slots; compact reduces padding.

## Usage

```jsx
import EmptyState from '@gaudi/design-system/core/EmptyState';

<EmptyState
  title='Make room for your first idea'
  description='Start a draft and build it into something worth sharing.'
  icon={<Icon name='FileText' decorative size='lg' />}
  actions={
    <Button onClick={() => onCreateDraft()}>
      Write an article
    </Button>
  }
/>;
```

## Accessibility

Uses ordinary prose without forcing a live region. Hosts can pass role=status or role=alert when the state changes dynamically.

## Examples

FirstArticle, NoResults, ReadOnly in Storybook. All examples support light and dark themes.
