import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Timeline": {
    ...definition('Display dated activity and milestones with readable descriptions and optional actions.', [p('items', 'Array<{ id, title, description?, time?, dateTime?, icon?, children? }>', '[]', 'Chronological entries with stable IDs.'), p('label', 'string', 'Activity', 'Accessible name of the list.'), className], 'Use machine-readable dateTime values with visible dates. Icons supplement the text and are decorative.'),
    usage: "import Timeline from '@gaudi/design-system/core/Timeline';\n\n<Timeline items={milestones} />"
  }
};
