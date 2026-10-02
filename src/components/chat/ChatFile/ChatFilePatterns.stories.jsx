import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat-file',
  import.meta.glob('../../../../.storybook/fixtures/patterns/chat-file/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/chat-file/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatFile', id: 'chat-chatfile', tags: ['autodocs'], ...catalogueMeta('chat-file') };

export const ChatFilePattern1 = { name: 'Delivered files and data', ...pattern(1, 'Structured values read as a list with a JSON view, and delivered files offer preview and download.') };
