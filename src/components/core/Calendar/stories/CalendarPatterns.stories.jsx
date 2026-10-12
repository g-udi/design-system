import { addMonths, format } from 'date-fns';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'calendar', import.meta.url,
  import.meta.glob('./fixtures/calendar/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/calendar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

const auditState = async (context, state) => {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  await auditStoryLayout({ ...context, id: `${context.id}--${state}` });
};

const auditPickers = async (context) => {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const body = within(context.canvasElement.ownerDocument.body);
  const triggers = [...context.canvasElement.querySelectorAll('button[aria-haspopup="dialog"]')];
  for (const [index, trigger] of triggers.entries()) {
    await userEvent.click(trigger);
    const popup = await body.findByRole('dialog');
    await auditState(context, `open-${index + 1}`);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(popup).not.toBeInTheDocument());
  }
};

export default { title: 'Core/Advanced Inputs/Calendar', id: 'core-calendar', tags: ['autodocs'], ...catalogueMeta('calendar') };

export const SelectionOptions = {
  name: 'Selection and display options',
  ...pattern('selection-options', 'One calendar with every display option: single, multiple or range selection, locale, two months, week numbers, outside days, rounded days, and weekends disabled and excluded from ranges.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const days = () => [...canvasElement.querySelectorAll('button[data-day]')].filter((day) => !day.closest('[data-outside="true"]'));
    await userEvent.click(canvas.getByRole('radio', { name: 'Single', exact: true }));
    const single = days().find((day) => day.getAttribute('data-selected-single') !== 'true');
    const singleDate = single.getAttribute('data-day');
    await userEvent.click(single);
    await expect(single).toHaveAttribute('data-selected-single', 'true');
    await userEvent.click(canvas.getByRole('radio', { name: 'Multiple', exact: true }));
    const multiple = days().find((day) => day.closest('td').getAttribute('aria-selected') !== 'true');
    await userEvent.click(multiple);
    await expect(multiple.closest('td')).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(multiple);
    await expect(multiple.closest('td')).not.toHaveAttribute('aria-selected', 'true');
    await userEvent.click(canvas.getByRole('radio', { name: 'Single', exact: true }));
    await expect(canvasElement.querySelector(`[data-day="${singleDate}"]`)).toHaveAttribute('data-selected-single', 'true');
    await userEvent.click(canvas.getByRole('radio', { name: 'Range', exact: true }));
    const rangeDays = days();
    await userEvent.click(rangeDays[1]);
    await userEvent.click(rangeDays[4]);
    await expect(canvasElement.querySelector('[data-range-start="true"]')).toBeInTheDocument();
    await expect(canvasElement.querySelector('[data-range-end="true"]')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('switch', { name: 'Two months' }));
    await expect(canvas.getAllByRole('grid')).toHaveLength(2);
    await userEvent.click(canvas.getByRole('switch', { name: 'Week numbers' }));
    await expect(canvasElement.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('switch', { name: 'Disable weekends' }));
    const weekend = days().find((day) => /Saturday|Sunday/.test(day.getAttribute('aria-label')));
    await expect(weekend).toBeDisabled();
    await auditState(context, 'range-options');
    await userEvent.click(canvas.getByRole('radio', { name: 'DE', exact: true }));
    await expect(days().some((day) => /Montag|Dienstag|Mittwoch/.test(day.getAttribute('aria-label')))).toBe(true);
    await userEvent.click(canvas.getByRole('radio', { name: 'EN', exact: true }));
  }
};
export const PopoverPickers = { name: 'Date pickers in popovers', ...pattern('popover-pickers', 'Form fields that open a calendar in a popover: a single date, a two-month stay range, and a date with start and end times.'), play: auditPickers };
export const Presets = { name: 'Presets', ...pattern('presets', 'A preset rail beside the calendar: look-back ranges that cannot end in the future, or look-ahead due dates that cannot be in the past.'), play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('radio', { name: 'Due date' }));
  await userEvent.click(canvas.getByRole('button', { name: 'Next month', exact: true }));
  const next = addMonths(new Date(), 1);
  await expect(canvas.getByRole('grid')).toHaveAccessibleName(format(next, 'MMMM yyyy'));
  await expect(canvasElement.querySelector('[data-selected-single=true]')).toHaveTextContent(String(next.getDate()));
} };
export const CaptionNavigation = {
  name: 'Caption and navigation',
  ...pattern('caption-navigation', 'Caption layouts: centred label, arrows at the end, month and year dropdowns, or a year dropdown between the arrows. The controlled month jumps back with This month or Today.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const body = within(context.canvasElement.ownerDocument.body);
    const today = new Date();
    const month = canvas.getByRole('combobox', { name: 'Month', exact: true });
    await userEvent.click(month);
    await userEvent.click(await body.findByRole('option', { name: 'Jan', exact: true }));
    await expect(month).toHaveTextContent('Jan');
    await expect(month).toHaveFocus();
    const year = canvas.getByRole('combobox', { name: 'Year', exact: true });
    await userEvent.click(year);
    await userEvent.click(await body.findByRole('option', { name: String(today.getFullYear() - 1), exact: true }));
    await expect(year).toHaveTextContent(String(today.getFullYear() - 1));
    await userEvent.click(canvas.getByRole('button', { name: 'This month', exact: true }));
    await expect(month).toHaveTextContent(format(today, 'MMM'));
    await expect(year).toHaveTextContent(String(today.getFullYear()));
    await userEvent.click(canvas.getByRole('button', { name: 'Today', exact: true }));
    await expect(context.canvasElement.querySelector('[data-selected-single="true"]')).toHaveAttribute('data-day', today.toLocaleDateString());
    for (const layout of ['Centered', 'Arrows at end', 'Year']) {
      await userEvent.click(canvas.getByRole('radio', { name: layout, exact: true }));
      await userEvent.click(canvas.getByRole('button', { name: /Go to the Next Month/i }));
      await expect(canvas.getByRole('grid')).toHaveAccessibleName(new RegExp(format(addMonths(today, 1), 'MMMM')));
      await userEvent.click(canvas.getByRole('button', { name: 'This month', exact: true }));
      await expect(canvas.getByRole('grid')).toHaveAccessibleName(new RegExp(format(today, 'MMMM')));
    }
    await auditState(context, 'year-navigation');
  }
};
export const YearMonthGrid = { name: 'Year and month grid', ...pattern('year-month-grid', 'The caption opens a year grid, then a month grid, for jumping far from the current month.'), play: async (context) => {
  const canvas = within(context.canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Show options' }));
  await expect(canvas.getByRole('button', { name: 'Show options' })).toHaveAttribute('aria-expanded', 'true');
  await expect(context.canvasElement.querySelector('table')).toHaveAttribute('inert');
  await expect(canvas.getByRole('button', { name: String(new Date().getFullYear()), exact: true })).toHaveFocus();
  await auditState(context, 'years');
  await userEvent.click(canvas.getByRole('button', { name: String(new Date().getFullYear()), exact: true }));
  await auditState(context, 'months');
  await userEvent.click(canvas.getByRole('button', { name: 'Jan', exact: true }));
  await expect(canvas.getByRole('button', { name: 'Show options' })).toHaveFocus();
  await expect(context.canvasElement.querySelector('table')).not.toHaveAttribute('inert');
} };
export const AppointmentBooking = { name: 'Appointment booking', ...pattern('appointment-booking', 'Past and fully booked days are disabled; taken slots are disabled and the chosen slot resets when the day changes. Confirm prepares a local selection without reserving an appointment.'), play: async (context) => {
  const canvas = within(context.canvasElement);
  const confirm = canvas.getByRole('button', { name: 'Confirm' });
  await expect(confirm).toBeDisabled();
  await expect(canvas.getByRole('button', { name: '09:00', exact: true })).toBeDisabled();
  await userEvent.click(canvas.getByRole('button', { name: '10:00', exact: true }));
  await expect(canvas.getByRole('button', { name: '10:00', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await userEvent.click(confirm);
  await expect(canvas.getByRole('status', { name: 'Appointment selection' })).toHaveTextContent('This demo has not reserved a slot.');
  await auditState(context, 'confirmed');
  await userEvent.click(canvas.getByRole('button', { name: '10:30', exact: true }));
  await expect(canvas.queryByRole('status', { name: 'Appointment selection' })).not.toBeInTheDocument();
  await expect(confirm).toBeEnabled();
} };
export const DailyPricing = {
  name: 'Daily pricing',
  ...pattern('daily-pricing', 'A custom day button shows a price under each date. Taller cells keep both lines contained even when the calendar narrows.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const day = canvas.getAllByRole('button').find((button) => button.querySelector('span')?.textContent.startsWith('$'));
    const date = day.getAttribute('data-day');
    await userEvent.click(day);
    // The custom DayButton render function changes when selection updates.
    await waitFor(() => expect(canvasElement.querySelector(`[data-day="${date}"]`)).toHaveAttribute('data-selected-single', 'true'));
    const verifyContainment = () => {
      for (const price of canvasElement.querySelectorAll('[data-day] > span')) {
        const button = price.parentElement.getBoundingClientRect();
        const cell = price.closest('td').getBoundingClientRect();
        expect(button.top).toBeGreaterThanOrEqual(cell.top);
        expect(button.bottom).toBeLessThanOrEqual(cell.bottom + 1);
        const label = price.getBoundingClientRect();
        expect(label.top).toBeGreaterThanOrEqual(cell.top);
        expect(label.bottom).toBeLessThanOrEqual(cell.bottom);
      }
    };
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { page } = await import('vitest/browser');
      const original = { width: window.innerWidth, height: window.innerHeight };
      try {
        for (const width of [320, 390, 1440]) {
          await page.viewport(width, original.height);
          verifyContainment();
        }
      } finally {
        await page.viewport(original.width, original.height);
      }
    } else {
      verifyContainment();
    }
  }
};
export const EventList = { name: 'Event list', ...pattern('event-list', 'A calendar in a card with the chosen day\'s events listed below it. Add event creates a local demo item for the selected day.'), play: async (context) => {
  const canvas = within(context.canvasElement);
  await expect(canvas.getByText('Product launch')).toBeVisible();
  await expect(canvas.queryByText('Weekly standup')).not.toBeInTheDocument();
  const emptyDay = canvas.getByRole('button', { name: /Sunday, January 25th, 2026/ });
  await userEvent.click(emptyDay);
  await expect(canvas.getByText('No events for this day')).toBeVisible();
  await expect(canvas.queryByText('Product launch')).not.toBeInTheDocument();
  await auditState(context, 'empty-day');
  await userEvent.click(canvas.getByRole('button', { name: 'Add event' }));
  await expect(canvas.getByText('Demo event 1')).toBeVisible();
  await expect(canvas.queryByText('No events for this day')).not.toBeInTheDocument();
} };
