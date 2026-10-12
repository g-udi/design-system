import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'tabs', import.meta.url,
  import.meta.glob('./fixtures/tabs/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/tabs/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tabs', id: 'core-tabs', tags: ['autodocs'], ...catalogueMeta('tabs') };

export const SettingsForm = {
  name: 'Settings form tabs',
  ...pattern('settings-form', 'Form panels behind tabs. Switches toggle the outline variant, vertical orientation, trigger icons and a full-width list.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Outline' }));
    await expect(canvas.getByRole('tablist')).toHaveAttribute('data-variant', 'outline');
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Account saved.');
    await userEvent.click(canvas.getByRole('tab', { name: 'Password' }));
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Change your password here.');
    await userEvent.click(canvas.getByRole('switch', { name: 'Vertical' }));
    await expect(canvas.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    await userEvent.click(canvas.getByRole('tab', { name: 'Account' }));
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(canvas.getByRole('switch', { name: 'Vertical' }));
  }
};
export const BadgeCounts = {
  name: 'Badge counts', ...pattern('badge-counts', 'Line tabs with a count badge per mailbox; the tone marks what needs attention.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const states = [
      ['Drafts 3', '3 drafts saved but not scheduled.'],
      ['Sent', 'Issues you have already sent are listed here.'],
      ['Spam 24', '24 comments held for moderation.'],
      ['Inbox 12', '12 reader replies waiting for you.']
    ];
    canvas.getByRole('tab', { name: 'Inbox 12' }).focus();
    for (const [name, content] of states) {
      await userEvent.keyboard('{ArrowRight}');
      await expect(canvas.getByRole('tab', { name })).toHaveAttribute('aria-selected', 'true');
      await expect(canvas.getByRole('tabpanel')).toHaveTextContent(content);
    }
  }
};
export const PeriodSwitch = {
  name: 'Period switch', ...pattern('period-switch', 'Controlled tabs with equal-width triggers that change the figure in one card.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('32,156');
    for (const [period, figure] of [['Daily', '1,284'], ['Weekly', '8,942'], ['Yearly', '384,721'], ['Monthly', '32,156']]) {
      await userEvent.click(canvas.getByRole('tab', { name: period }));
      await expect(canvas.getByRole('tab', { name: period })).toHaveAttribute('aria-selected', 'true');
      await expect(canvas.getByRole('tabpanel')).toHaveTextContent(figure);
    }
  }
};
