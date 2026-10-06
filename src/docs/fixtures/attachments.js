import { aurora, dusk, lagoon, ember } from './site/artwork.js';

// Only images and the illustrative video poster have local previews. The other
// records are metadata examples, without file bodies or playable media assets.
export const attachmentExamples = [
  { id: 'cover', name: 'campaign-cover.svg', type: 'image/svg+xml', previewUrl: aurora },
  { id: 'document', name: 'launch-brief.pdf', type: 'application/pdf' },
  { id: 'audio', name: 'podcast.mp3', type: 'audio/mpeg' },
  { id: 'video', name: 'demo.mp4', type: 'video/mp4' },
  { id: 'video-poster', name: 'demo-with-poster.mp4', type: 'video/mp4', previewUrl: ember },
  { id: 'link', name: 'API Documentation', kind: 'link', type: 'text/html' },
  { id: 'code', name: 'route.ts', type: 'text/typescript' },
  { id: 'sheet', name: 'results.csv', type: 'text/csv' },
  { id: 'study', name: 'color-study.svg', type: 'image/svg+xml', previewUrl: dusk },
  { id: 'banner', name: 'launch-banner.svg', type: 'image/svg+xml', previewUrl: lagoon }
];
