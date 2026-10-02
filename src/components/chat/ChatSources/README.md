# ChatSources

Where an answer came from: numbered inline citations that open a popover with the source, and the list of sources under the reply with the same numbers.

## Usage

```jsx
import { MessageCitation, MessageSources } from '@gaudi/design-system/chat';

<p>Readers leave early <MessageCitation index={1} source={sources[0]} /> on long posts.</p>
<MessageSources sources={sources} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `MessageSources.sources` | `{ title, url?, kind?, site?, excerpt? }`; collapsed to a count by default. |
| `MessageCitation` | `index` and `source`; a button that opens the source in a popover. |
| `MessageSource` | One row of the list. |

## Accessibility

Each citation is a button named "Source 1: title"; it opens on click or Enter, and links leave the page with clear names.
