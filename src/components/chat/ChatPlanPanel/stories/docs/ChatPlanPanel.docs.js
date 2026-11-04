import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatPlanPanel": {
    ...definition('The assistant’s plan for the current request, with progress.', [p('title', 'string', 'Plan', 'Header.'), p('defaultOpen', 'boolean', 'true', 'Initial disclosure.'), p('steps', 'Array<{ id, title, status, description?, owner?, todos?, notes? }>', '[]', 'Plan steps with the shared statuses; notes are prepared { id, text, label? } entries.'), p('labels', 'object', '—', 'Progress and status copy, owner and current-step labels, and notes list name.'), className], 'The header reads the count of finished steps. Steps and notes form named lists; the first running step, or first awaiting step when none is running, exposes aria-current="step".'),
    usage: "import { ChatPlan } from '@gaudi/design-system/chat';\n\n<ChatPlan title='Plan' steps={[\n  { id: 'read', title: 'Read the draft', status: 'done' },\n  { id: 'draft', title: 'Draft the opening', status: 'running' }\n]} />"
  }
};
