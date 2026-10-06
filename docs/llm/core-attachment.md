# Attachment

> Core/Attachment · core · `@gaudi/design-system/core/Attachment`

File attachments with metadata, previews, actions and upload states.

## Import

```js
import { Attachment } from '@gaudi/design-system/core/Attachment';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Attachment`, `AttachmentAction`, `AttachmentActions`, `AttachmentContent`, `AttachmentDescription`, `AttachmentGroup`, `AttachmentMedia`, `AttachmentTitle`, `AttachmentTrigger`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `state` | `idle \| uploading \| processing \| done \| error` | `done` | no | State exposed to the attachment styling. |
| `size` | `default \| sm \| xs` | `default` | no | Density of the attachment row. |
| `orientation` | `horizontal \| vertical` | `horizontal` | no | Arrangement of media, details and actions. |
| `AttachmentMedia.variant` | `icon \| image` | `automatic with file, otherwise icon` | no | Presentation of the media slot; icon suppresses a supplied thumbnail. |
| `AttachmentMedia.file` | `{ name, type?, mediaType?, fileType?, kind?, previewUrl? }` | — | no | Shared file-type icons for image, audio, video, document, code, spreadsheet, archive and link. A host-provided thumbnail falls back to its type icon if loading fails; explicit children take precedence. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `state`: `idle`, `uploading`, `processing`, `done`, `error`
- `size`: `default`, `sm`, `xs`
- `orientation`: `horizontal`, `vertical`

## Usage

```jsx
import { Attachment, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription } from '@gaudi/design-system/core/Attachment';

const file = { name: 'report.pdf', type: 'application/pdf', description: 'PDF · ready to send' };

<Attachment>
  <AttachmentMedia file={file} />
  <AttachmentContent>
    <AttachmentTitle>{file.name}</AttachmentTitle>
    <AttachmentDescription>{file.description}</AttachmentDescription>
  </AttachmentContent>
</Attachment>
```

## Accessibility

Use descriptive filenames and name every icon action. Keep retry and remove actions available when an upload fails.

## Examples

- Playground (Storybook `core-attachment--playground`)
- Mixed media · detailed rows (Storybook `core-attachment--mixed-media`)
- Mixed media · wrapping pills (Storybook `core-attachment--compact-pills`)
- Images · thumbnail grid (Storybook `core-attachment--image-grid`)

Curated patterns:

- Files in an assistant reply — registry item `@gaudi/attachment-assistant-reply` (uses `Attachment`, `AttachmentAction`, `AttachmentActions`, `AttachmentContent`, `AttachmentDescription`, `AttachmentGroup`, `AttachmentMedia`, `AttachmentTitle`, `RegistryIcon`)
- Composer tray with removable files — registry item `@gaudi/attachment-composer-tray` (uses `Attachment`, `AttachmentAction`, `AttachmentActions`, `AttachmentContent`, `AttachmentGroup`, `AttachmentMedia`, `AttachmentTitle`, `FieldLabelPrimitive`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupTextarea`, `RegistryIcon`)
- File picker that fills a tray — registry item `@gaudi/attachment-file-picker` (uses `Attachment`, `AttachmentAction`, `AttachmentActions`, `AttachmentContent`, `AttachmentDescription`, `AttachmentMedia`, `AttachmentTitle`, `AttachmentTrigger`, `RegistryIcon`, `formatBytes`, `useFileUpload`)
- Image thumbnail strip — registry item `@gaudi/attachment-thumbnail-strip` (uses `Attachment`, `AttachmentContent`, `AttachmentGroup`, `AttachmentMedia`, `AttachmentTitle`, `AttachmentTrigger`)

## README

A file row, compact pill or image tile with media, a name, a status line and actions. Use the same parts for images, documents, audio, video, links, source files and spreadsheets in composer trays, upload queues and messages. `state` drives the idle, uploading, processing, done and error styling.

### Usage

```jsx
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from '@gaudi/design-system';
import { RegistryIcon } from '@gaudi/design-system/icons';

const file = { id: 'cover', name: 'campaign-cover.jpg', type: 'image/jpeg', previewUrl: '/uploads/campaign-cover.jpg' };

<Attachment>
  <AttachmentMedia file={file} />
  <AttachmentContent>
    <AttachmentTitle title={file.name}>{file.name}</AttachmentTitle>
    <AttachmentDescription>Image · ready to send</AttachmentDescription>
  </AttachmentContent>
  <AttachmentTrigger aria-label={`Preview ${file.name}`} onClick={() => openPreview(file)} />
  <AttachmentActions>
    <AttachmentAction aria-label={`Remove ${file.name}`} onClick={() => remove(file.id)}><RegistryIcon lucide='X' /></AttachmentAction>
  </AttachmentActions>
</Attachment>
```

The host supplies `previewUrl` for a thumbnail or video poster. It is an image source, not a playable media URL. Without it, `AttachmentMedia` chooses an icon from the MIME type or filename extension; `kind: 'link'` chooses a globe. A failed thumbnail falls back to the file icon. File content, image previews, audio/video playback and download destinations stay with the host.

Explicit children still support custom artwork, progress or state feedback:

```jsx
<AttachmentMedia><RegistryIcon lucide='TriangleAlert' /></AttachmentMedia>
<AttachmentMedia file={file} variant='icon' />
```

The second form deliberately shows the file icon even when a preview URL exists.

### Parts

| Part | Contract |
| --- | --- |
| `Attachment` | `state`, `size` (default, sm, xs) and `orientation` (horizontal, vertical). |
| `AttachmentMedia` | Optional `file={{ name, type?, mediaType?, kind?, previewUrl? }}` provides a file icon or supplied thumbnail. MIME type takes precedence over the filename extension; `kind='link'` identifies links. Explicit children take precedence over automatic media. `variant='icon'` suppresses the thumbnail; `variant='image'` supports composed image children. |
| `AttachmentTitle`, `AttachmentDescription` | File name and status line; both truncate. |
| `AttachmentActions`, `AttachmentAction` | Icon buttons built on Button (`size='icon-xs'`, ghost by default). |
| `AttachmentTrigger` | A full-card button or link, for selectable tiles. |
| `AttachmentGroup` | A horizontally scrolling strip. |

### Layouts and examples

- [Mixed media · detailed rows](?path=/story/core-attachment--mixed-media) places full-width Attachment rows in a labelled list. It includes a local image, PDF, audio, video, a supplied poster, a link, code and a spreadsheet, with selection, removal, reset and failed-thumbnail recovery.
- [Mixed media · wrapping pills](?path=/story/core-attachment--compact-pills) uses `size='xs'` inside a `flex flex-wrap` list for compact inline attachments. Each pill stays within its parent width and retains its own remove action.
- [Images · thumbnail grid](?path=/story/core-attachment--image-grid) uses `orientation='vertical'` inside a two-column grid that expands to three columns at `sm`. Selecting a tile displays its local image preview.

Use a labelled `ul` with one `li` per attachment for wrapping pills, grids or detailed lists. `AttachmentGroup` remains useful when horizontal scrolling is intentional. The examples reuse local artwork; audio, video, document and link entries are explicitly sample metadata with no fake player or download destination.

### Accessibility

Name every icon-only action after its file ("Remove report.pdf") so a list of buttons stays distinguishable. Keep `AttachmentTrigger` and `AttachmentActions` as siblings so the full-card action never nests a remove button. The filename names the automatic decorative media; a full preview needs descriptive alternative text. Keep focus on an available control after removal, and announce selection or attachment-count changes with a concise status.
