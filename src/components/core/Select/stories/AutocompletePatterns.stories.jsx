import { expect, userEvent, waitFor, within } from 'storybook/test';
import { auditOverlayState } from '../../Popover/stories/auditOverlayState.js';
import { auditSelectMenus } from './auditSelectMenus.js';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'autocomplete', import.meta.url,
  import.meta.glob('./fixtures/autocomplete/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/autocomplete/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', id: 'core-select', tags: ['autodocs'], ...catalogueMeta('autocomplete'), play: auditSelectMenus };

export const AutocompleteInputOptions = {
  name: 'Input options',
  ...pattern('input-options', 'One field per input option: auto highlight, clear and trigger buttons, disabled, and the small and large sizes.'),
  play: async (context) => {
    for (const input of context.canvasElement.querySelectorAll('[data-slot="autocomplete-input"]')) {
      const adornment = [...input.parentElement.querySelectorAll('button')].find((button) => button.getBoundingClientRect().width > 0);
      if (!adornment) continue;
      const bounds = input.getBoundingClientRect();
      const button = adornment.getBoundingClientRect();
      const style = getComputedStyle(input);
      const reserved = parseFloat(style.paddingInlineEnd);
      await expect(reserved).toBeGreaterThanOrEqual(style.direction === 'rtl' ? button.right - bounds.left : bounds.right - button.left);
    }
    await auditSelectMenus(context);
  }
};
export const AutocompletePeopleSearch = { name: 'Grouped people search', ...pattern('people-search', 'People grouped by team with avatars and roles, filtered as you type a name or role.') };
export const AutocompleteAsyncSearch = {
  name: 'Async search results',
  ...pattern('async-search', 'A debounced search mock that announces loading, empty, error and result counts. Search for “error” to try the error state.'),
  play: async (context) => {
    const input = within(context.canvasElement).getByRole('combobox');
    const body = within(context.canvasElement.ownerDocument.body);
    for (const [query, expected, state] of [
      ['Bram', /contributor.*found/, 'results'],
      ['error', /Could not load contributors/, 'error'],
      ['zzzx', /No contributors match/, 'empty']
    ]) {
      await userEvent.clear(input);
      await userEvent.type(input, query);
      await waitFor(() => expect(body.getByText('Searching contributors...')).toBeVisible());
      await waitFor(() => expect(body.getByText(expected)).toBeVisible(), { timeout: 3000 });
      await auditOverlayState(context, state);
    }
    await userEvent.keyboard('{Escape}');
    await userEvent.clear(input);
    input.blur();
  }
};
export const AutocompleteInForm = { name: 'Autocomplete in a form', ...pattern('in-form', 'A validated form field that shows its error on submit.'), play: async (context) => {
  await auditSelectMenus(context);
  const canvas = within(context.canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
  await expect(await canvas.findByText('Please select an item.')).toBeVisible();
  await userEvent.type(canvas.getByRole('combobox'), 'feature');
  await userEvent.keyboard('{ArrowDown}{Enter}');
  await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
  const body = within(context.canvasElement.ownerDocument.body);
  await waitFor(() => expect(body.getByText('Form submitted')).toBeVisible());
  await userEvent.click(body.getByRole('button', { name: /close toast/i }));
} };
