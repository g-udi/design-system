import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/HeatmapChart": {
    ...definition('Values on a grid of rows and columns, on a sequential or diverging ramp; Up and Down move between rows.', [p('data', 'Array<{ x, y, value }>', '[]', 'Cells.'), p('xKey / yKey / valueKey', 'string', 'x / y / value', 'Field names.'), p('xLabels / yLabels', 'string[]', 'first appearance', 'Column and row order.'), p('scale / midpoint', 'sequential | diverging / number', 'sequential / 0', 'Ramp; diverging centres on midpoint.'), p('showValues / valueLabel', 'boolean / string', 'up to 12 columns / Value', 'Print values in cells; their name in the readout.'), ...chartFrameProps], chartA11y),
    usage: "import { HeatmapChart } from '@gaudi/design-system/charts';\n\n<HeatmapChart ariaLabel='Readers by day and time' data={cells} valueLabel='Readers' />"
  }
};
