// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'chart',
  import.meta.glob('../../../../.storybook/fixtures/reui/chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/Chart', tags: ['autodocs'], ...catalogueMeta('chart') };

export const ReuiChart1 = { name: 'Basic bar chart', ...pattern(1) };
export const ReuiChart2 = { name: 'Multi-dataset bar chart', ...pattern(2) };
export const ReuiChart3 = { name: 'Diagonal stripe bar chart', ...pattern(3) };
export const ReuiChart4 = { name: 'Dotted pattern bar chart', ...pattern(4) };
export const ReuiChart5 = { name: 'Striped and solid bar chart', ...pattern(5) };
export const ReuiChart6 = { name: '3D gradient bar chart', ...pattern(6) };
export const ReuiChart7 = { name: 'Gradient bar chart', ...pattern(7) };
export const ReuiChart8 = { name: '3D isometric bar chart', ...pattern(8) };
export const ReuiChart9 = { name: 'Dotted and solid bar chart', ...pattern(9) };
export const ReuiChart10 = { name: 'Duotone gradient bar chart', ...pattern(10) };
export const ReuiChart11 = { name: 'Animated monochrome bar chart', ...pattern(11) };
export const ReuiChart12 = { name: 'Vertical bar chart', ...pattern(12) };
export const ReuiChart13 = { name: 'Gradient area chart with stripe overlay', ...pattern(13) };
export const ReuiChart14 = { name: 'Stacked area chart with dashed strokes', ...pattern(14) };
export const ReuiChart15 = { name: 'Step area chart with dotted pattern fill', ...pattern(15) };
export const ReuiChart16 = { name: 'Area chart with glowing dot markers', ...pattern(16) };
export const ReuiChart17 = { name: 'Forecast line chart with stripe pattern zone', ...pattern(17) };
export const ReuiChart18 = { name: 'Stacked area chart with crosshatch pattern fill', ...pattern(18) };
export const ReuiChart19 = { name: 'Donut chart with center total', ...pattern(19) };
export const ReuiChart20 = { name: 'Donut chart with center stats', ...pattern(20) };
export const ReuiChart21 = { name: 'Bug priority pie with stripe patterns', ...pattern(21) };
export const ReuiChart22 = { name: 'Active segment donut with center label', ...pattern(22) };
export const ReuiChart23 = { name: 'Radar chart with gradient fill', ...pattern(23) };
export const ReuiChart24 = { name: 'Filled radar with glowing stroke', ...pattern(24) };
export const ReuiChart25 = { name: 'Lighthouse scores radial with labels', ...pattern(25) };
