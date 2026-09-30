# Attachment

A file row or tile with media, a name, a status line and actions. Use it in composer trays, upload queues and messages; `state` drives the idle, uploading, processing, done and error styling.

## Usage

```jsx
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from '@gaudi/design-system';

<Attachment state='error'>
  <AttachmentMedia><RegistryIcon lucide='SheetIcon' aria-hidden='true' /></AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>subscribers.csv</AttachmentTitle>
    <AttachmentDescription>Failed · connection dropped</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label='Retry subscribers.csv'><RegistryIcon lucide='RotateCwIcon' aria-hidden='true' /></AttachmentAction>
  </AttachmentActions>
</Attachment>
```

## Parts

| Part | Contract |
| --- | --- |
| `Attachment` | `state`, `size` (default, sm, xs) and `orientation` (horizontal, vertical). |
| `AttachmentMedia` | `variant` icon or image. |
| `AttachmentTitle`, `AttachmentDescription` | File name and status line; both truncate. |
| `AttachmentActions`, `AttachmentAction` | Icon buttons built on Button (`size='icon-xs'`, ghost by default). |
| `AttachmentTrigger` | A full-card button or link, for selectable tiles. |
| `AttachmentGroup` | A horizontally scrolling strip. |

## Accessibility

Name every icon-only action after its file ("Remove report.pdf") so a list of buttons stays distinguishable.
