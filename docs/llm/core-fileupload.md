# FileUpload

> Core/FileUpload · core · `@gaudi/design-system/core/FileUpload`

Choose or drop attachments with validation, upload progress and recovery actions.

## Import

```js
import FileUpload from '@gaudi/design-system/core/FileUpload';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `default`, `formatBytes`, `useFileUpload`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `files / onFilesChange` | `File[] / (files: File[]) => void` | `[]` | no | Host-owned file selection. |
| `label / description` | `string` | `Attachments / Choose files or drop them here.` | no | Visible label and instructions. |
| `accept` | `string` | — | no | Accepted MIME types or extensions. |
| `multiple` | `boolean` | `false` | no | Allow more than one file. |
| `maxFiles / maxSize` | `number` | — | no | Count and byte limits. |
| `onReject` | `function` | — | no | Receives rejected-file feedback. |
| `getFileState / onRetry / onCancel` | `function` | — | no | Read upload state and perform host-owned retry or cancellation. |
| `disabled` | `boolean` | — | no | Disable new selections. |
| `labels` | `Record<string, string>` | `{}` | no | Localized action and validation labels. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import FileUpload from '@gaudi/design-system/core/FileUpload';

<FileUpload label='Attachments' files={files} onFilesChange={setFiles} multiple
  accept='image/*,application/pdf' getFileState={getUploadState} onRetry={retryUpload} onCancel={cancelUpload} />
```

## Accessibility

The native file input remains keyboard accessible. Announce rejection reasons and retain valid files.

## Notes

- Selecting files does not upload them. The application owns storage, network requests and cancellation.

## Examples

- Playground (Storybook `core-fileupload--playground`)
- File Limits (Storybook `core-fileupload--file-limits`)
- Progress And Recovery (Storybook `core-fileupload--progress-and-recovery`)

Curated patterns:

- Profile photo picker — registry item `@gaudi/file-upload-avatar` (uses `Alert`, `AlertDescription`, `AlertTitle`, `Button`, `RegistryIcon`, `cn`, `formatBytes`, `useFileUpload`)
- Banner image for a page — registry item `@gaudi/file-upload-cover-image` (uses `Alert`, `AlertDescription`, `AlertTitle`, `Button`, `ProgressRing`, `RegistryIcon`, `cn`, `formatBytes`, `useFileUpload`)
- Drag and drop — registry item `@gaudi/file-upload-drag-drop` (uses `Alert`, `AlertDescription`, `AlertTitle`, `Button`, `RegistryIcon`, `cn`, `formatBytes`, `useFileUpload`)
- Upload table with progress — registry item `@gaudi/file-upload-progress-table` (uses `Alert`, `AlertDescription`, `AlertTitle`, `AttachmentMedia`, `Badge`, `Button`, `ProgressRing`, `RegistryIcon`, `TableBodyPrimitive`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`, `cn`, `formatBytes`, `useFileUpload`)
- Image gallery with sorting — registry item `@gaudi/file-upload-sortable-gallery` (uses `Alert`, `AlertDescription`, `AlertTitle`, `Button`, `CardContent`, `CardRoot`, `DialogContent`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `ProgressRoot`, `RegistryIcon`, `Sortable`, `SortableItem`, `SortableItemHandle`, `cn`, `formatBytes`, `useFileUpload`)

## README

Controlled file selection with type, size and count limits. files and onFilesChange own the selection. getFileState supplies progress/error/success, and onRetry/onCancel delegate transport actions.

### Usage

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

### API

| Prop / export           | Type                       | Contract                                                                         |
| ----------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| `files / onFilesChange` | File[] / function          | Controlled selected files. List existing server attachments with Attachment.     |
| `accept / multiple`     | string / boolean           | Native accept syntax and single/multiple selection.                              |
| `maxSize / maxFiles`    | number                     | Bytes and count. Negative/NaN limits allow zero; omission removes a limit.       |
| `onReject`              | function([{file, reason}]) | Reports type, size or count rejection; never clears a valid existing selection.  |
| `getFileState`          | function(file)             | Supplies status, measured progress and error text.                               |
| `onRetry / onCancel`    | function(file)             | Host-owned transport actions; the component starts no requests.                  |
| `labels`                | object                     | Overrides chooser, rejection, progress, success and action copy.                 |
| `useFileUpload`         | hook                       | Headless state (previews, drag, errors) for custom upload surfaces; same `accept` rules. |
| `formatBytes`           | function(bytes, decimals)  | Formats a size such as `1.8MB`; FileUpload uses it for each row.                 |

### Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
