import { useState } from 'react';
import FileUpload from '@gaudi/design-system/core/FileUpload';

// A realistic queue: a finished photo, a brief mid-upload, and a spreadsheet that failed.
// Sized files so each row shows a realistic weight.
export const sized = (name, type, kilobytes) => new File([new Uint8Array(kilobytes * 1024)], name, { type });
export const photo = sized('hero-photo.png', 'image/png', 1840);
export const brief = sized('design-brief.pdf', 'application/pdf', 2460);
export const budget = sized('budget-2026.xlsx', 'application/vnd.ms-excel', 640);
export const added = sized('meeting-notes.md', 'text/markdown', 12);
const queue = [
  [photo, { status: 'success' }],
  [brief, { status: 'uploading', progress: 64 }],
  [budget, { status: 'error', error: 'Connection dropped. Try again.' }]
];

export function UploadQueue({ multiple, onFilesChange, onRetry, onCancel, ...props }) {
  // A single-file picker keeps one file; a multiple picker holds the whole queue.
  const [files, setFiles] = useState(() => queue.slice(0, multiple ? queue.length : 1).map(([item]) => item));
  const [states, setStates] = useState(() => new Map(queue));
  const update = (next) => {
    setFiles(next);
    onFilesChange?.(next);
  };
  return (
    <FileUpload
      {...props}
      multiple={multiple}
      files={files}
      onFilesChange={update}
      getFileState={(item) => states.get(item)}
      onRetry={(item) => {
        setStates((current) => new Map(current).set(item, { status: 'uploading', progress: 12 }));
        onRetry?.(item);
      }}
      onCancel={(item) => {
        update(files.filter((entry) => entry !== item));
        onCancel?.(item);
      }}
    />
  );
}
