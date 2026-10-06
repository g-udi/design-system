import { useState } from 'react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import Button from '../../../core/Button';
import { ChatFileExplorer } from '../index.js';
import { workspaceFiles } from './fixtures/files.js';

function Files({ label, expanded, onPreview, onRefresh }) {
  const [opened, setOpened] = useState('');
  return (
    <div className='grid w-full max-w-md gap-3 rounded-(--ds-radius-card) border p-3'>
      <ChatFileExplorer key={`${expanded}`} items={workspaceFiles} label={label} defaultExpanded={expanded ? ['shared', 'uploads', 'researcher', 'sources', 'writer'] : []} onSelect={(_id, file) => setOpened(file.name)} onPreview={onPreview} onRefresh={onRefresh} />
      <p role='status' aria-label='Selection' className='min-w-0 break-words text-xs text-text-muted'>{opened ? `Selected ${opened}` : 'Select a file to inspect it.'}</p>
    </div>
  );
}

export default {
  title: 'Chat/ChatFileExplorer',
  id: 'chat-chatfileexplorer',
  tags: ['autodocs'],
  ...chatMeta('ChatFileExplorer', { component: ChatFileExplorer, controls: { label: 'text', expanded: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { label: 'Files', expanded: true, onPreview: fn(), onRefresh: fn() },
  parameters: {
    docs: {
      description: { story: 'Shared files, uploads, and two agents’ outputs use one Core Tree. Search preserves folder context. Select a file with click or Enter, use Preview for a host-owned preview, or follow the real download link. Prepared metadata keeps time and size formatting in the host.' },
      source: { language: 'jsx', code: "import { useState } from 'react';\nimport { ChatFileExplorer } from '@gaudi/design-system/chat/ChatFileExplorer';\nconst files = {\n  root: { name: 'Files', children: ['shared'] },\n  shared: { name: 'Shared', children: ['brief'] },\n  brief: { name: 'launch-brief.md', typeLabel: 'MD', sizeLabel: '4.2 KB', modifiedLabel: 'Edited 10:40', downloadUrl: '/files/launch-brief.md' }\n};\nexport function FilesExample() {\n  const [selectedId, setSelectedId] = useState(null);\n  const [notice, setNotice] = useState('');\n  return <div className='grid gap-3'><ChatFileExplorer items={files} defaultExpanded={['shared']} selectedId={selectedId} onSelect={setSelectedId} onPreview={(_id, file) => setNotice('Preview requested: ' + file.name)} onRefresh={() => setNotice('The local file map is up to date.')} /><p role='status'>{notice}</p></div>;\n}" }
    }
  },
  render: (args) => <Files {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tree', { name: args.label })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Refresh files' }));
    await expect(args.onRefresh).toHaveBeenCalledOnce();
    const search = canvas.getByRole('searchbox', { name: 'Search files' });
    await userEvent.type(search, 'interview-findings');
    const file = await canvas.findByRole('treeitem', { name: workspaceFiles.notes.name });
    await expect(canvas.getByRole('treeitem', { name: 'Researcher' })).toBeVisible();
    await expect(canvas.getByRole('treeitem', { name: 'sources' })).toBeVisible();
    await expect(canvas.queryByRole('treeitem', { name: 'Shared' })).toBeNull();
    canvas.getByRole('treeitem', { name: 'Researcher' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('treeitem', { name: 'sources' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(file).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await expect(file).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('status', { name: 'Selection' })).toHaveTextContent(workspaceFiles.notes.name);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: `Preview: ${workspaceFiles.notes.name}` })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onPreview).toHaveBeenLastCalledWith('notes', workspaceFiles.notes);
    const download = canvas.getByRole('link', { name: `Download: ${workspaceFiles.notes.name}` });
    await expect(download).toHaveAttribute('href', workspaceFiles.notes.downloadUrl);
    await expect(download).toHaveAttribute('download', workspaceFiles.notes.name);
    await userEvent.tab();
    await expect(download).toHaveFocus();
    await userEvent.clear(search);
    await userEvent.type(search, 'missing-file');
    await expect(canvas.getByText('No matching files')).toBeVisible();
    await userEvent.click(canvas.getAllByRole('button', { name: 'Clear search', exact: true }).at(-1));
    await waitFor(() => expect(search).toHaveValue(''));
    if (args.expanded) await expect(canvas.getByRole('treeitem', { name: 'launch-brief.md' })).toBeVisible();
  }
};

