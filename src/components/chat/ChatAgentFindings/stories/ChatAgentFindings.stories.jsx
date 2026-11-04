import { expect, userEvent, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { ChatAgentFindings } from '../index.js';
import { Pattern } from './fixtures/agent-findings/chat-delegation-agent-findings.jsx';
import source from './fixtures/agent-findings/chat-delegation-agent-findings.jsx?raw';

export default { title: 'Chat/ChatAgentFindings', id: 'chat-chatagentfindings', tags: ['autodocs'], ...chatMeta('ChatAgentFindings', { component: ChatAgentFindings, controls: { title: 'text' }, primary: () => Playground, wide: true }) };

export const Playground = {
  name: 'Playground',
  args: { title: 'Agent findings' },
  render: args => <Pattern {...args} />,
  parameters: { __id: 'chat-chatdelegation--agent-findings', docs: { description: { story: "Filter prepared findings by agent and severity, inspect evidence and request review changes." }, source: { code: publicSource(source, new URL('./fixtures/agent-findings/chat-delegation-agent-findings.jsx', import.meta.url)), language: 'jsx' } } },
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Filter by Security' }));
    await expect(canvas.getByRole('button', { name: 'Inspect Invites can grant owner access' })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Inspect Retry creates duplicate invitations' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Inspect Invites can grant owner access' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Mark reviewed', exact: true }));
    await expect(canvas.getByText('Reviewed', { exact: true })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Next update' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next update' }));
    await expect(canvas.getByRole('button', { name: 'Review complete' })).toBeDisabled();
  }
};
