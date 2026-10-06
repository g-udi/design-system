import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatPlanPanel": {
    ...definition('The assistant’s plan for the current request, with progress.', [p('title', 'string', 'Plan', 'Header.'), p('defaultOpen', 'boolean', 'true', 'Initial disclosure.'), p('steps', 'Array<{ id, title, status, description?, owner?, todos? }>', '[]', 'Plan steps with the shared statuses.'), className], 'The header reads the count of finished steps.'),
    usage: "import { ChatPlan } from '@gaudi/design-system/chat';\n\n<ChatPlan title='Plan' steps={[\n  { id: 'read', title: 'Read the draft', status: 'done' },\n  { id: 'draft', title: 'Draft the opening', status: 'running' }\n]} />"
  }
};
