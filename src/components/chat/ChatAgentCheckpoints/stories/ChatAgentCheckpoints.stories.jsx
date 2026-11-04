import { expect, userEvent, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { ChatAgentCheckpoints } from '../index.js';
import { Pattern } from './fixtures/agent-checkpoints/message-scroller-agent-checkpoints.jsx';
import source from './fixtures/agent-checkpoints/message-scroller-agent-checkpoints.jsx?raw';

export default { title: 'Chat/ChatAgentCheckpoints', id: 'chat-chatagentcheckpoints', tags: ['autodocs'], ...chatMeta('ChatAgentCheckpoints', { component: ChatAgentCheckpoints, controls: { title: 'text' }, primary: () => Playground, wide: true }) };

export const Playground = {
  name: 'Playground',
  args: { title: 'Agent checkpoints' },
  render: args => <Pattern {...args} />,
  parameters: { __id: 'chat-messagelist--agent-checkpoints', docs: { description: { story: "Inspect saved attempts and checkpoints, and request a switch or restore without changing workspace state." }, source: { code: publicSource(source, new URL('./fixtures/agent-checkpoints/message-scroller-agent-checkpoints.jsx', import.meta.url)), language: 'jsx' } } },
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Rewind to Mapped the checkout flow' }));
    await expect(canvas.getByRole('region', { name: 'Attempt 3' })).toBeInTheDocument();
    await expect(canvas.getByText('Stopped', { exact: true })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Finish step' }));
    await expect(canvas.getByText('All 12 checks passed. Workspace snapshot saved.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Switch to attempt 1' }));
    await expect(canvas.getByRole('region', { name: 'Attempt 3' })).toBeInTheDocument();
  }
};
