import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { ChatContextWindow } from '../index.js';
import { Pattern } from './fixtures/context-window/prompt-composer-context-window.jsx';
import source from './fixtures/context-window/prompt-composer-context-window.jsx?raw';

export default { title: 'Chat/ChatContextWindow', id: 'chat-chatcontextwindow', tags: ['autodocs'], ...chatMeta('ChatContextWindow', { component: ChatContextWindow, controls: { title: 'text' }, primary: () => Playground, wide: true }) };

export const Playground = {
  name: 'Playground',
  args: { title: 'Context window' },
  render: args => <Pattern {...args} />,
  parameters: { __id: 'chat-chatinput--context-window', docs: { description: { story: "Inspect prepared context capacity, highlight categories and request file removal alongside host-owned compaction controls." }, source: { code: publicSource(source, new URL('./fixtures/context-window/prompt-composer-context-window.jsx', import.meta.url)), language: 'jsx' } } },
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove src/invitations/create.ts' }));
    await expect(canvas.queryByRole('button', { name: 'Remove src/invitations/create.ts' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Compact conversation', exact: true }));
    await waitFor(() => expect(canvasElement.querySelector('p[role="status"]')).toHaveTextContent('Freed 7,600 tokens'), { timeout: 3000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Reset demo' }));
    await expect(canvas.getByRole('button', { name: 'Remove src/invitations/create.ts' })).toBeVisible();
  }
};
