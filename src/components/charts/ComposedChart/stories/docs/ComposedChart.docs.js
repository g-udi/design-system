import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, refs, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/ComposedChart": {
    ...definition('Bars, lines and areas on one category axis, with a right-hand axis for a series in other units.', [p('series', 'Array<{ key, label?, type: bar | line | area, axis?: right, stack?, dashed? }>', 'views bar + readTime line', 'Each series names how it draws and which axis it reads against.'), p('xKey', 'string', 'label', 'Category field.'), refs, p('showGrid / showLegend / showTooltip', 'boolean', 'true', 'Presentation.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { ComposedChart } from '@gaudi/design-system/charts';\n\n<ComposedChart ariaLabel='Weekly views and minutes read' data={weeks} series={[{ key: 'views', type: 'bar' }, { key: 'readTime', type: 'line', axis: 'right' }]} />"
  }
};
