import briefDownloadUrl from './launch-brief.md?url';
import reportDownloadUrl from './reader-survey.csv?url';

export const workspaceFiles = {
  root: { name: 'Workspace files', children: ['shared', 'uploads', 'researcher', 'writer'] },
  shared: { name: 'Shared', children: ['brief', 'report'] },
  brief: { name: 'launch-brief.md', typeLabel: 'MD', sizeLabel: '4.2 KB', modifiedLabel: 'Edited 10:40', modifiedAt: '2026-10-03T10:40:00Z', downloadUrl: briefDownloadUrl },
  report: { name: 'reader-survey.csv', typeLabel: 'CSV', sizeLabel: '18 KB', modifiedLabel: 'Edited 10:32', downloadUrl: reportDownloadUrl },
  uploads: { name: 'Your uploads', children: ['reference'] },
  reference: { name: 'author-portrait.jpg', typeLabel: 'JPG', sizeLabel: '128 KB', modifiedLabel: 'Uploaded yesterday', downloadUrl: '/avatars/person-24.svg' },
  researcher: { name: 'Researcher', agent: { name: 'Researcher', seed: 'reader-research', state: 'idle' }, children: ['sources'] },
  sources: { name: 'sources', children: ['notes', 'interviews'] },
  notes: { name: 'reader-interview-findings-and-opportunities.md', typeLabel: 'MD', sizeLabel: '8.6 KB', modifiedLabel: 'Created 10:38', meta: '6 sources', downloadUrl: briefDownloadUrl },
  interviews: { name: 'interviews.json', typeLabel: 'JSON', sizeLabel: '32 KB', modifiedLabel: 'Created 10:35', canPreview: false },
  writer: { name: 'Writer', agent: { name: 'Writer', seed: 'newsletter-writer' }, children: ['draft'] },
  draft: { name: 'newsletter-draft.mdx', typeLabel: 'MDX', sizeLabel: '6.1 KB', modifiedLabel: 'Updated just now', downloadUrl: briefDownloadUrl }
};
