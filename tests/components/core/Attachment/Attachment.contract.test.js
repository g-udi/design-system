import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/Attachment/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/core/Attachment/stories/fixtures/attachment/attachment-assistant-reply.jsx', import.meta.url));

test('Attachment publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.Attachment, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});

test('AttachmentMedia identifies mixed file types and honors explicit MIME metadata', () => {
  for (const [file, icon] of [
    [{ name: 'recording', type: 'Audio/MPEG; codecs=mp3' }, 'music'],
    [{ name: 'demo.MP4' }, 'video'],
    [{ name: 'cover.jpg', type: 'application/pdf' }, 'file-text'],
    [{ name: 'cover.png', type: 'text/plain' }, 'file-text'],
    [{ name: 'draft.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }, 'file-text'],
    [{ name: 'slides.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }, 'file-text'],
    [{ name: 'recording.mp3', type: 'application/octet-stream' }, 'music'],
    [{ name: 'API Documentation', kind: 'link' }, 'globe'],
    [{ name: 'budget.xlsx' }, 'file-spreadsheet'],
    [{ name: 'notes.json' }, 'file-code'],
    [{ name: 'archive.zip' }, 'file-archive'],
    [{ name: 'unknown' }, 'file-text']
  ]) {
    const html = renderToStaticMarkup(createElement(publicAPI.AttachmentMedia, { file }));
    assert.match(html, new RegExp(`lucide-${icon}`), file.name);
    assert.doesNotMatch(html, /<img/, 'an icon never fetches the file itself');
  }
});

test('AttachmentMedia uses supplied thumbnails and preserves custom children and icon-only composition', () => {
  const file = { name: 'demo.mp4', type: 'video/mp4', previewUrl: '/static/images/art/0.svg' };
  const preview = renderToStaticMarkup(createElement(publicAPI.AttachmentMedia, { file }));
  assert.match(preview, /data-variant="image"/);
  assert.match(preview, /<img[^>]*src="\/static\/images\/art\/0.svg"[^>]*alt=""/);
  const icon = renderToStaticMarkup(createElement(publicAPI.AttachmentMedia, { file, variant: 'icon' }));
  assert.doesNotMatch(icon, /<img/);
  assert.match(icon, /lucide-video/);
  const custom = renderToStaticMarkup(createElement(publicAPI.AttachmentMedia, { file }, createElement('span', null, 'Custom media')));
  assert.match(custom, /Custom media/);
  assert.doesNotMatch(custom, /<img|<svg/);
});
