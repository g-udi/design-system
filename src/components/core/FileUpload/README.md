# FileUpload

Controlled file selection with type, size and count limits. files and onFilesChange own the selection. getFileState supplies progress/error/success, and onRetry/onCancel delegate transport actions.

## Usage

```jsx
const [files, setFiles] = useState([]);
<FileUpload
  files={files}
  onFilesChange={setFiles}
  multiple
  accept='.pdf,.md'
  maxFiles={3}
  maxSize={5000000}
/>;
```

## API

| Prop / export           | Type                       | Contract                                                                         |
| ----------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| `files / onFilesChange` | File[] / function          | Controlled selected files. Existing server attachments belong in a ResourceList. |
| `accept / multiple`     | string / boolean           | Native accept syntax and single/multiple selection.                              |
| `maxSize / maxFiles`    | number                     | Bytes and count. Negative/NaN limits allow zero; omission removes a limit.       |
| `onReject`              | function([{file, reason}]) | Reports type, size or count rejection; never clears a valid existing selection.  |
| `getFileState`          | function(file)             | Supplies status, measured progress and error text.                               |
| `onRetry / onCancel`    | function(file)             | Host-owned transport actions; the component starts no requests.                  |
| `labels`                | object                     | Overrides chooser, rejection, progress, success and action copy.                 |
| `useFileUpload`         | hook                       | Headless state (previews, drag, errors) for custom upload surfaces; same `accept` rules. |
| `formatBytes`           | function(bytes, decimals)  | Formats a size such as `1.8MB`; FileUpload uses it for each row.                 |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
