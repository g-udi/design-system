import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat-file', import.meta.url,
  import.meta.glob('./fixtures/chat-file/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/chat-file/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatMessage', id: 'chat-message', tags: ['autodocs'], ...catalogueMeta('chat-file') };

export const ChatFileDeliveredFiles = { name: 'Delivered files and data', ...pattern('delivered-files', 'Structured values read as a list with a JSON view, and delivered files offer preview and download.') };
