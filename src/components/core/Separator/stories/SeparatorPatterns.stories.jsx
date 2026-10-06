import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, within } from 'storybook/test';

const pattern = patternStories(
  'separator', import.meta.url,
  import.meta.glob('./fixtures/separator/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/separator/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Separator', id: 'core-separator', tags: ['autodocs'], ...catalogueMeta('separator') };

export const Horizontal = { name: 'Horizontal rules', ...pattern('horizontal', 'Rules split a header from its content, divide list rows, and set off a total.') };
export const Vertical = { name: 'Vertical rules', ...pattern('vertical', 'Vertical rules stretch to the height of a flex row; a fixed height keeps them shorter than two-line items.') };
export const TextLabel = {
  name: 'Text label',
  ...pattern('text-label', 'A label on the page background interrupts the rule.'),
  play: async ({ canvasElement }) => {
    const label = within(canvasElement).getByText('or continue with');
    await expect(label).toBeVisible();
    const bounds = label.getBoundingClientRect();
    const container = label.parentElement.getBoundingClientRect();
    await expect(bounds.top).toBeGreaterThanOrEqual(container.top);
    await expect(bounds.bottom).toBeLessThanOrEqual(container.bottom);
  }
};
