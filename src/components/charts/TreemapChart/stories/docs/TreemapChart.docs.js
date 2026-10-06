import { p, definition } from '../../../../../docs/components/referenceProps.js';
import { chartFrameProps, chartA11y, colors } from '../../../ChartFrame/stories/docs/chartReference.js';
export default {
  "Charts/TreemapChart": {
    ...definition('Nested rectangles sized by value, tinted by group or shaded on the heat ramp.', [p('data', 'Array<{ name, value } | { name, children }>', '[]', 'One or two levels.'), p('nameKey / valueKey', 'string', 'name / value', 'Field names.'), p('colorBy', 'group | value', 'group', 'Tint by top-level group or shade by value.'), colors, ...chartFrameProps], chartA11y),
    usage: "import { TreemapChart } from '@gaudi/design-system/charts';\n\n<TreemapChart ariaLabel='Hours read by section' data={[{ name: 'Essays', children: [{ name: 'Engineering', value: 1240 }] }]} />"
  }
};
