import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/Chart', tags: ['autodocs'], ...catalogueMeta('chart') };

export const ChartPattern1 = { name: 'Basic bar chart', ...pattern(1) };
export const ChartPattern2 = { name: 'Multi-dataset bar chart', ...pattern(2) };
export const ChartPattern3 = { name: 'Diagonal stripe bar chart', ...pattern(3) };
export const ChartPattern4 = { name: 'Dotted pattern bar chart', ...pattern(4) };
export const ChartPattern5 = { name: 'Striped and solid bar chart', ...pattern(5) };
export const ChartPattern6 = { name: '3D gradient bar chart', ...pattern(6) };
export const ChartPattern7 = { name: 'Gradient bar chart', ...pattern(7) };
export const ChartPattern8 = { name: '3D isometric bar chart', ...pattern(8) };
export const ChartPattern9 = { name: 'Dotted and solid bar chart', ...pattern(9) };
export const ChartPattern10 = { name: 'Duotone gradient bar chart', ...pattern(10) };
export const ChartPattern11 = { name: 'Animated monochrome bar chart', ...pattern(11) };
export const ChartPattern12 = { name: 'Vertical bar chart', ...pattern(12) };
export const ChartPattern13 = { name: 'Gradient area chart with stripe overlay', ...pattern(13) };
export const ChartPattern14 = { name: 'Stacked area chart with dashed strokes', ...pattern(14) };
export const ChartPattern15 = { name: 'Step area chart with dotted pattern fill', ...pattern(15) };
export const ChartPattern16 = { name: 'Area chart with glowing dot markers', ...pattern(16) };
export const ChartPattern17 = { name: 'Forecast line chart with stripe pattern zone', ...pattern(17) };
export const ChartPattern18 = { name: 'Stacked area chart with crosshatch pattern fill', ...pattern(18) };
export const ChartPattern19 = { name: 'Donut chart with center total', ...pattern(19) };
export const ChartPattern20 = { name: 'Donut chart with center stats', ...pattern(20) };
export const ChartPattern21 = { name: 'Bug priority pie with stripe patterns', ...pattern(21) };
export const ChartPattern22 = { name: 'Active segment donut with center label', ...pattern(22) };
export const ChartPattern23 = { name: 'Radar chart with gradient fill', ...pattern(23) };
export const ChartPattern24 = { name: 'Filled radar with glowing stroke', ...pattern(24) };
export const ChartPattern25 = { name: 'Lighthouse scores radial with labels', ...pattern(25) };
