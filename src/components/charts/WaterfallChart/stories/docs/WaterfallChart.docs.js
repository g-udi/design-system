import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/WaterfallChart": {
    ...definition('How a starting value becomes an ending one through increases and decreases, with running totals and subtotals.', [p('data', 'Array<{ label, value? , total? }>', '[]', 'Steps; total: true draws the running total or its own value.'), p('labelKey / valueKey / totalKey', 'string', 'label / value / total', 'Field names.'), p('changeLabel / totalLabel', 'string', 'Change / Total', 'Names in tooltips and the table.'), ...chartFrameProps], chartA11y),
    usage: "import { WaterfallChart } from '@gaudi/design-system/charts';\n\n<WaterfallChart ariaLabel='Change in subscribers' data={[{ label: 'September', value: 4180, total: true }, { label: 'New', value: 620 }, { label: 'Lost', value: -310 }, { label: 'October', total: true }]} />"
  }
};
