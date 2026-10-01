import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'screens',
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Onboarding', id: 'blocks-onboarding', tags: ['autodocs'], ...catalogueMeta('screens') };

export const ScreensPattern16 = {
  name: 'Workspace setup',
  ...pattern(16, 'Six questions beside a live preview of the workspace they build, with numbered steps or a progress bar; the import step picks up to two services from selectable cards.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Progress bar' }));
    await expect(canvas.getByText('Step 1 of 6')).toBeVisible();
    await userEvent.type(canvas.getByRole('textbox', { name: 'What should we call you?' }), 'Maya');
    await expect(within(canvas.getByRole('region', { name: 'Workspace preview' })).getByText('Maya')).toBeVisible();
  }
};
export const ScreensPattern17 = {
  name: 'Create a publication',
  ...pattern(17, 'A vertical stepper you can click back through, beside a hero and a screenshot rail that follows the step; it ends on a celebratory screen with next actions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Publication name' }), 'Field Notes');
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Your site' }));
    await expect(canvas.getByRole('textbox', { name: 'Publication name' })).toHaveValue('Field Notes');
  }
};
export const ScreensPattern18 = {
  name: 'Tour in a dialog',
  ...pattern(18, 'A four-step tour inside a dialog with dot progress you can step back through.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Take the tour' }));
    const dialog = await body.findByRole('dialog', { name: 'Welcome tour' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Next' }));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Back to Focus' }));
    await waitFor(() => expect(within(dialog).getByRole('radiogroup', { name: 'What do you want to do first?' })).toBeVisible());
    await userEvent.keyboard('{Escape}');
  }
};
export const ScreensPattern19 = {
  name: 'Connect a coding agent',
  ...pattern(19, 'Eight steps on a progress bar, light or dark: an agent picker, a one-time API key and a CLI checklist of copyable commands before a connection check.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Dark card' }));
    await expect(canvas.getByRole('switch', { name: 'Dark card' })).not.toBeChecked();
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText('Add your name.')).toBeVisible();
  }
};
