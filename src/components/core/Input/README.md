# Input

A single-line text field for names, emails, URLs, numbers and dates. `prefix` and `suffix` add text or icons inside the border (they render as InputGroup addons); every native attribute and the ref reach the input itself. Wrap it in a Field for its label, help and error.

For buttons, menus or several addons inside the border, compose `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText` and `InputGroupInput` directly.

## Usage

```jsx
import Input from '@gaudi/design-system/core/Input';

<Field>
  <FieldLabel>Email address</FieldLabel>
  <Input
    name='email'
    type='email'
    autoComplete='email'
    placeholder='you@example.com'
  />
  <FieldDescription>Used for your reading digest.</FieldDescription>
</Field>;
```

## Chat composer

`PromptComposer` is a multi-line prompt on InputGroup. It covers the parts a chat input needs:

- `@` anywhere, or `/` at the very start, opens a listbox of `mentions` or `commands`. Arrow keys move, Enter or Tab inserts, and Escape closes.
- An attachment tray and an attach button (`onAttach`, `onRemoveAttachment`).
- A `toolbar` slot for model or effort pickers.
- Send or stop. Enter sends and Shift+Enter adds a line. While a reply streams (`status='streaming'`), Stop appears and sending reports `{ queued: true }`, so the host can hold the message in `PromptQueue`.

`PromptQueue` lists waiting messages. Each one can be edited in place (Enter saves, Escape cancels), sent now, removed, or moved with Alt+Arrow.

```jsx
import { PromptComposer, PromptQueue } from '@gaudi/design-system/core/Input';

<PromptQueue items={queue} onEdit={edit} onRemove={remove} onSendNow={sendNow} onMove={move} />
<PromptComposer
  status={streaming ? 'streaming' : 'ready'}
  mentions={people}
  commands={commands}
  onSubmit={(text, { queued, mentions, command, attachments }) => (queued ? enqueue(text) : send(text))}
  onStop={stop}
/>
```

## Accessibility

Visible labels are connected through Field. Inputs retain native validation, autocomplete and form submission.

## Examples

The Playground shows icon and text adornments with the invalid and disabled states; the catalogue adds native types, password strength, every addon placement and the chat composer (mentions and commands, a queue while a reply streams, model and effort).
