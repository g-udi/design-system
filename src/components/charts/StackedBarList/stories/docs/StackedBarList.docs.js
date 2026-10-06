import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/StackedBarList": {
    ...definition('Ranked rows of stacked segments that grow with the list: issues by status per team, readers by source per post.', [p('data / labelKey', 'object[] / string', '[] / label', 'Rows.'), p('series', 'Array<{ key, label? }>', 'valueKey', 'Segments in order.'), p('normalize', 'boolean', 'false', 'Each row as 100% to compare mixes.'), p('sort', 'boolean', 'true', 'Largest row first.'), p('showLegend', 'boolean', 'true', 'Segment legend.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { StackedBarList } from '@gaudi/design-system/charts';\n\n<StackedBarList ariaLabel='Issues per team by status' data={teams} series={[{ key: 'open', label: 'Open' }, { key: 'done', label: 'Done' }]} />"
  }
};
