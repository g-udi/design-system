import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, refs } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/RangeChart": {
    ...definition('A band between a low and a high value per category with a line through it: forecasts, percentile spreads, highs and lows.', [p('lowKey / highKey / valueKey', 'string', 'low / high / value', 'Band edges and the optional line.'), p('bandLabel / valueLabel', 'string', 'Range / Value', 'Names in tooltips and the table.'), p('xKey', 'string', 'label', 'Category field.'), refs, p('color', 'string', 'chart-1', 'Band and line colour.'), ...chartFrameProps], chartA11y),
    usage: "import { RangeChart } from '@gaudi/design-system/charts';\n\n<RangeChart ariaLabel='Median response time with its p10 to p90 band' data={latency} bandLabel='p10–p90' valueLabel='Median' />"
  }
};
