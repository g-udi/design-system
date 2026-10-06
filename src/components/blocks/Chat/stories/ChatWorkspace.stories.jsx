import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { ChatWorkspaceDemo } from './fixtures/ChatWorkspaceDemo.jsx';

export default {
  title: 'Blocks/Chat',
  id: 'blocks-chat',
  tags: ['autodocs'],
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const WorkspaceContext = {
  name: 'Workspace context: agents, files and preview',
  parameters: {
    docs: {
      description: { story: 'A conversation with a workspace beside it: switch between Files and Agents, open one agent’s outputs, preview a file, then return to all files. ChatShell moves the workspace into its details Sheet below xl. The host controls view, agent scope and file selection so the inline panel and mobile Sheet stay synchronized; the host also renders previews and supplies download URLs. Keyboard users can move between tabs, navigate the file tree, open Preview and return to its trigger.' },
      source: {
        language: 'jsx',
        code: `import { useState } from 'react';
import { ChatShell } from '@gaudi/design-system/blocks/Chat';
import { ChatSessionList, ChatWorkspace, ChatPromptComposer } from '@gaudi/design-system/chat';

function ConversationWorkspace({ agents, files, sessions, messages, openPreview, send }) {
  const [view, setView] = useState('files');
  const [agentId, setAgentId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [activeId, setActiveId] = useState(sessions[0]?.id);

  return (
    <ChatShell
      title='A smaller first draft'
      navigation={<ChatSessionList sessions={sessions} activeId={activeId} onSelect={setActiveId} />}
      details={
        <ChatWorkspace agents={agents}
          view={view} onViewChange={setView}
          agentId={agentId} onAgentChange={setAgentId}
          fileExplorerProps={{ items: files, selectedId, onSelect: setSelectedId, onPreview: openPreview }}
        />
      }
      labels={{ details: 'Workspace', openDetails: 'Open workspace' }}
      composer={<ChatPromptComposer onSubmit={send} />}
    >
      {messages}
    </ChatShell>
  );
}`
      }
    }
  },
  render: () => <ChatWorkspaceDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const openWorkspace = canvas.queryByRole('button', { name: 'Open workspace' });
    let panel;
    if (openWorkspace) {
      await userEvent.click(openWorkspace);
      panel = within(await body.findByRole('dialog', { name: 'Workspace', exact: true }));
    } else panel = within(canvas.getByRole('complementary', { name: 'Workspace', exact: true }));

    await userEvent.click(panel.getByRole('tab', { name: 'Agents', exact: true }));
    await userEvent.click(panel.getByRole('button', { name: 'View files: Researcher' }));
    await expect(panel.getByRole('tab', { name: 'Files', exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(panel.getByRole('button', { name: 'All files', exact: true })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Download: research-findings.md' })).toHaveAttribute('download', 'research-findings.md');
    const preview = await panel.findByRole('button', { name: 'Preview: research-findings.md' });
    await userEvent.click(preview);
    const dialog = within(await body.findByRole('dialog', { name: 'research-findings.md', exact: true }));
    await expect(dialog.getByText(/Keep source material beside the draft/)).toBeVisible();
    await userEvent.click(dialog.getByRole('button', { name: 'Back to workspace' }));
    await waitFor(() => expect(preview).toHaveFocus());
    await userEvent.click(panel.getByRole('button', { name: 'All files', exact: true }));
    await expect(await panel.findByRole('treeitem', { name: 'Shared', exact: true })).toBeVisible();
    if (openWorkspace) {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(openWorkspace).toHaveFocus());
    }
    await userEvent.type(canvas.getByRole('combobox', { name: 'Message' }), 'Make the opening more concise.{Enter}');
    await waitFor(() => expect(canvas.getByText('Make the opening more concise.')).toBeVisible());
  }
};
