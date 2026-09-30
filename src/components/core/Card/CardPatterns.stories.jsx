import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'card',
  import.meta.glob('../../../../.storybook/fixtures/patterns/card/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/Card', id: 'core-card', tags: ['autodocs'], ...catalogueMeta('card') };

export const CardPattern1 = { name: 'Sections and dividers', ...pattern(1, 'Header, description, header menu, content link and footer actions; switches toggle the header and footer dividers and a stacked depth effect.') };
export const CardPattern7 = { name: 'Media cards', ...pattern(7, 'An image card with inset or full-bleed media beside an overlay card with an author header, gradient fades and hover zoom.') };
export const CardPattern17 = { name: 'Link cards', ...pattern(17, 'Navigation cards led by an icon tile or a bordered header label.') };
export const CardPattern15 = { name: 'Stat with trend and menu', ...pattern(15) };
export const CardPattern16 = { name: 'Header badge and actions', ...pattern(16) };
export const CardPattern14 = { name: 'Deployment status', ...pattern(14) };
export const CardPattern13 = { name: 'Expandable billing usage', ...pattern(13) };
export const CardPattern12 = { name: 'Login form', ...pattern(12) };
