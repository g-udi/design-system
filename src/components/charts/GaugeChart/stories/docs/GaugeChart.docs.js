import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/GaugeChart": {
    ...definition('One reading against threshold bands with a target tick, on any scale.', [p('value', 'number', 'required', 'The reading.'), p('min / max', 'number', '0 / 100', 'Scale.'), p('target', 'number', '—', 'Goal marked on the track.'), p('bands', 'Array<{ to, tone }>', '[]', 'Ascending threshold bands.'), p('label / unit', 'string', '—', 'Caption under the value and its suffix.'), ...chartFrameProps], chartA11y),
    usage: "import { GaugeChart } from '@gaudi/design-system/charts';\n\n<GaugeChart ariaLabel='Mobile performance score' value={84} target={90} bands={[{ to: 50, tone: 'danger' }, { to: 90, tone: 'warning' }, { to: 100, tone: 'success' }]} />"
  }
};
