import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'flow',
  import.meta.glob('../../../../.storybook/fixtures/patterns/flow/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/flow/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Planning/Flow', id: 'core-flow', tags: ['autodocs'], ...catalogueMeta('flow') };

export const FlowPattern1 = {
  name: 'Automation workflow editor',
  ...pattern(1, 'Lead routing with hand-placed steps that show owner, duration and last run, Yes and No branches, a toolbar and right-click menu to edit, duplicate or delete, an inspector that floats over wide canvases and becomes a sheet on narrow ones, undo and redo, and a warning when a step cannot be reached.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Enrich company')).toBeVisible());
    await expect(canvas.getByText('1 step is never reached')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Undo' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Add step' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Undo' })).toBeEnabled());
    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }));
    await waitFor(() => expect(canvas.queryByText('New step')).not.toBeInTheDocument());
  }
};

export const FlowPattern2 = {
  name: 'Agent tree with test run',
  ...pattern(2, 'A collections agent laid out as a tidy tree: cards show the app each step calls, named branches label the router, dashed attachments feed the drafting step on their own port, every connector offers an add-step button, and a test run walks the live tree with tokens, cost and latency per step. Tidy, snap to grid, reset and copy as JSON sit on the canvas; the inspector renames steps and validates branch names.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Draft reminder')).toBeVisible());
    await expect(canvas.getByText('Over $1,000')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Test run' }));
    await waitFor(() => expect(canvas.getByText('840 ms', { exact: false })).toBeInTheDocument(), { timeout: 6000 });
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Test run' })).toBeEnabled(), { timeout: 6000 });
    // The standard branch ran, so the escalation step was skipped.
    await expect(canvas.getByRole('region', { name: 'Collections agent' })).toHaveTextContent('Escalate to the team (Skipped)');
  }
};

export const FlowPattern3 = {
  name: 'Pipeline run monitor',
  ...pattern(3, 'A nightly data pipeline drawn by hand left to right. Tasks start only when everything upstream passed, a flaky extract can be retried or skipped, failures block what follows, and a finance sign-off gate (which cannot be deleted) waits for a person before releasing the load and its dependents. Replay walks the run in dependency order; the run log tab lists the same tasks; removing a task offers eight seconds to undo.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Extract events')).toBeVisible());
    const region = canvas.getByRole('region', { name: 'Nightly revenue pipeline' });
    await expect(region).toHaveTextContent('Extract events (Failed)');
    await userEvent.click(canvas.getByRole('button', { name: 'Retry failed' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Approve' })).toBeInTheDocument(), { timeout: 12000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Approve' }));
    await waitFor(() => expect(region).toHaveTextContent('Sync CRM accounts (Passed)'), { timeout: 12000 });
  }
};

export const FlowPattern4 = {
  name: 'Growth impact map',
  ...pattern(4, 'A driver tree laid out left to right: initiative cards with progress, status, owner and duration feed metric cards with their role, value per period, goal and change, which feed the north star. Links carry correlation scores coloured by strength. The inspector relinks a selected link and rejects duplicates and loops, and any metric can be promoted to north star, demoting the previous one, with undo.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(canvas.getByText('Guided onboarding')).toBeVisible());
    await expect(canvas.getByText('4,820')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'Month' }));
    await expect(canvas.getByText('19.1k')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for Activation rate' }));
    await userEvent.click(await page.findByRole('menuitem', { name: 'Make north star' }));
    await expect(await page.findByText('Activation rate is the north star')).toBeInTheDocument();
    await userEvent.click(page.getByRole('button', { name: 'Undo' }));
    await waitFor(() => expect(canvas.getAllByText('North star')).toHaveLength(1));
  }
};

