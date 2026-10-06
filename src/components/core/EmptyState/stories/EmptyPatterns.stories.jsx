import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'empty', import.meta.url,
  import.meta.glob('./fixtures/empty/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/empty/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Feedback & States/EmptyState', id: 'core-emptystate', tags: ['autodocs'], ...catalogueMeta('empty') };

export const SurfacesActions = {
  name: 'Surfaces and actions', ...pattern('surfaces-actions', 'Plain, muted, bordered and dashed upload surfaces, with and without an icon, inline links, and one or two actions. The upload surface selects local images without transport.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Create collection' })).toHaveAttribute('href', '/projects/new');
    const input = canvas.getByLabelText('Choose images');
    await userEvent.upload(input, new File(['sample'], 'sample.png', { type: 'image/png' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('1 image selected');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear files' }));
    await expect(canvas.queryByRole('status')).toBeNull();
  }
};
export const InCard = { name: 'Inside a card', ...pattern('in-card') };
export const NotFound = {
  name: 'Not found with search', ...pattern('not-found', 'A 404 that offers a search field with a working shortcut, local submit feedback and a support link.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvasElement.ownerDocument.activeElement?.blur();
    await userEvent.keyboard('/');
    const search = canvas.getByRole('textbox', { name: 'Try searching for pages…' });
    await expect(search).toHaveFocus();
    await userEvent.type(search, 'Components');
    await userEvent.click(canvas.getByRole('button', { name: 'Search pages' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Search prepared for “Components” in this demo.');
    await expect(canvas.getByRole('link', { name: 'Contact support' })).toHaveAttribute('href', '/support');
  }
};
export const Illustrated = {
  name: 'Illustrated empty states',
  ...pattern('illustrated', 'Custom SVG and markup illustrations in place of an icon; switch scenes to compare them with none, one or two actions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No automations yet')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Integrations' }));
    await expect(canvas.getByText('No integrations')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Learn more' })).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Products' }));
    await expect(canvas.queryByRole('link', { name: 'Learn more' })).not.toBeInTheDocument();
  }
};
