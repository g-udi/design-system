import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { ChatSessionsDemo } from './fixtures/ChatSessionsDemo.jsx';
import { exerciseSessions, sessionParameters } from './fixtures/chat-session-story.js';

export default {
  title: 'Blocks/Chat',
  id: 'blocks-chat',
  tags: ['autodocs'],
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const SessionPanel = {
  name: 'Session panel: header, history and conversation',
  args: { variant: 'sidebar', searchable: true },
  parameters: sessionParameters,
  render: (args) => <ChatSessionsDemo {...args} />,
  play: exerciseSessions
};

export const SessionPage = {
  ...SessionPanel,
  name: 'Session page: history beside the conversation',
  args: { variant: 'page', searchable: true },
  parameters: {
    docs: {
      ...sessionParameters.docs,
      source: sessionParameters.docs.source
    }
  }
};