export const ControlledSelection = {
  args: { onSelect: fn(), onPreview: fn() },
  parameters: { docs: { description: { story: 'The host controls the selected file independently of folder focus and preview actions. Clear selection changes only the controlled selection; ordinary folder expansion stays local.' }, source: { language: 'jsx', code: "import { useState } from 'react';\nimport { ChatFileExplorer } from '@gaudi/design-system/chat/ChatFileExplorer';\nconst files = {\n  root: { name: 'Files', children: ['shared'] },\n  shared: { name: 'Shared', children: ['brief'] },\n  brief: { name: 'launch-brief.md', typeLabel: 'MD', sizeLabel: '4.2 KB', modifiedLabel: 'Edited 10:40', downloadUrl: '/files/launch-brief.md' }\n};\nexport function ControlledFiles() {\n  const [selectedId, setSelectedId] = useState('brief');\n  return <ChatFileExplorer items={files} selectedId={selectedId} onSelect={setSelectedId} defaultExpanded={['shared']} />;\n}" } } },
  render: function Render(args) {
    const [selectedId, setSelectedId] = useState('brief');
    return <div className='w-full max-w-md rounded-(--ds-radius-card) border p-3'><ChatFileExplorer items={workspaceFiles} defaultExpanded={['shared']} selectedId={selectedId} onSelect={(id, file) => { setSelectedId(id); args.onSelect(id, file); }} onPreview={args.onPreview} actions={<Button size='xs' variant='ghost' onClick={() => setSelectedId(null)}>Clear selection</Button>} /></div>;
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const selected = await canvas.findByRole('treeitem', { name: 'launch-brief.md' });
    await expect(selected).toHaveAttribute('aria-selected', 'true');
    // Clicking an action in another row must update the tree's roving focus too.
    selected.focus();
    const preview = canvas.getByRole('button', { name: 'Preview: reader-survey.csv' });
    const download = canvas.getByRole('link', { name: 'Download: reader-survey.csv' });
    await userEvent.click(preview);
    await expect(args.onPreview).toHaveBeenLastCalledWith('report', workspaceFiles.report);
    await expect(preview).toHaveAttribute('tabindex', '0');
    await expect(download).toHaveAttribute('tabindex', '0');
    await userEvent.tab();
    await expect(download).toHaveFocus();
    await expect(args.onSelect).toHaveBeenLastCalledWith('report', workspaceFiles.report);
    await expect(selected).toHaveAttribute('aria-selected', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear selection' }));
    await expect(canvas.getByRole('treeitem', { name: 'reader-survey.csv' })).toHaveAttribute('aria-selected', 'false');
  }
};

const originalFiles = {
  root: { name: 'Files', children: ['first', 'second'] },
  first: { name: 'first.md' },
  second: { name: 'second.md' }
};

export const DataReplacement = {
  name: 'Live file updates',
  parameters: { docs: { description: { story: 'The host replaces the file map as workspace updates arrive. If the focused file disappears, focus moves to a remaining file, or the refresh control when the workspace becomes empty. Search and controls outside the tree keep their own focus.' }, source: { language: 'jsx', code: "import { useState } from 'react';\nimport { ChatFileExplorer } from '@gaudi/design-system/chat/ChatFileExplorer';\nimport Button from '@gaudi/design-system/core/Button';\nconst initialFiles = { root: { name: 'Files', children: ['first', 'second'] }, first: { name: 'first.md' }, second: { name: 'second.md' } };\nexport function LiveFiles() {\n  const [files, setFiles] = useState(initialFiles);\n  return <div className='grid gap-3'><Button onClick={() => setFiles({ root: { name: 'Files', children: ['second'] }, second: initialFiles.second })}>Remove first file</Button><ChatFileExplorer items={files} onRefresh={() => setFiles(initialFiles)} /></div>;\n}" } } },
  render: function Render() {
    const [items, setItems] = useState(originalFiles);
    return <div className='grid w-full max-w-md gap-3'>
      <div className='flex flex-wrap gap-2' aria-label='Simulate workspace updates'>
        <Button size='sm' variant='outline' onClick={() => setItems({ root: { name: 'Files', children: ['second'] }, second: originalFiles.second })}>Remove first file</Button>
        <Button size='sm' variant='outline' onClick={() => setItems({ root: { name: 'Files', children: ['third'] }, third: { name: 'third.md' } })}>Replace files</Button>
        <Button size='sm' variant='outline' onClick={() => setItems({ root: { name: 'Files', children: [] } })}>Clear files</Button>
      </div>
      <div className='rounded-(--ds-radius-card) border p-3'><ChatFileExplorer items={items} onRefresh={() => setItems(originalFiles)} /></div>
    </div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const remove = canvas.getByRole('button', { name: 'Remove first file' });
    const refresh = canvas.getByRole('button', { name: 'Refresh files' });
    (await canvas.findByRole('treeitem', { name: 'first.md' })).focus();
    // Dispatch host updates without moving focus, as an arriving subscription would.
    fireEvent.click(remove);
    await waitFor(() => expect(canvas.getByRole('treeitem', { name: 'second.md' })).toHaveFocus());
    fireEvent.click(canvas.getByRole('button', { name: 'Replace files' }));
    await waitFor(() => expect(canvas.getByRole('treeitem', { name: 'third.md' })).toHaveFocus());
    fireEvent.click(canvas.getByRole('button', { name: 'Clear files' }));
    await waitFor(() => expect(canvas.getByText('No files yet')).toBeVisible());
    await expect(refresh).toHaveFocus();

    await userEvent.click(refresh);
    (await canvas.findByRole('treeitem', { name: 'first.md' })).focus();
    const search = canvas.getByRole('searchbox', { name: 'Search files' });
    search.focus();
    fireEvent.click(remove);
    await waitFor(() => expect(canvas.queryByRole('treeitem', { name: 'first.md' })).toBeNull());
    await expect(search).toHaveFocus();

    await userEvent.click(refresh);
    (await canvas.findByRole('treeitem', { name: 'first.md' })).focus();
    remove.focus();
    fireEvent.click(remove);
    await waitFor(() => expect(canvas.queryByRole('treeitem', { name: 'first.md' })).toBeNull());
    await expect(remove).toHaveFocus();
  }
};

export const Loading = {
  parameters: { docs: { description: { story: 'Initial loading uses shared Skeleton rows and a live loading announcement. Passing existing items keeps those files visible during refresh.' }, source: { language: 'jsx', code: "import { ChatFileExplorer } from '@gaudi/design-system/chat/ChatFileExplorer';\n\n<ChatFileExplorer loading />" } } },
  render: () => <div className='w-full max-w-md rounded-(--ds-radius-card) border p-3'><ChatFileExplorer loading /></div>
};

export const ErrorAndRetry = {
  args: { onRetry: fn() },
  parameters: { docs: { description: { story: 'A failed request uses the shared Alert and an optional retry action. The host fetches and updates the file map.' }, source: { language: 'jsx', code: "import { useState } from 'react';\nimport { ChatFileExplorer } from '@gaudi/design-system/chat/ChatFileExplorer';\n\nexport function RetryFiles() {\n  const [error, setError] = useState('The workspace is temporarily unavailable.');\n  return <ChatFileExplorer error={error} items={{ root: { name: 'Files', children: [] } }} onRetry={() => setError(null)} />;\n}" } } },
  render: (args) => <div className='w-full max-w-md rounded-(--ds-radius-card) border p-3'><ChatFileExplorer error='The workspace is temporarily unavailable.' {...args} /></div>,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('The workspace is temporarily unavailable.');
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  }
};

