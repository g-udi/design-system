import { actInteraction } from '../../../../../tests/support/actInteraction.js';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { checkFlowInspectorUpdates } from '../../../../../tests/components/core/Flow/checkFlowInspectorUpdates.jsx';

const pattern = patternStories(
  'flow', import.meta.url,
  import.meta.glob('./fixtures/flow/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/flow/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Planning/Flow', id: 'core-flow', tags: ['autodocs'], ...catalogueMeta('flow') };

export const AutomationEditor = {
  name: 'Automation workflow editor',
  ...pattern('automation-editor', 'Lead routing with hand-placed steps that show owner, duration and last run, Yes and No branches, a toolbar and right-click menu to edit, duplicate or delete, an inspector that floats over wide canvases and becomes a sheet on narrow ones, undo and redo, and a warning when a step cannot be reached.'),
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

export const AgentTree = {
  name: 'Agent tree with test run',
  ...pattern('agent-tree', 'A collections agent laid out as a tidy tree: cards show the app each step calls, named branches label the router, dashed attachments feed the drafting step on their own port, every connector offers an add-step button, and a test run walks the live tree with tokens, cost and latency per step. Tidy, snap to grid, reset and copy as JSON sit on the canvas; the inspector renames steps and validates branch names.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Draft reminder')).toBeVisible());
    await expect(canvas.getByText('Over $1,000')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Test run' }));
    await waitFor(() => expect(canvas.getByText('840 ms', { exact: false })).toBeInTheDocument(), { timeout: 6000 });
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Test run' })).toBeEnabled(), { timeout: 6000 });
    // The standard branch ran, so the escalation step was skipped.
    await expect(canvas.getByRole('region', { name: 'Collections agent' })).toHaveTextContent('Escalate to the team (Skipped)');
    await userEvent.click(canvas.getByRole('button', { name: 'Test run' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Reset layout' }));
    await expect(canvas.getByRole('button', { name: 'Test run' })).toBeEnabled();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await expect(canvas.getByRole('region', { name: 'Collections agent' })).not.toHaveTextContent('(Running)');
  }
};

export const PipelineMonitor = {
  name: 'Pipeline run monitor',
  ...pattern('pipeline-monitor', 'A nightly data pipeline drawn by hand left to right. Tasks start only when everything upstream passed, a flaky extract can be retried or skipped, failures block what follows, and a finance sign-off gate (which cannot be deleted) waits for a person before releasing the load and its dependents. Replay walks the run in dependency order; the run log tab lists the same tasks; removing a task offers eight seconds to undo.'),
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

export const ImpactMap = {
  name: 'Growth impact map',
  ...pattern('impact-map', 'A driver tree laid out left to right: initiative cards with progress, status, owner and duration feed metric cards with their role, value per period, goal and change, which feed the north star. Links carry correlation scores coloured by strength. The inspector relinks a selected link and rejects duplicates and loops, and any metric can be promoted to north star, demoting the previous one, with undo.'),
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

export const PaymentsInspector = {
  name: 'Payments pipeline with an inspector',
  ...pattern('payments-inspector', 'A nightly payments-to-MRR pipeline drawn as service tiles with run badges: extracts from Stripe and PayPal, a Redis dedupe, a failed ledger reconciliation and a publish step waiting for approval, with dotted satellites for the connections, test and model each step uses. Connections are dotted and flow toward their target; switch them to solid or dashed, or stop the motion. Click a node to open the inspector with its settings and wiring; Approve publishes, the toolbar switches between select and pan, zooms, fits the selection, re-runs the layout and jumps to the failing step.'),
  play: async ({ canvasElement, id }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(canvas.getByText('dedupe_payments')).toBeVisible());
    await expect(canvas.getByText('1.2M rows')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '1 issue' })).toBeInTheDocument();
    // The issues button frames the failing step and opens its inspector.
    await userEvent.click(canvas.getByRole('button', { name: '1 issue' }));
    await waitFor(() => expect(page.getByRole('dialog', { name: 'reconcile_ledger' })).toBeVisible());
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ canvasElement, id: `${id}--inspector-open` });
    }
    const inspector = await page.findByRole('dialog', { name: 'reconcile_ledger' });
    await waitFor(() => expect(inspector).toBeVisible());
    await expect(within(inspector).getByRole('button', { name: 'Save task' })).toBeDisabled();
    await userEvent.type(within(inspector).getByRole('textbox', { name: 'tolerance' }), '5');
    await expect(within(inspector).getByRole('button', { name: 'Save task' })).toBeEnabled();
    await actInteraction(() => userEvent.click(within(inspector).getByRole('tab', { name: 'Wiring' })));
    await expect(within(inspector).getByText('ledger_v3')).toBeInTheDocument();
    await userEvent.click(within(inspector).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(page.queryByRole('dialog', { name: 'reconcile_ledger' })).not.toBeInTheDocument());
    // Enter on a focused node opens its inspector too.
    const dedupe = canvasElement.querySelector('.react-flow__node[data-id="dedupe_payments"]');
    dedupe.focus();
    await userEvent.keyboard('{Enter}');
    const keyboardInspector = await page.findByRole('dialog', { name: 'dedupe_payments' });
    await userEvent.click(within(keyboardInspector).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(page.queryByRole('dialog', { name: 'dedupe_payments' })).not.toBeInTheDocument());
    // Approving publishes MRR and sends the report.
    // On narrow canvases the inspector was a sheet; the canvas is reachable again once it has closed.
    await userEvent.click(await canvas.findByRole('button', { name: 'Approve publish_mrr' }));
    await waitFor(() => expect(canvas.getByText('Sent 09:15')).toBeInTheDocument(), { timeout: 5000 });
    await checkFlowInspectorUpdates(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Solid' }));
    await expect(canvasElement.querySelector('.ds-flow-edge[data-variant="solid"]')).not.toBeNull();
    await userEvent.click(canvas.getByRole('radio', { name: 'Dotted' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Auto layout' }));
    await waitFor(() => expect(canvasElement.querySelector('.ds-flow[data-layout-animating]')).toBeNull());
  }
};
