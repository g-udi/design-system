import { p, children, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y } from './chartReference.js';
export default {
  "Charts/ChartFrame": {
    ...definition('The frame every chart renders in: a captioned figure with one keyboard stop and a readout, loading, empty, invalid and error states, locale-aware numbers and a data table built from points. Use it around a custom visual, with the Recharts composition parts and Gaudi primitives.', [p('points', 'Array<{ label, values: Array<{ name, value, display?, color? }> }>', '[]', 'What the keyboard walks and the table lists.'), p('status', 'ready | loading | empty | invalid | error', 'ready', 'The frame state; charts derive it from their data.'), p('columns', 'number', '—', 'Row length for Up and Down on grid-shaped visuals.'), children, p('useChartFrame()', 'hook', '—', 'activeIndex, setActive and format for drawn elements; mark them with data-chart-index.'), p('ChartContainer / ChartGrid / ChartXAxis / ChartYAxis / ChartReferenceLine / ChartAnnotations / createRowsTooltip', 'parts', '—', 'Style bespoke Recharts charts with chart tokens.'), ...chartFrameProps], chartA11y),
    usage: "import { ChartFrame, useChartFrame } from '@gaudi/design-system/charts';\n\n<ChartFrame title='Writing goals' ariaLabel='Progress towards writing goals' points={points} showData='toggle'>\n  <GoalBars />\n</ChartFrame>"
  }
};
