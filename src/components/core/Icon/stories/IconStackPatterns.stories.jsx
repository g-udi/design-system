import { expect, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'icon-stack', import.meta.url,
  import.meta.glob('./fixtures/icon-stack/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/icon-stack/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Icon', id: 'core-icon', tags: ['autodocs'], ...catalogueMeta('icon-stack') };

export const IconStackSizesBadge = { name: 'Sizes, colors and badge', ...pattern('sizes-badge') };
export const IconStackInContext = {
  name: 'In an empty state and list row', ...pattern('in-context'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Invite team' })).toHaveAttribute('href', '/settings/team/invite');
    await expect(canvas.getByRole('link', { name: 'Connect source' })).toHaveAttribute('href', '/settings/integrations');
  }
};
