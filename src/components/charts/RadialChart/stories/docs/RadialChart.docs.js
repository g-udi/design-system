import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/RadialChart": {
    ...definition('Progress against a full 0–100 track, one ring per record (RadialBarChart).', [p('data / nameKey / valueKey', 'object[] / string / string', '[] / label / value', 'One ring per record; values are percentages.'), p('color', 'string', 'chart-1', 'Colour of a single ring.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { RadialBarChart } from '@gaudi/design-system/charts';\n\n<RadialBarChart title='Goals this year' ariaLabel='Progress towards each goal' data={[{ label: 'Essays', value: 75 }]} />"
  }
};
