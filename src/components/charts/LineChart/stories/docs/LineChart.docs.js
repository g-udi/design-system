import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, series, xy, refs, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/LineChart": {
    ...definition('Lines per series over categories, with projections, references, annotations and a choice of curve.', [xy, series, p('curve', 'monotone | linear | step', 'monotone', 'Line interpolation.'), p('showDots', 'boolean', 'true', 'Point markers.'), refs, p('showGrid / showLegend / showTooltip', 'boolean', 'true / false / true', 'Presentation.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { LineChart } from '@gaudi/design-system/charts';\n\n<LineChart title='Subscribers' ariaLabel='Newsletter subscribers per month' data={subscribers} series={[{ key: 'subscribers', label: 'Subscribers' }, { key: 'projected', label: 'Projected', dashed: true }]} />"
  }
};
