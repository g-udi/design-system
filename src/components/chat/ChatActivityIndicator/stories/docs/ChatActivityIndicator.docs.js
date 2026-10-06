import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatActivityIndicator": {
    ...definition('What the assistant is doing: idle, thinking, streaming, tool, done or error.', [p('state', 'idle | thinking | streaming | tool | done | error', 'idle', 'Current activity.'), p('variant', 'inline | badge', 'inline', 'Inline mark or corner badge.'), p('showLabel', 'boolean', 'false', 'Visible label beside the mark.'), p('labels / decorative', 'object / boolean', '—', 'Copy per state, and hiding.'), className], 'A polite status; motion slows to a fade for reduced motion.'),
    usage: "import { ChatActivityIndicator } from '@gaudi/design-system/chat';\n\n<>\n<ChatActivityIndicator state='thinking' showLabel />\n<ChatActivityIndicator state='done' variant='badge' />\n</>"
  }
};
