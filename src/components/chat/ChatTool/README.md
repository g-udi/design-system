# ChatTool

One tool call the assistant made: its name and status, the input and output as readable data with a JSON view, nested calls, and an error with a retry. `ChatMessageToolApproval` is the call that waits for the person: what the tool wants to do, Approve or Deny (optionally "always allow"), then approved, denied or executed.

## Usage

```jsx
import { ChatMessageTool, ChatMessageToolApproval } from '@gaudi/design-system/chat';

<ChatMessageTool name='schedule_newsletter' status={status} input={input} output={output} error={error} onRetry={retry}>
  {nestedCalls}
</ChatMessageTool>

<ChatMessageToolApproval
  name='publish_post'
  description='Publish the draft to the blog and email subscribers'
  input={{ slug: 'local-first-drafts', notify: 4180 }}
  allowAlways
  state={state}
  onStateChange={setState}
  onApprove={({ always }) => run({ always })}
  onDeny={cancel}
>
  {state === 'executed' ? <ChatMessageData value={result} /> : null}
</ChatMessageToolApproval>
```

## API

| Prop / part | Contract |
| --- | --- |
| `status` | pending, running, done, failed or cancelled; `awaiting` and `denied` for approvals. |
| `input` / `output` / `error` | Shown with ChatMessageData; a failed call opens on its own with the error. |
| `onRetry` | Adds a retry to a failed call. |
| `ChatMessageData` | `value` read as a list or table, with a JSON view; `label` names it. Keys retain their supplied casing and numbers are not localized implicitly. Pass prepared strings when formatting is needed. |
| `ChatMessageToolApproval.state` | `requested`, `approved`, `denied` or `executed`; uncontrolled it follows the person's choice (`defaultState`, `onStateChange`). |
| `ChatMessageToolApproval.onApprove` / `onDeny` | The decision; `onApprove` receives `{ always }`. |
| `ChatMessageToolApproval.allowAlways` / `reason` / `labels` | Offer "always allow", explain a denial, and replace any copy. Children are the result once `executed`. |

## Accessibility

The tool header is a disclosure button naming the tool and its status. Errors are alerts. The JSON view is a labelled toggle. An approval is a group named by its question; Approve and Deny are plain buttons, and after a decision focus moves to the outcome, which is also a status message.
