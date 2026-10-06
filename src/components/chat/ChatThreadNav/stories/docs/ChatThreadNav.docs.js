import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatThreadNav": {
    ...definition('Previous, next and a menu of every prompt in a long thread.', [p('start', 'string', 't2', 'Example only: the turn in view at first.'), p('turns', 'Array<{ id, label }>', '[]', 'Prompts in thread order.'), p('current / onNavigate', 'string / (id) => void', '—', 'The turn in view and navigation.'), className], 'A labelled group; the menu button reads its position.'),
    usage: "import { ChatThreadNav } from '@gaudi/design-system/chat';\n\n<ChatThreadNav turns={prompts} current={currentId} onNavigate={scrollToTurn} />"
  }
};
