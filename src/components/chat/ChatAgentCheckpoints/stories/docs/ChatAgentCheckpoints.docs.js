import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  'Chat/ChatAgentCheckpoints': {
    ...definition("Inspect saved attempts and checkpoints, and request a switch or restore without changing workspace state.", [
      p("attempts", "Attempt[]", "[]", "Ordered { id, label, origin?, disabled?, checkpoints: Checkpoint[] }. Each checkpoint accepts { id, title, detail?, time?, meta?, icon?, statusLabel?, tone?, running?, restoreDisabled? }. IDs are stable, globally unique for checkpoints. Running selects the activity indicator; restoreDisabled independently controls restore availability."),
      p("currentAttemptId / currentId", "string | number", "\u2014", "Controlled current attempt and checkpoint. IDs may be zero."),
      p("activeIds", "Array<string | number>", "[]", "Prepared checkpoint IDs to emphasize as the active path. The component does not traverse or modify a run graph."),
      p("onSelectAttempt / onRestore", "(id) => void", "\u2014", "Requests to switch an attempt or restore a checkpoint. Omit either callback to hide its action."),
      p("readOnly", "boolean", "false", "Disable switching and restore requests while keeping history readable."),
      p("summary / emptyState / footer", "ReactNode", "\u2014", "Prepared summary, empty-state content and footer actions/status."),
      p("title / description", "ReactNode", "\u2014", "Panel heading and supporting text."),
      p("className", "string", "\u2014", "Additional root classes. Panels fill available width; the consuming layout chooses any maximum width.")
    ], 'Native buttons, semantic headings and Gaudi disclosures preserve keyboard and focus behavior. Host callbacks own persistence and services.'),
    usage: "import { ChatAgentCheckpoints } from '@gaudi/design-system/chat/ChatAgentCheckpoints';\n\n<ChatAgentCheckpoints\n  attempts={[{ id: 'first', label: 'Attempt 1', checkpoints: [{ id: 'saved', title: 'Prepared changes', statusLabel: 'Saved' }] }]}\n  currentAttemptId='first' currentId='saved' activeIds={['saved']}\n/>"
  }
};
