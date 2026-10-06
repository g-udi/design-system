import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/ScatterChart": {
    ...definition('Correlation between two numbers, with labelled points, reference lines and bubbles sized by a third value (BubbleChart).', [p('xKey / yKey / zKey', 'string', 'x / y / —', 'Numeric fields; zKey sizes bubbles.'), p('xLabel / yLabel / zLabel', 'string', 'field names', 'Names in the readout, tooltip and table.'), p('zRange', '[number, number]', '[60, 900]', 'Bubble area range.'), p('references', 'Array<{ x?, y?, label }>', '—', 'Guide lines on either axis.'), p('color', 'string', 'chart-1', 'Point colour; a point may carry its own color.'), ...chartFrameProps], chartA11y),
    usage: "import { BubbleChart, ScatterChart } from '@gaudi/design-system/charts';\n\n<ScatterChart ariaLabel='Essay length against minutes read' data={essays} xKey='words' yKey='minutes' xLabel='Words' yLabel='Minutes' />"
  }
};
