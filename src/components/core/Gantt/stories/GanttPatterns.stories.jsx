import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'gantt', import.meta.url,
  import.meta.glob('./fixtures/gantt/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/gantt/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

const page = (canvasElement) => within(canvasElement.ownerDocument.body);
/** Picks an option from a labelled Select inside a dialog scope. */
const choose = async (canvasElement, scope, label, option) => {
  await userEvent.click(scope.getByRole('combobox', { name: label }));
  await userEvent.click(await page(canvasElement).findByRole('option', { name: option }));
};

export default { title: 'Core/Planning/Gantt', id: 'core-gantt', tags: ['autodocs'], ...catalogueMeta('gantt') };

export const SettingsReordering = {
  name: 'Settings menu, row reordering and scheduling',
  ...pattern('settings-reordering', 'A settings menu toggles every display and interaction flag, row handles drag to reorder the tree, and empty rows schedule by drag or click.'),
  play: async (context) => {
    const { canvasElement } = context;
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Settings' }));
    const body = page(canvasElement);
    await expect(await body.findByRole('switch', { name: 'Row checkboxes' })).toBeChecked();
    await userEvent.click(body.getByRole('tab', { name: 'Region' }));
    await expect(body.getByRole('combobox', { name: 'Language' })).toBeVisible();
    await expect(body.getByRole('combobox', { name: 'Time zone' })).toBeVisible();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--settings` });
    }
    await userEvent.keyboard('{Escape}');
  }
};
export const LiveValidation = {
  name: 'Project planner with live validation',
  ...pattern('live-validation', 'A resizable task tree with owner and status columns beside the timeline. Drag or resize a bar and finish-to-start dependencies are checked live; phases roll up progress, and a click opens the edit dialog.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: /^Search\b/ }));
    const dialog = within(await page(canvasElement).findByRole('dialog', { name: 'Edit task' }));
    const title = dialog.getByRole('textbox', { name: 'Title' });
    await userEvent.clear(title);
    await userEvent.type(title, 'Full-text search');
    await choose(canvasElement, dialog, 'Status', 'In progress');
    await userEvent.click(dialog.getByRole('button', { name: 'Save task' }));
    await waitFor(() => expect(page(canvasElement).queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('status')).toHaveTextContent('Saved Full-text search.');
    await expect(await canvas.findByRole('button', { name: /^Full-text search\b/ })).toBeInTheDocument();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { page: viewport } = await import('vitest/browser');
      const original = { width: window.innerWidth, height: window.innerHeight };
      try {
        for (const scale of [0.75, 1, 1.25]) {
          canvasElement.style.setProperty('--ds-space-scale', String(scale));
          for (const width of [320, 390, 639, 640, 1440]) {
            await viewport.viewport(width, original.height);
            await waitFor(() => {
              const period = canvasElement.querySelector('[data-slot="gantt-title"]');
              expect(period.scrollWidth).toBeLessThanOrEqual(period.clientWidth + 1);
            });
          }
        }
      } finally {
        canvasElement.style.removeProperty('--ds-space-scale');
        await viewport.viewport(original.width, original.height);
      }
    }
  }
};
export const TaskTable = { name: 'Task table with progress', ...pattern('task-table', 'Tree columns for owner and status beside the bars, with progress on each task.') };
export const QuarterRoadmap = { name: 'Quarter roadmap with rollups', ...pattern('quarter-roadmap', 'A quarter-scale roadmap where each team row rolls up its projects.') };
export const ResourcePlanner = {
  name: 'Capacity-aware resource planner',
  ...pattern('resource-planner', 'People and rooms with weekly utilisation and booking cards. Drags that would overbook a day are refused; create, edit, copy and delete bookings from the toolbar, the dialog or the right-click menu.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'New booking' }));
    const dialog = within(await page(canvasElement).findByRole('dialog', { name: 'New booking' }));
    await choose(canvasElement, dialog, 'Who or where', 'Kerem Haddadin');
    await waitFor(() => expect(dialog.getByText(/Kerem Haddadin already has 8h/)).toBeVisible());
    await expect(dialog.getByRole('button', { name: 'Book' })).toBeDisabled();
    await choose(canvasElement, dialog, 'Who or where', 'Sara Lind');
    await expect(dialog.getByRole('button', { name: 'Book' })).toBeEnabled();
    await userEvent.click(dialog.getByRole('button', { name: 'Book' }));
    await waitFor(() => expect(page(canvasElement).queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('status')).toHaveTextContent('Booked Sara Lind on Reader app.');
  }
};
export const DayDispatch = {
  name: 'Day dispatch',
  ...pattern('day-dispatch', 'Technicians on an hour grid with timed jobs, a skills guardrail on reassignment, shift load per row and a job sheet for status and close-out.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: /^Water heater install\b/ }));
    const sheet = within(await page(canvasElement).findByRole('dialog', { name: 'Water heater install' }));
    // Ivy is mid-job at that time, so the sheet refuses the reassignment.
    await choose(canvasElement, sheet, 'Technician', 'Ivy Shah');
    await waitFor(() => expect(sheet.getByText(/Ivy Shah is on Socket rewiring/)).toBeVisible());
    await expect(sheet.getByRole('button', { name: 'Save job' })).toBeDisabled();
    await choose(canvasElement, sheet, 'Technician', 'Ana Ruiz');
    await choose(canvasElement, sheet, 'Status', 'On site');
    await userEvent.click(sheet.getByRole('checkbox', { name: 'Parts logged' }));
    await userEvent.click(sheet.getByRole('button', { name: 'Save job' }));
    await waitFor(() => expect(page(canvasElement).queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('status')).toHaveTextContent('Water heater install saved: on site with Ana Ruiz.');
    await userEvent.click(await canvas.findByRole('button', { name: /^Water heater install\b/ }));
    const reopened = within(await page(canvasElement).findByRole('dialog', { name: 'Water heater install' }));
    await expect(reopened.getByRole('checkbox', { name: 'Parts logged' })).toBeChecked();
    await userEvent.keyboard('{Escape}');
  }
};
export const AgentPlaybook = {
  name: 'Agent playbook',
  ...pattern('agent-playbook', 'An agent run as staged steps with enforced dependencies, a retry lane beside the failed attempt and a switch that highlights the critical path and totals its duration.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch', { name: 'Critical path' });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(canvas.getByText(/^Critical path · /).parentElement).toHaveTextContent('Post to thread');
    await userEvent.click(toggle);
  }
};
export const BaselinesDependencies = { name: 'Baseline, dependencies and milestones', ...pattern('baselines-dependencies', 'Planned windows ghost behind actual bars, finish-to-start arrows link each task to its predecessors, and a zero-length milestone renders as a diamond.') };
