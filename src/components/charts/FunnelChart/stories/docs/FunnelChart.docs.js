import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/FunnelChart": {
    ...definition('Steps in order with the conversion from each step to the next, as left-aligned bars or a centred funnel.', [p('data / labelKey / valueKey', 'object[] / string / string', '[] / label / value', 'Steps in order.'), p('align', 'start | center', 'start', 'Left-aligned bars or a centred funnel.'), p('monochrome', 'boolean', 'true', 'One hue fading by step.'), p('conversionLabel', 'string', 'from previous', 'Suffix on each conversion rate.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { FunnelChart } from '@gaudi/design-system/charts';\n\n<FunnelChart ariaLabel='Trial to paid funnel' data={steps} align='center' />"
  }
};
