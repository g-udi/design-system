import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'tabs',
  import.meta.glob('../../../../.storybook/fixtures/patterns/tabs/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/tabs/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tabs', tags: ['autodocs'], ...catalogueMeta('tabs') };

export const TabsPattern1 = { name: 'Basic tabs', ...pattern(1) };
export const TabsPattern2 = { name: 'Line variant', ...pattern(2) };
export const TabsPattern3 = { name: 'Vertical orientation', ...pattern(3) };
export const TabsPattern4 = { name: 'Vertical line variant', ...pattern(4) };
export const TabsPattern5 = { name: 'Icons with form panels', ...pattern(5) };
export const TabsPattern6 = { name: 'Full-width icon tabs', ...pattern(6) };
export const TabsPattern7 = { name: 'Badge counts', ...pattern(7) };
export const TabsPattern8 = { name: 'Line variant with icons', ...pattern(8) };
export const TabsPattern9 = { name: 'Segmented control tabs', ...pattern(9) };
