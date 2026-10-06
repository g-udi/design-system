import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, series, xy, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/RadarChart": {
    ...definition('Scores on several axes at once, one record per axis and a value per series; a dashed series reads as a target.', [xy, series, p('domain', '[number, number | auto]', '[0, auto]', 'Fix the scale so charts compare.'), p('filled', 'boolean', 'true', 'Fill each outline.'), p('showRings', 'boolean', 'true', 'Value labels on the rings.'), p('showLegend / showTooltip', 'boolean', 'true', 'Presentation.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { RadarChart } from '@gaudi/design-system/charts';\n\n<RadarChart ariaLabel='Draft scores against the target' data={review} series={[{ key: 'draft', label: 'Draft' }, { key: 'target', label: 'Target', dashed: true }]} domain={[0, 100]} />"
  }
};
