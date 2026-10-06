import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, series, xy, refs, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/AreaChart": {
    ...definition('Filled areas per series over categories, stacked into a total or overlapping from zero.', [xy, series, p('stacked', 'boolean', 'false', 'Stack the areas into a total.'), p('curve', 'monotone | linear | step', 'monotone', 'Area interpolation.'), refs, p('showGrid / showLegend / showTooltip', 'boolean', 'true / false / true', 'Presentation.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { AreaChart } from '@gaudi/design-system/charts';\n\n<AreaChart title='Readers by device' ariaLabel='Daily readers by device' data={days} series={devices} stacked showLegend />"
  }
};
