import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatDelegation": {
    ...definition('Work handed to another agent: who took it, the brief, its status and its activity.', [p('status', 'pending | running | done | failed', 'running', 'Delegation status.'), p('instructions', 'string', '—', 'The brief.'), p('agent', '{ name }', '—', 'The agent that took the work.'), p('error', 'string', '—', 'Shown as an alert.'), className], 'The status is named in text, not colour alone.'),
    usage: "import { ChatMessageDelegation, ChatMessageTool } from '@gaudi/design-system/chat';\n\n<ChatMessageDelegation agent={{ name: 'Research agent' }} status='running' instructions={brief}>\n  <ChatMessageTool name='web_search' status='done' />\n</ChatMessageDelegation>"
  }
};
