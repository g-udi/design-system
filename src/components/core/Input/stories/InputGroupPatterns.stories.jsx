import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'input-group', import.meta.url,
  import.meta.glob('./fixtures/input-group/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/input-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Input', id: 'core-input', tags: ['autodocs'], ...catalogueMeta('input-group') };

export const InputGroupAddons = {
  name: 'Addon placement',
  ...pattern('addons', 'Icons and text before, after or on both sides of the input, divided addons, a header above an input, and a counter under a textarea.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole('textbox', { name: 'Block-end footer' });
    await userEvent.type(textarea, 'Hello');
    await expect(canvas.getByText('5/140 characters')).toBeVisible();
    // A click marks pointer focus: the caret shows without a ring.
    await expect(textarea).toHaveAttribute('data-focus-source', 'pointer');
    await expect(getComputedStyle(textarea.closest('[data-slot="input-group"]')).boxShadow).toBe('none');
    for (const control of [textarea, canvas.getByRole('textbox', { name: 'Leading icon' })]) {
      // Keyboard-style focus (no pointer mark after blur) draws the group's accent ring.
      control.blur();
      control.focus();
      await expect(control).not.toHaveAttribute('data-focus-source');
      await expect(control).toHaveFocus();
      await expect(getComputedStyle(control).outlineStyle).toBe('none');
      await expect(getComputedStyle(control.closest('[data-slot="input-group"]')).boxShadow).toMatch(/0px 0px 0px 3px/);
    }
  }
};
export const InputGroupHintsStates = {
  name: 'Hints and states',
  ...pattern('hints-states', 'Keyboard shortcuts, a result count, a valid check, a loading spinner, and the disabled and invalid states.'),
  play: async ({ canvasElement }) => {
    const disabled = canvasElement.querySelector('[data-slot="input-group-control"]:disabled');
    await expect(disabled).toBeDisabled();
    await expect(getComputedStyle(disabled).opacity).toBe('1');
    await expect(getComputedStyle(disabled.closest('[data-slot="input-group"]')).opacity).toBe('0.5');
    const validIcon = within(canvasElement).getByLabelText('Valid').closest('[data-slot="input-group"]').querySelector('svg');
    const root = canvasElement.ownerDocument.documentElement;
    const scale = root.style.getPropertyValue('--ds-space-scale');
    try {
      for (const value of ['0.75', '1.25']) {
        root.style.setProperty('--ds-space-scale', value);
        await expect(validIcon.getBoundingClientRect().width).toBe(16);
      }
    } finally {
      root.style.setProperty('--ds-space-scale', scale);
    }
  }
};
export const InputGroupInlineActions = {
  name: 'Inline actions',
  ...pattern('inline-actions', 'A text button, icon buttons, a visibility toggle, a tooltip, a popover, a menu, and a group inside a button group.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByLabelText('Visibility toggle');
    await expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(password).toHaveAttribute('type', 'text');
    await expect(canvas.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
    const menu = canvas.getByRole('button', { name: 'More actions' });
    await userEvent.click(menu);
    await userEvent.click(within(canvasElement.ownerDocument.body).getByRole('menuitem', { name: 'Duplicate' }));
    const file = canvas.getByRole('textbox', { name: 'Menu', exact: true });
    await expect(file).toHaveValue('Copy of quarterly-report.pdf');
    await userEvent.click(menu);
    await userEvent.click(within(canvasElement.ownerDocument.body).getByRole('menuitem', { name: 'Rename' }));
    await waitFor(() => expect(file).toHaveFocus());
    await expect(file.selectionEnd).toBe(file.value.length);
    const readOnly = canvas.getByRole('textbox', { name: 'Icon button' });
    await userEvent.type(readOnly, 'unchanged');
    await expect(readOnly).toHaveValue('https://gaudi.dev/share');
    const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const execDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand');
    const writeText = fn().mockRejectedValueOnce(new Error('Clipboard denied')).mockResolvedValue(undefined);
    try {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
      Object.defineProperty(document, 'execCommand', { configurable: true, value: () => false });
      await userEvent.click(canvas.getByRole('button', { name: 'Copy', exact: true }));
      await expect(canvas.getByRole('status')).toHaveTextContent('Copy failed. Try again.');
      await userEvent.click(canvas.getByRole('button', { name: 'Copy', exact: true }));
      await expect(await canvas.findByRole('button', { name: 'Link copied' })).toBeVisible();
      await expect(writeText).toHaveBeenLastCalledWith(readOnly.value);
      const name = canvas.getByRole('textbox', { name: 'Several trailing actions' });
      await expect(canvas.getByRole('button', { name: 'Copy name' })).toBeDisabled();
      await userEvent.type(name, 'InputGroup');
      await userEvent.click(canvas.getByRole('button', { name: 'Copy name' }));
      await expect(await canvas.findByRole('button', { name: 'Name copied' })).toBeVisible();
      await expect(writeText).toHaveBeenLastCalledWith('InputGroup');
      await userEvent.clear(name);
      await userEvent.type(name, 'Field');
      await userEvent.click(canvas.getByRole('button', { name: 'Copy name' }));
      await expect(writeText).toHaveBeenLastCalledWith('Field');
      await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Copied to clipboard.'));
    } finally {
      if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
      else delete navigator.clipboard;
      if (execDescriptor) Object.defineProperty(document, 'execCommand', execDescriptor);
      else delete document.execCommand;
    }
  }
};
export const InputGroupDropdowns = {
  name: 'Dropdown selectors', ...pattern('dropdowns', 'A menu in a leading or trailing addon picks a country code, region, role, category, HTTP method or link visibility. Send prepares a local demo request; Copy uses the current URL.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const endpoint = canvas.getByRole('textbox', { name: 'Method and send' });
    await userEvent.clear(endpoint);
    await userEvent.type(endpoint, '/v1/items');
    await userEvent.click(canvas.getByRole('button', { name: 'Send', exact: true }));
    await expect(canvas.getByRole('status')).toHaveTextContent('GET /v1/items prepared in this demo.');
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const writeText = fn().mockResolvedValue(undefined);
    try {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
      const link = canvas.getByRole('textbox', { name: 'Visibility and copy' });
      await userEvent.clear(link);
      await userEvent.type(link, 'https://gaudi.dev/runbooks/new');
      await userEvent.click(canvas.getByRole('button', { name: 'Copy link' }));
      await waitFor(() => expect(writeText).toHaveBeenLastCalledWith(link.value));
      await expect(canvas.getByRole('status')).toHaveTextContent('Link copied.');
    } finally {
      if (descriptor) Object.defineProperty(navigator, 'clipboard', descriptor);
      else delete navigator.clipboard;
    }
  }
};
export const InputGroupSearchFilters = {
  name: 'Search with filters',
  ...pattern('search-filters', 'A clear button appears once there is a query, a status filter shows how many are selected, and a menu holds bulk actions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('textbox', { name: 'Search contacts...' });
    await userEvent.type(search, 'ada');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(search).toHaveValue('');
    await expect(search).toHaveFocus();
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).toBeNull();
  }
};
export const InputGroupComposer = {
  name: 'Multi-field composer', ...pattern('composer', 'A title input and a description textarea share one group, with a destination menu, local Save feedback and Cancel to clear the draft.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole('textbox', { name: 'Name this collection...' });
    const description = canvas.getByRole('textbox', { name: 'Add a short introduction. Line breaks are kept...' });
    await expect(canvas.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
    await userEvent.type(title, 'Design system');
    await userEvent.type(description, 'Shared components.');
    await userEvent.click(canvas.getByRole('button', { name: 'Save', exact: true }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Design system saved to Personal in this demo.');
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel', exact: true }));
    await expect(title).toHaveValue('');
    await expect(description).toHaveValue('');
    await expect(canvas.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
  }
};
export const InputGroupAiPrompts = {
  name: 'AI prompt inputs', ...pattern('ai-prompts', 'A prompt bar and multi-line composer with prepared context, a search toggle and model choices. Send prepares local feedback; host-only recording and attachments are explicitly unavailable.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const draft = canvas.getByRole('textbox', { name: 'Plan, search, build anything' });
    await expect(canvas.getByRole('button', { name: 'Send message' })).toBeDisabled();
    await userEvent.type(draft, 'Summarize the brief');
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }));
    await expect(draft).toHaveValue('');
    await expect(canvas.getByRole('status')).toHaveTextContent('Prompt prepared with Balanced: Summarize the brief');
    await expect(canvas.getByRole('button', { name: 'Send message' })).toBeDisabled();
    for (const microphone of canvas.getAllByRole('button', { name: 'Use microphone' })) await expect(microphone).toBeDisabled();
  }
};
