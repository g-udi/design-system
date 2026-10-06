import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/BoxPlotChart": {
    ...definition('Distributions side by side: median, quartiles, whiskers at 1.5 × IQR and outliers, from raw samples or precomputed summaries.', [p('data', 'Array<{ label, values } | { label, min, q1, median, q3, max, outliers? }>', '[]', 'Groups.'), p('labelKey / valuesKey', 'string', 'label / values', 'Field names.'), p('unit', 'string', '—', 'Suffix on axis ticks.'), p('color', 'string', 'chart-1', 'Box colour.'), ...chartFrameProps], chartA11y),
    usage: "import { BoxPlotChart } from '@gaudi/design-system/charts';\n\n<BoxPlotChart ariaLabel='Load time by template' data={[{ label: 'Home', values: [410, 460, 480, 520, 1420] }]} unit='ms' />"
  }
};
