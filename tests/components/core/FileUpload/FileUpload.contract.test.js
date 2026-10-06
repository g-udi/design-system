import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent, renderComponent } from '../../../support/renderComponent.js';

test('FileUpload preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/FileUpload/FileUpload.jsx', import.meta.url),
    {
      label: 'Attachments',
      disabled: true,
      multiple: true,
      accept: '.pdf',
      files: []
    }
  );
  assert.match(html, /type="file"/);
  assert.match(html, /accept=".pdf"/);
  assert.match(html, /multiple=""/);
  assert.match(html, /disabled=""/);
});

import { selectFiles } from '../../../../src/components/core/FileUpload/fileSelection.js';
const file = (name, type, size = 10) => ({ name, type, size });
test('selection retains existing files and explains type, size and count failures', () => {
  const current = file('notes.md', 'text/markdown');
  const next = file('paper.pdf', 'application/pdf');
  const result = selectFiles(
    [current],
    [
      next,
      file('extra.pdf', 'application/pdf'),
      file('photo.png', 'image/png'),
      file('large.pdf', 'application/pdf', 200)
    ],
    { multiple: true, accept: '.md,.pdf', maxFiles: 2, maxSize: 100 }
  );
  assert.deepEqual(result.files, [current, next]);
  assert.deepEqual(
    result.rejected.map((item) => item.reason),
    ['count', 'type', 'size']
  );
});
test('invalid replacement never clears the current single-file choice', () => {
  const current = file('paper.pdf', 'application/pdf');
  assert.deepEqual(
    selectFiles([current], [file('photo.png', 'image/png')], { accept: '.pdf' })
      .files,
    [current]
  );
  assert.deepEqual(
    selectFiles([current], [file('next.pdf', 'application/pdf')], {
      maxFiles: 0
    }).files,
    [current]
  );
});
test('wildcards, uppercase extensions and repeated references are handled consistently', () => {
  const image = file('PHOTO.PNG', 'image/png');
  assert.deepEqual(
    selectFiles([], [image, image], { multiple: true, accept: 'image/*' })
      .files,
    [image]
  );
  assert.deepEqual(selectFiles([], [image], { accept: '.png' }).files, [image]);
});

test('file sizes remain readable for fractional bytes and invalid sizes', async () => {
  const { formatBytes } = await loadComponent(new URL('../../../../src/components/core/FileUpload/use-file-upload.js', import.meta.url));
  assert.equal(formatBytes(0.5), '0.5Bytes');
  assert.equal(formatBytes(-1), '0 Bytes');
  assert.equal(formatBytes(Infinity), '0 Bytes');
  assert.equal(formatBytes(1024), '1KB');
});
