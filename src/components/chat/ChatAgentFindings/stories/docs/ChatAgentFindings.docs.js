import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  'Chat/ChatAgentFindings': {
    ...definition("Filter prepared findings by agent and severity, inspect evidence and request review changes.", [
      p("agents", "Agent[]", "[]", "Prepared rows: { id, name, icon?, detail?, value?, max?, statusLabel?, tone? }. Progress appears only with a finite nonnegative value and finite positive max; zero progress is preserved. Progress values and status text come from the host."),
      p("findings", "Finding[]", "[]", "Ordered findings: { id, agent, severity, title, location?, time?, evidence?, recommendation? }. Agent and severity refer to supplied IDs; no severity is inferred."),
      p("severities", "Severity[]", "[]", "Filter options: { id, label, tone? }. IDs are case-sensitive; __all is reserved for the all-severities option."),
      p("reviewedIds", "string[]", "[]", "Controlled list of reviewed finding IDs."),
      p("onReviewedChange", "(id, reviewed) => void", "\u2014", "Request a review change. Omit for display-only review state; persistence belongs to the host."),
      p("readOnly", "boolean", "false", "Disable review actions while leaving filtering and evidence inspection available."),
      p("summary / emptyState / footer", "ReactNode", "\u2014", "Prepared progress summary, empty content and footer controls/status. Filters and evidence disclosure are local UI state."),
      p("title / description", "ReactNode", "\u2014", "Panel heading and supporting text."),
      p("className", "string", "\u2014", "Additional root classes. Panels fill available width; the consuming layout chooses any maximum width.")
    ], 'Native buttons, semantic headings and Gaudi disclosures preserve keyboard and focus behavior. Host callbacks own persistence and services.'),
    usage: "import { ChatAgentFindings } from '@gaudi/design-system/chat/ChatAgentFindings';\n\n<ChatAgentFindings\n  agents={[{ id: 'reviewer', name: 'Reviewer', statusLabel: 'Done' }]}\n  severities={[{ id: 'warning', label: 'Warning', tone: 'warning-light' }]}\n  findings={[{ id: 'retry', agent: 'reviewer', severity: 'warning', title: 'Retry creates a duplicate', evidence: 'The same request created two records.' }]}\n/>"
  }
};
