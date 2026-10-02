# ChatTool

One tool call the assistant made: its name and status, the input and output as readable data with a JSON view, nested calls, and an error with a retry.

## Usage

```jsx
import { MessageTool } from '@gaudi/design-system/chat';

<MessageTool name='schedule_newsletter' status={status} input={input} output={output} error={error} onRetry={retry}>
  {nestedCalls}
</MessageTool>
```

## API

| Prop / part | Contract |
| --- | --- |
| `status` | pending, running, done, failed or cancelled. |
| `input` / `output` / `error` | Shown with MessageData; a failed call opens on its own with the error. |
| `onRetry` | Adds a retry to a failed call. |
| `MessageData` | `value` read as a list or table, with a JSON view; `label` names it. |

## Accessibility

The header is a disclosure button naming the tool and its status. Errors are alerts. The JSON view is a labelled toggle.