export const Empty = {
  parameters: { docs: { description: { story: 'An empty workspace has a compact EmptyState rather than an empty tree.' }, source: { language: 'jsx', code: "import { ChatFileExplorer } from '@gaudi/design-system/chat/ChatFileExplorer';\n\n<ChatFileExplorer items={{ root: { name: 'Files', children: [] } }} />" } } },
  render: () => <div className='w-full max-w-md rounded-(--ds-radius-card) border p-3'><ChatFileExplorer /></div>
};

export const EmptyFolders = {
  name: 'Empty folders',
  args: { onSelect: fn() },
  parameters: { docs: { description: { story: 'An existing folder remains visible and expandable before it contains files. Searching its name keeps the folder as a result while the file count stays zero.' }, source: { code: `import { ChatFileExplorer } from '@gaudi/design-system/chat';

<ChatFileExplorer items={{
  root: { name: 'Files', children: ['drafts'] },
  drafts: { name: 'Drafts', children: [] }
}} />` } } },
  render: (args) => <div className='w-full max-w-md rounded-(--ds-radius-card) border p-3'><ChatFileExplorer items={{ root: { name: 'Files', children: ['drafts'] }, drafts: { name: 'Drafts', children: [] } }} {...args} /></div>,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const folder = await canvas.findByRole('treeitem', { name: 'Drafts' });
    await expect(within(canvasElement.querySelector('header')).getByLabelText('0 files')).toBeVisible();
    await expect(canvas.queryByText('No files yet')).toBeNull();
    await userEvent.click(folder);
    await expect(folder).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(folder).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onSelect).not.toHaveBeenCalled();
    const search = canvas.getByRole('searchbox', { name: 'Search files' });
    await userEvent.type(search, 'drafts');
    await expect(await canvas.findByRole('treeitem', { name: 'Drafts' })).toBeVisible();
    await expect(canvas.queryByText('No matching files')).toBeNull();
    await userEvent.clear(search);
    await userEvent.type(search, 'missing');
    await expect(canvas.getByText('No matching files')).toBeVisible();
    await userEvent.click(canvas.getAllByRole('button', { name: 'Clear search' }).at(-1));
    await expect(await canvas.findByRole('treeitem', { name: 'Drafts' })).toHaveAttribute('aria-expanded', 'false');
  }
};
