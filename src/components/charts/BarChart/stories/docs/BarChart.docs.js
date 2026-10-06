import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, series, xy, refs, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/BarChart": {
    ...definition('Bars per category: single, grouped or stacked, upright or on their side, with references, annotations and a highlighted bar.', [xy, series, p('stacked', 'boolean', 'false', 'Stack the series into one bar.'), p('layout', 'vertical | horizontal', 'vertical', 'Horizontal lays bars along the value axis for long labels.'), p('highlight', 'string', '—', 'Category to emphasise; the others dim.'), p('barRadius', 'number', '4', 'Corner radius at the bar end.'), refs, p('showGrid / showLegend / showTooltip', 'boolean', 'true / false / true', 'Presentation.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { BarChart } from '@gaudi/design-system/charts';\n\n<BarChart title='Readers by channel' ariaLabel='Monthly readers by channel' data={readers} series={[{ key: 'search', label: 'Search' }, { key: 'newsletter', label: 'Newsletter' }]} showLegend />"
  }
};
