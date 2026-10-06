import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/DonutChart": {
    ...definition('Parts of a whole as a donut with a centre summary, or a pie (PieChart); slices are selectable and small ones fold into Other.', [p('data / nameKey / valueKey', 'object[] / string / string', '[] / label / value', 'Slices.'), p('selectable / selectedIndex / defaultSelectedIndex / onSelect', 'boolean / number | null / number | null / (slice, index) => void', 'true for donuts', 'Selection pins a slice; the centre shows its share.'), p('otherThreshold / maxSlices / otherLabel', 'number / number / string', '— / — / Other', 'Fold small slices into Other.'), p('centerLabel', 'string', 'Total', 'Caption under the centre value.'), p('innerRadius', 'string | number', "'56%' (DonutChart), 0 (PieChart)", 'Hole size.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { DonutChart } from '@gaudi/design-system/charts';\n\n<DonutChart title='Where readers came from' ariaLabel='Sessions by source' data={sources} otherThreshold={0.03} onSelect={(slice) => setSource(slice?.label)} />"
  }
};
