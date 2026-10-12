# ChatTool

> Chat/ChatTool · chat · `@gaudi/design-system/chat/ChatTool`

One tool call with status, input and output as data, nested calls and a retry, plus ChatMessageToolApproval for calls that wait on the person.

## Import

```js
import ChatTool from '@gaudi/design-system/chat/ChatTool';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatMessageData`, `ChatMessageTool`, `ChatMessageToolApproval`, `approvalStates`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string` | — | no | Tool name. |
| `status` | `pending \| running \| done \| failed \| cancelled \| awaiting \| denied` | `pending` | no | Status badge; failed opens with the error. |
| `defaultOpen` | `boolean` | `false` | no | Initial disclosure; a failed call opens on its own. |
| `input` | `unknown` | — | no | Shown with ChatMessageData. |
| `output` | `unknown` | — | no | Shown with ChatMessageData. |
| `error` | `string` | — | no | Shown with ChatMessageData. |
| `onRetry` | `function` | — | no | Retry a failed call. |
| `ChatMessageData.value` | `unknown` | — | no | A list or table with a JSON view. |
| `label` | `string` | — | no | A list or table with a JSON view. |
| `ChatMessageToolApproval.state / defaultState / onStateChange` | `requested \| approved \| denied \| executed` | `requested` | no | Approval lifecycle; control it to move to executed with the result as children. |
| `ChatMessageToolApproval.onApprove` | `({ always }) => void` | — | no | The person’s decision; always is the “always allow” choice. |
| `onDeny` | `() => void` | — | no | The person’s decision; always is the “always allow” choice. |
| `ChatMessageToolApproval.allowAlways` | `boolean` | `false` | no | Offer “always allow”, explain a denial, and replace the copy. |
| `reason` | `ReactNode` | — | no | Offer “always allow”, explain a denial, and replace the copy. |
| `labels` | `object` | `English copy` | no | Offer “always allow”, explain a denial, and replace the copy. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `status`: `pending`, `running`, `done`, `failed`, `cancelled`, `awaiting`, `denied`

## Usage

```jsx
import { ChatMessageTool, ChatMessageToolApproval } from '@gaudi/design-system/chat';

<>
<ChatMessageTool name='schedule_newsletter' status={status} input={input} output={output} error={error} onRetry={retry} />

<ChatMessageToolApproval
  name='publish_post'
  description='Publish the draft to the blog'
  input={{ slug: 'local-first-drafts' }}
  allowAlways
  onApprove={({ always }) => approve(always)}
  onDeny={deny}
/>
</>
```

## Accessibility

The header is a disclosure naming the tool and status; errors are alerts. An approval is a labelled group; after a decision focus moves to its outcome, which is a status message.

## Notes

- See Agent run on Chat/ChatReasoning for an approval inside a full agent run, with approve and deny.

## Examples

- Playground (Storybook `chat-chattool--playground`)
- Structured data with a JSON view (Storybook `chat-chattool--structured-data`)
- A running call fails (Storybook `chat-chattool--failure-recovery`)
- A delayed approval keeps reader focus (Storybook `chat-chattool--controlled-approval`)

Curated patterns:

- Running tools — registry item `@gaudi/chat-tool-running-tools` (uses `ChatAgentMark`, `ChatMessage`, `ChatMessageAvatar`, `ChatMessageContent`, `ChatMessageHeader`, `ChatMessageParts`)

## Related

`blocks-chat`, `chat-chatreasoning`

## README

One tool call the assistant made: its name and status, the input and output as readable data with a JSON view, nested calls, and an error with a retry. `ChatMessageToolApproval` is the call that waits for the person: what the tool wants to do, Approve or Deny (optionally "always allow"), then approved, denied or executed.

### Usage

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

### API

| Prop / part | Contract |
| --- | --- |
| `status` | pending, running, done, failed or cancelled; `awaiting` and `denied` for approvals. |
| `input` / `output` / `error` | Shown with ChatMessageData; a failed call opens on its own with the error. |
| `onRetry` | Adds a retry to a failed call. |
| `ChatMessageData` | `value` read as a list or table, with a JSON view; `label` names it. Keys retain their supplied casing and numbers are not localized implicitly. Pass prepared strings when formatting is needed. |
| `ChatMessageToolApproval.state` | `requested`, `approved`, `denied` or `executed`; uncontrolled it follows the person's choice (`defaultState`, `onStateChange`). |
| `ChatMessageToolApproval.onApprove` / `onDeny` | The decision; `onApprove` receives `{ always }`. |
| `ChatMessageToolApproval.allowAlways` / `reason` / `labels` | Offer "always allow", explain a denial, and replace any copy. Children are the result once `executed`. |

### Accessibility

The tool header is a disclosure button naming the tool and its status. Errors are alerts. The JSON view is a labelled toggle. An approval is a group named by its question; Approve and Deny are plain buttons, and after a decision focus moves to the outcome, which is also a status message.
