import { useState } from 'react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../../core/Button/index.js';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { workspaceFiles } from '../../ChatFileExplorer/stories/fixtures/files.js';
import { ChatWorkspace } from '../index.js';

const agents = [
  { id: 'reader-research', name: 'Researcher', description: 'Checking interviews and supporting sources.', state: 'tool', fileRootId: 'researcher' },
  { id: 'newsletter-writer', name: 'Writer', description: 'Drafting the launch newsletter.', state: 'streaming', fileRootId: 'writer' },
  { id: 'editor', name: 'Editor', description: 'Ready to review the draft.', state: 'idle' }
];

const usage = "import { useState } from 'react';\nimport { ChatWorkspace } from '@gaudi/design-system/chat/ChatWorkspace';\nconst agents = [{ id: 'researcher', name: 'Researcher', description: 'Checking supporting sources.', state: 'tool', fileRootId: 'research' }, { id: 'editor', name: 'Editor', state: 'idle' }];\nconst items = { root: { name: 'Files', children: ['shared', 'research'] }, shared: { name: 'Shared', children: ['brief'] }, brief: { name: 'brief.md' }, research: { name: 'Research', children: ['notes'] }, notes: { name: 'notes.md' } };\nexport function WorkspaceExample() {\n  const [selectedId, setSelectedId] = useState(null);\n  const [view, setView] = useState('agents');\n  const [agentId, setAgentId] = useState(null);\n  return <ChatWorkspace agents={agents} fileExplorerProps={{ items, defaultExpanded: ['shared'], selectedId, onSelect: setSelectedId }} view={view} onViewChange={setView} agentId={agentId} onAgentChange={setAgentId} />;\n}";

