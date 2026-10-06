import { auditOpenDialogs } from './auditOpenStates.js';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { catalogueInteractions, openEachDialog } from '../../../../docs/components/PatternInteractions.js';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'dialog', import.meta.url,
  import.meta.glob('./fixtures/dialog/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/dialog/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

/** Opens each trigger in turn, then closes the dialog with Escape and checks focus returns to it. */
const openEach = async (context) => {
  await openEachDialog(context);
  await auditOpenDialogs(context);
};

export default { title: 'Core/Overlays & Menus/Dialog', id: 'core-dialog', tags: ['autodocs'], ...catalogueMeta('dialog') };

export const Form = {
  name: 'Form dialog',
  ...pattern('form'),
  play: async (context) => {
    await catalogueInteractions['dialog-form'](context);
    const canvas = within(context.canvasElement);
    const body = within(context.canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Basic Dialog' }));
    const dialog = await body.findByRole('dialog');
    const name = within(dialog).getByRole('textbox', { name: 'Name', exact: true });
    await userEvent.clear(name);
    await userEvent.type(name, 'Sam Example');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(canvas.getByRole('status')).toHaveTextContent('Saved Sam Example');
    await auditOpenDialogs(context);
  }
};
export const Scrollable = {
  name: 'Scrollable content',
  ...pattern('scrollable', 'Long content three ways: the body scrolls on its own, the footer stays pinned, or the dialog fills the screen with a sticky header and footer.'),
  play: openEach
};
export const CloseFooter = {
  name: 'Close button and footer options',
  ...pattern('close-footer', 'Hide the corner close button, restyle it, or end with one full-width action.'),
  play: openEach
};
export const SettingsSwitches = { name: 'Settings with switches', ...pattern('settings-switches'), play: async (context) => {
  const canvas = within(context.canvasElement);
  const body = within(context.canvasElement.ownerDocument.body);
  const trigger = canvas.getByRole('button', { name: 'Cookie Preferences' });
  await userEvent.click(trigger);
  let dialog = await body.findByRole('dialog');
  await expect(within(dialog).getByRole('switch', { name: 'Essential Cookies' })).toBeDisabled();
  await userEvent.click(within(dialog).getByRole('switch', { name: 'Analytics Cookies' }));
  await userEvent.click(within(dialog).getByRole('button', { name: 'Save Preferences' }));
  await waitFor(() => expect(dialog).not.toBeInTheDocument());
  await expect(canvas.getByRole('status')).toHaveTextContent('analytics on, marketing off');
  await userEvent.click(trigger);
  dialog = await body.findByRole('dialog');
  await expect(within(dialog).getByRole('switch', { name: 'Analytics Cookies' })).toBeChecked();
  await userEvent.click(within(dialog).getByRole('button', { name: 'Accept All' }));
  await waitFor(() => expect(dialog).not.toBeInTheDocument());
  await expect(canvas.getByRole('status')).toHaveTextContent('analytics on, marketing on');
  await auditOpenDialogs(context);
} };
export const ShortcutsList = { name: 'Keyboard shortcuts list', ...pattern('shortcuts-list'), play: auditOpenDialogs };
