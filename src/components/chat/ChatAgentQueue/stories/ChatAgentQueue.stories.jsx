import { expect, userEvent, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { ChatAgentQueue } from '../index.js';
import { Pattern } from './fixtures/agent-queue/chat-delegation-agent-queue.jsx';
import source from './fixtures/agent-queue/chat-delegation-agent-queue.jsx?raw';

export default { title: 'Chat/ChatAgentQueue', id: 'chat-chatagentqueue', tags: ['autodocs'], ...chatMeta('ChatAgentQueue', { component: ChatAgentQueue, controls: { title: 'text' }, primary: () => Playground, wide: true }) };

export const Playground = {
  name: 'Playground',
  args: { title: 'Agent queue' },
  render: args => <Pattern {...args} />,
  parameters: { __id: 'chat-chatdelegation--agent-queue', docs: { description: { story: "Inspect waiting work, worker assignments and recent results, and request host-defined job actions." }, source: { code: publicSource(source, new URL('./fixtures/agent-queue/chat-delegation-agent-queue.jsx', import.meta.url)), language: 'jsx' } } },
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Pause queue' }));
    await expect(canvas.getByRole('button', { name: 'Resume queue' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Add demo job' }));
    await expect(canvas.getByRole('button', { name: 'Inspect Review archive note 1' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Resume queue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next update' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Check source availability failed.');
  }
};
