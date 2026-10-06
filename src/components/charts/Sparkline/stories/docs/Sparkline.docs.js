import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/Sparkline": {
    ...definition('A word-sized trend without axes, for stat cards, tables and prose; still a named chart with its data table.', [p('data', 'number[] | object[]', '[]', 'Numbers, or records read through xKey / yKey.'), p('variant', 'line | area | bar', 'line', 'How the trend draws.'), p('reference', 'number', '—', 'A dashed guide such as a target.'), p('showEndpoint', 'boolean', 'true', 'Dot on the latest value.'), p('color', 'string', 'chart-1', 'Trend colour.'), ...chartFrameProps], chartA11y),
    usage: "import { Sparkline } from '@gaudi/design-system/charts';\n\n<Sparkline ariaLabel='Readers, last 14 days' data={readers} variant='area' height={48} />"
  }
};
