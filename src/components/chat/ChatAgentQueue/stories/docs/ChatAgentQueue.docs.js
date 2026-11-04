import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  'Chat/ChatAgentQueue': {
    ...definition("Inspect waiting work, worker assignments and recent results, and request host-defined job actions.", [
      p("waiting / recent", "Job[]", "[]", "Prepared ordered jobs: { id, name, icon?, kind?, meta?, detail?, description?, error?, progress?, priority?, actions?: { id, label, disabled? }[] }. No sorting, truncation or action policy is inferred."),
      p("workers", "Worker[]", "[]", "Prepared { id, name, icon?, statusLabel?, tone?, description?, job?: Job }. The host assigns jobs to workers."),
      p("summary", "Array<{ id, label, value }>", "\u2014", "Prepared summary cells; zero and supplied formatting are preserved."),
      p("onJobAction", "(jobId, actionId) => void", "\u2014", "Requested job action. Only supplied actions render; no callback means no mutation controls."),
      p("onInspectJob", "(jobId) => void", "\u2014", "Called when opening a job, for example to pause a demo."),
      p("actionFocusRef", "React.RefObject", "\u2014", "Focus destination after a job action may remove its trigger. Defaults to the panel."),
      p("toolbar / notice / children / footer", "ReactNode", "\u2014", "Host controls, status, optional chart/content and footer. Charts remain optional composition; no chart dependency is imported."),
      p("workersDescription / resultsDescription", "ReactNode", "\u2014", "Prepared explanations below worker and result groups."),
      p("title / description", "ReactNode", "\u2014", "Panel heading and supporting text."),
      p("className", "string", "\u2014", "Additional root classes. Panels fill available width; the consuming layout chooses any maximum width.")
    ], 'Native buttons, semantic headings and Gaudi disclosures preserve keyboard and focus behavior. Host callbacks own persistence and services.'),
    usage: "import { ChatAgentQueue } from '@gaudi/design-system/chat/ChatAgentQueue';\n\n<ChatAgentQueue\n  waiting={[{ id: 'review', name: 'Review the draft', kind: 'Review task', meta: 'Waiting' }]}\n  workers={[{ id: 'editor', name: 'Editor', statusLabel: 'Idle' }]}\n/>"
  }
};
