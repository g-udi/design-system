import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatFeedback": {
    ...definition('Copy, rate and regenerate a finished reply.', [p('defaultRating', 'none | up | down', 'none', 'Initial rating.'), p('regenerate', 'boolean', 'true', 'Example only: shows Regenerate through onRegenerate.'), p('copyText', 'string', '—', 'What copy writes.'), p('rating / onRatingChange', '\'up\' | \'down\' | null / function', '—', 'Controlled rating.'), p('onCopy / onRegenerate', 'function', '—', 'Host callbacks.'), className], 'A labelled group; ratings are pressed buttons, each action confirmed in a status.'),
    usage: "import { ChatMessageFeedback } from '@gaudi/design-system/chat';\n\n<ChatMessageFeedback copyText={reply.text} rating={rating} onRatingChange={setRating} onRegenerate={regenerate} />"
  }
};
