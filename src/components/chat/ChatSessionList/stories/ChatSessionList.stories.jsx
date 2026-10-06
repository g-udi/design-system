import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatSessionList } from '../index.js';
import { ChatSessionsDemo } from '../../../blocks/Chat/stories/fixtures/ChatSessionsDemo.jsx';
import { exerciseSessions, sessionParameters } from '../../../blocks/Chat/stories/fixtures/chat-session-story.js';

export default {
  title: 'Chat/ChatSessionList',
  id: 'chat-chatsessionlist',
  tags: ['autodocs'],
  ...chatMeta('ChatSessionList', { component: ChatSessionList, controls: { searchable: 'boolean', variant: ['sidebar', 'page'] }, primary: () => Playground, wide: true })
};

export const Playground = {
  name: 'Session history in a full chat panel',
  args: { searchable: true, variant: 'sidebar' },
  parameters: sessionParameters,
  render: (args) => <ChatSessionsDemo {...args} />,
  play: exerciseSessions
};
