import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatActivityHistory": {
    ...definition('What happened in a conversation, newest last.', [p('title', 'string', 'Activity', 'Region name.'), p('details', 'boolean', 'true', 'Example only: shows item details.'), p('items', 'Array<{ id, title, time, detail?, status?, icon? }>', '[]', 'History rows.'), className], 'A labelled region with a heading.'),
    usage: "import { ChatActivity } from '@gaudi/design-system/chat';\n\n<ChatActivity items={[{ id: '1', time: '09:12', title: 'Searched the archive', icon: 'Search' }]} />"
  }
};
