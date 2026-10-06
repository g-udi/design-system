import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Separator": {
    ...definition('Separate related content with a horizontal or vertical rule.', [p('orientation', 'horizontal | vertical', 'horizontal', 'Direction of the rule.'), p('decorative', 'boolean', 'true', 'Keep visual-only separators out of the accessibility tree.'), className], 'Set decorative={false} only when the separator conveys meaningful structure.'),
    usage: "import { Separator } from '@gaudi/design-system/core/Separator';\n\n<Separator orientation='horizontal' />"
  }
};
