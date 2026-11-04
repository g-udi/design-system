import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  'Chat/ChatContextWindow': {
    ...definition("Inspect prepared context capacity, highlight categories and request file removal alongside host-owned compaction controls.", [
      p("usedTokens / maxTokens", "number", "0", "Prepared totals. Zero capacity displays 0% and an empty decorative cell map; totals are not inferred from files."),
      p("parts", "ContextPart[]", "[]", "Ordered { id, label, tokens, color?, detail?, busy?, files?: { id, name, tokens, disabled? }[], actions?: ReactNode }. Color accepts a Gaudi token value. Busy animates only that part, respecting reduced motion."),
      p("onRemoveFile", "(fileId, partId) => void", "\u2014", "Request removal. Omit to hide remove controls. Returns focus to that category disclosure; no file is deleted."),
      p("disabled", "boolean", "false", "Disable file removal while retaining category inspection. Host-provided action slots manage their own disabled state."),
      p("tone", "accent | warning | danger", "accent", "Host-supplied capacity tone; the component does not choose thresholds."),
      p("formatTokens / formatPercentage", "(number) => string", "Intl.NumberFormat / one decimal", "Format counts and percentages. Percentage formatter returns the number without the percent sign."),
      p("hint / footer", "ReactNode", "\u2014", "Default category guidance and host-owned status/actions. Hover, focus and persistent category selection are local UI state."),
      p("title / description", "ReactNode", "\u2014", "Panel heading and supporting text."),
      p("className", "string", "\u2014", "Additional root classes. Panels fill available width; the consuming layout chooses any maximum width.")
    ], 'Native buttons, semantic headings and Gaudi disclosures preserve keyboard and focus behavior. Host callbacks own persistence and services.'),
    usage: "import { ChatContextWindow } from '@gaudi/design-system/chat/ChatContextWindow';\n\n<ChatContextWindow\n  usedTokens={1200} maxTokens={8000}\n  parts={[{ id: 'instructions', label: 'Instructions', tokens: 1200, color: 'var(--ds-color-chart-1)', detail: 'Prepared system instructions.' }]}\n/>"
  }
};
