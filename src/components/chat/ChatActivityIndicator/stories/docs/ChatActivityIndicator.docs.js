import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatActivityIndicator": {
    ...definition('What the assistant is doing: idle, thinking, streaming, tool, done or error.', [p('state', 'idle | thinking | streaming | tool | done | error', 'idle', 'Current activity.'), p('variant', 'inline | badge | compact', 'inline', 'Inline mark, corner badge, or neutral thinking chip with a ray spinner and shimmering label.'), p('showLabel', 'boolean', 'compact: true; otherwise false', 'Visible label beside the mark. Compact label changes enter gently; reduced motion switches instantly.'), p('labels / decorative', 'object / boolean', '—', 'Copy per state, and hiding.'), className], 'A polite status; motion slows to a fade for reduced motion.'),
    usage: "import { ChatActivityIndicator } from '@gaudi/design-system/chat';\n\n<>\n<ChatActivityIndicator state='thinking' showLabel />\n<ChatActivityIndicator state='done' variant='badge' />\n<ChatActivityIndicator state='thinking' variant='compact' />\n</>"
  }
};
