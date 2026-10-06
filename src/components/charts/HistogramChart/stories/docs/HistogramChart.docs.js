import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/HistogramChart": {
    ...definition('Observations in round bins with labelled markers such as the median, a percentile or a budget.', [p('values', 'number[]', '[]', 'Observations (or data).'), p('bins', 'number', 'auto', 'Approximate bin count; edges snap to round numbers.'), p('domain', '[number, number]', 'data extent', 'Fix the axis so histograms compare.'), p('markers', 'Array<{ value, label, tone? }>', '[]', 'Vertical guides.'), p('unit / countLabel', 'string', '— / Count', 'Bin suffix and the count column name.'), p('color', 'string', 'chart-1', 'Bar colour.'), ...chartFrameProps], chartA11y),
    usage: "import { HistogramChart } from '@gaudi/design-system/charts';\n\n<HistogramChart ariaLabel='Distribution of page weight' values={weights} markers={[{ value: 520, label: 'Median' }]} unit=' KB' />"
  }
};
