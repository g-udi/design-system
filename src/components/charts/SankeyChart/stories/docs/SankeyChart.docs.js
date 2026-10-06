import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/SankeyChart": {
    ...definition('Flows between stages with widths proportional to volume; each flow is a keyboard point and a table row.', [p('links', 'Array<{ source, target, value }>', '[]', 'Flows by stage name or index.'), p('nodes', 'Array<string | { name, color? }>', 'from links', 'Stage order and colours.'), p('nodeWidth', 'number', '10', 'Stage bar width.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { SankeyChart } from '@gaudi/design-system/charts';\n\n<SankeyChart ariaLabel='Support tickets from channel to outcome' links={[{ source: 'Email', target: 'Billing', value: 420 }, { source: 'Billing', target: 'Solved', value: 390 }]} />"
  }
};