export default {
  title: 'Chat/ChatWorkspace',
  id: 'chat-chatworkspace',
  tags: ['autodocs'],
  ...chatMeta('ChatWorkspace', { component: ChatWorkspace, controls: { title: 'text', description: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Workspace', description: 'Launch newsletter · 3 agents' },
  parameters: { docs: { description: { story: 'Navigate from the agent roster into one agent’s files, then return to the shared hierarchy. This panel fits ChatShell details or any application sidebar. The host owns previews and file IO; the full ChatShell example lives on Blocks/Chat.' }, source: { language: 'jsx', code: usage } } },
  render: function WorkspaceExample(args) {
    const [selectedId, setSelectedId] = useState(null);
    return <div className='w-full max-w-sm rounded-(--ds-radius-card) border p-3'><ChatWorkspace {...args} agents={agents} fileExplorerProps={{ items: workspaceFiles, defaultExpanded: ['shared', 'sources'], selectedId, onSelect: setSelectedId }} /></div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Agents' }));
    await expect(canvas.getByText('Checking interviews and supporting sources.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'View files: Researcher' }));
    await expect(canvas.getByRole('tab', { name: 'Files' })).toHaveFocus();
    await waitFor(() => expect(canvas.getByRole('tree', { name: 'Researcher' })).toBeVisible());
    await expect(canvas.queryByText('Shared')).not.toBeInTheDocument();
    await expect(canvas.getByText('reader-interview-findings-and-opportunities.md')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'All files' }));
    await waitFor(() => expect(canvas.getByText('Shared')).toBeVisible());
    await expect(canvas.getByRole('tab', { name: 'Files' })).toHaveFocus();
  }
};

export const AgentRoster = {
  name: 'Agent roster and activity',
  parameters: { docs: { description: { story: 'Agent identity uses ChatAgentMark and current activity uses ChatActivityIndicator. Agents without a file folder have an explicit empty state. Names and task descriptions wrap in narrow panels.' }, source: { language: 'jsx', code: "import { ChatWorkspace } from '@gaudi/design-system/chat/ChatWorkspace';\nconst agents = [{ id: 'researcher', name: 'Researcher', description: 'Checking supporting sources.', state: 'tool', fileRootId: 'research' }, { id: 'editor', name: 'Editor', state: 'idle' }];\nconst items = { root: { name: 'Files', children: ['shared', 'research'] }, shared: { name: 'Shared', children: ['brief'] }, brief: { name: 'brief.md' }, research: { name: 'Research', children: ['notes'] }, notes: { name: 'notes.md' } };\n<ChatWorkspace defaultView='agents' agents={agents} fileExplorerProps={{ items }} />" } } },
  render: () => <div className='w-full max-w-sm rounded-(--ds-radius-card) border p-3'><ChatWorkspace defaultView='agents' agents={agents} fileExplorerProps={{ items: workspaceFiles }} /></div>
};

export const Empty = {
  parameters: { docs: { description: { story: 'Empty agents and files are handled by the existing EmptyState. File loading, errors and refresh remain ChatFileExplorer props.' }, source: { language: 'jsx', code: "import { ChatWorkspace } from '@gaudi/design-system/chat';\n\n<ChatWorkspace agents={[]} fileExplorerProps={{ items: {} }} />" } } },
  render: () => <div className='w-full max-w-sm rounded-(--ds-radius-card) border p-3'><ChatWorkspace /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No files yet')).toBeVisible();
    await userEvent.click(canvas.getByRole('tab', { name: 'Agents' }));
    await expect(canvas.getByText('No agents yet')).toBeVisible();
  }
};

export const ControlledNavigation = {
  name: 'Controlled workspace navigation',
  args: { onViewChange: fn(), onAgentChange: fn() },
  parameters: { docs: { description: { story: 'A controlled host receives one request per navigation action. Share this state between the desktop panel and mobile Sheet.' }, source: { language: 'jsx', code: usage } } },
  render: function ControlledExample(args) {
    const [view, setView] = useState('agents');
    const [agentId, setAgentId] = useState(null);
    const [roster, setRoster] = useState(agents);
    return <div className='grid w-full max-w-sm gap-3 rounded-(--ds-radius-card) border p-3'><ChatWorkspace agents={roster} fileExplorerProps={{ items: workspaceFiles, defaultExpanded: ['sources'] }} view={view} onViewChange={(next) => { args.onViewChange(next); setView(next); }} agentId={agentId} onAgentChange={(next) => { args.onAgentChange(next); setAgentId(next); }} /><Button variant='outline' size='sm' onClick={() => setRoster((current) => current.filter((agent) => agent.id !== 'reader-research'))}>Remove Researcher from roster</Button></div>;
  },
  play: async ({ args, canvasElement }) => {
    args.onViewChange.mockClear();
    args.onAgentChange.mockClear();
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'View files: Researcher' }));
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Files' })).toHaveFocus());
    await expect(args.onViewChange).toHaveBeenCalledTimes(1);
    await expect(args.onViewChange).toHaveBeenCalledWith('files');
    await expect(args.onAgentChange).toHaveBeenCalledWith('reader-research');
    await userEvent.click(canvas.getByRole('button', { name: 'All files' }));
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Files' })).toHaveFocus());
    await expect(args.onViewChange).toHaveBeenCalledTimes(1);
    await expect(args.onAgentChange).toHaveBeenCalledTimes(2);
    await expect(args.onAgentChange).toHaveBeenLastCalledWith(null);
    await userEvent.click(canvas.getByRole('tab', { name: 'Agents' }));
    await userEvent.click(canvas.getByRole('button', { name: 'View files: Researcher' }));
    canvas.getAllByRole('treeitem')[0].focus();
    const viewRequests = args.onViewChange.mock.calls.length;
    const scopeRequests = args.onAgentChange.mock.calls.length;
    // Model a host roster update arriving while keyboard focus is in that agent's files.
    fireEvent.click(canvas.getByRole('button', { name: 'Remove Researcher from roster' }));
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Files' })).toHaveFocus());
    await expect(canvas.getByRole('treeitem', { name: 'Shared' })).toBeVisible();
    await expect(args.onViewChange).toHaveBeenCalledTimes(viewRequests);
    await expect(args.onAgentChange).toHaveBeenCalledTimes(scopeRequests);
  }
};
