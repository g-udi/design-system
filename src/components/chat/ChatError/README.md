# ChatError

A turn that failed: what went wrong, a short hint and a retry, as an alert in the thread.

## Usage

```jsx
import { MessageError } from '@gaudi/design-system/chat';

<MessageError title='The reply stopped before it finished.' onRetry={retry}>
  The connection dropped. Your message is kept.
</MessageError>
```

## API

| Prop / part | Contract |
| --- | --- |
| `title` | What went wrong. |
| `children` | A short hint. |
| `onRetry` / `retryLabel` | The retry action and its label. |

## Accessibility

The error is `role="alert"` so it is announced once. Keep the rest of the conversation usable and the user’s message intact.
