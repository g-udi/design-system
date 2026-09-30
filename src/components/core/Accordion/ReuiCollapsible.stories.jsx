// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'collapsible',
  import.meta.glob('../../../../.storybook/fixtures/reui/collapsible/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/collapsible/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Accordion', tags: ['autodocs'], ...catalogueMeta('collapsible') };

export const ReuiCollapsible1 = { name: 'Collapsible: Basic collapsible', ...pattern(1) };
export const ReuiCollapsible2 = { name: 'Collapsible: Collapsible with checkbox settings', ...pattern(2) };
export const ReuiCollapsible3 = { name: 'Collapsible: Collapsible animated card', ...pattern(3) };
export const ReuiCollapsible4 = { name: 'Collapsible: Collapsible card with bottom trigger', ...pattern(4) };
export const ReuiCollapsible5 = { name: 'Collapsible: Collapsible form fields', ...pattern(5) };
export const ReuiCollapsible6 = { name: 'Collapsible: Collapsible frame', ...pattern(6) };
export const ReuiCollapsible7 = { name: 'Collapsible: Nested collapsible list with actions', ...pattern(7) };
export const ReuiCollapsible8 = { name: 'Collapsible: Collapsible User profile', ...pattern(8) };
export const ReuiCollapsible9 = { name: 'Collapsible: Multi-level collapsible menu', ...pattern(9) };
export const ReuiCollapsible10 = { name: 'Collapsible: Tree view with file actions', ...pattern(10, 'Compact file explorer with expandable folders, selection, and keyboard-accessible actions. Downloads contain illustrative file content; deleting and restoring files affects only this demo.') };
