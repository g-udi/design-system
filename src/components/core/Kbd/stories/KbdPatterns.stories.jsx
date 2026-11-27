import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'kbd',
  import.meta.url,
  import.meta.glob('./fixtures/kbd/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/kbd/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Kbd', id: 'core-kbd', tags: ['autodocs'], ...catalogueMeta('kbd') };

export const KeysGroups = {
  name: 'Keys, groups and icons',
  ...pattern(
    'keys-groups',
    'Single keys, grouped combinations and keys with an icon, built from the Kbd and KbdGroup parts.'
  )
};
export const InControls = {
  name: 'Shortcuts in controls',
  ...pattern(
    'in-controls',
    'Focus the component search with a keyboard shortcut, submit with Enter, and clear the search with Escape.'
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox', { name: 'Search components' });
    canvas.getByRole('button', { name: 'Search' }).focus();
    const meta = /mac|iphone|ipad/i.test(navigator.platform) ? 'Meta' : 'Control';
    await userEvent.keyboard(`{${meta}>}k{/${meta}}`);
    await expect(field).toHaveFocus();
    await userEvent.type(field, 'cal{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent('Calendar');
    await userEvent.keyboard('{Escape}');
    await expect(field).toHaveValue('');
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
    await userEvent.type(field, 'no matches');
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('No matching components');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(field).toHaveFocus();
  }
};
