# ChatFile

A file the assistant delivered, with its type icon, size and description, and preview and download actions.

## Usage

```jsx
import { MessageFile } from '@gaudi/design-system/chat';

<MessageFile name='report.csv' size='18 KB' description='Reading time per post' href={url} onPreview={preview} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `name` / `type` | The icon follows the type or extension. |
| `size` / `description` | Shown under the name. |
| `href` / `onDownload` / `onPreview` | Download as a real link or a callback; preview when provided. |

## Accessibility

Actions are named with the file ("Download report.csv").
