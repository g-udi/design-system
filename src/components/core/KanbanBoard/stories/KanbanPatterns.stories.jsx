import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'kanban', import.meta.url,
  import.meta.glob('./fixtures/kanban/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/kanban/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

const page = (canvasElement) => within(canvasElement.ownerDocument.body);

export default { title: 'Core/Planning/Kanban', id: 'core-kanban', tags: ['autodocs'], ...catalogueMeta('kanban') };

export const Options = {
  name: 'Board options',
  ...pattern('options', 'Drag cards and columns, with the column frame switched between plain, framed and stacked, and the drag overlay between a dashed placeholder and a live copy.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const reorder = canvas.getByRole('button', { name: 'Reorder Backlog' });
    reorder.focus();
    await waitFor(() => expect(getComputedStyle(reorder).opacity).toBe('1'));
    reorder.blur();
    const card = canvas.getByRole('button', { name: /Plan the autumn series/ });
    card.focus();
    await userEvent.keyboard(' ');
    // A valid numeric id of zero must lift a copy, just like a string id.
    await waitFor(() => expect(page(canvasElement).getAllByText('Plan the autumn series')).toHaveLength(2));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page(canvasElement).getAllByText('Plan the autumn series')).toHaveLength(1));
    await expect(card).toHaveFocus();
    card.blur();
  }
};
export const IssueTracking = {
  name: 'Issue tracking',
  ...pattern('issue-tracking', 'Six numbered status columns tinted by state, issue keys with priority, a status chip, owner, due date and a completion ring. In progress carries a work-in-progress limit; filter by priority without losing the hidden issues, share the board, or add a task.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Issue tracking board' })).toBeVisible();
    await expect(canvas.getByText('2 of 3 cards')).toBeInTheDocument();
    const clipboard = navigator.clipboard;
    const writeText = fn(async () => {});
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    try {
      await userEvent.click(canvas.getByRole('button', { name: 'Share', exact: true }));
      await waitFor(() => expect(writeText).toHaveBeenCalledWith('https://example.com/boards/issue-tracking'));
      await expect(canvas.getByText('Board link copied.')).toHaveAttribute('role', 'status');
    } finally {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard });
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }));
    await userEvent.click(await page(canvasElement).findByRole('menuitemcheckbox', { name: 'P2' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByText('Button text truncates when zoomed in')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Filters (2)' }));
    await userEvent.click(await page(canvasElement).findByRole('menuitemcheckbox', { name: 'P2' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByText('Button text truncates when zoomed in')).toBeVisible());
  }
};
export const CollapsibleColumns = {
  name: 'Workflow with collapsible columns',
  ...pattern('collapsible-columns', 'Parked and finished stages fold into rails that still accept dropped cards. Expand a rail or use the Columns menu, add a task to any stage, and read the same work as tasks (tag, status, owner, readiness ring) or as deals (value, next step, team).'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Expand Paused, 2 cards' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Collapse Paused' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Paused' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Expand Paused, 2 cards' })).toBeVisible());
    await userEvent.click(canvas.getByRole('radio', { name: 'Deals' }));
    await waitFor(() => expect(canvas.getByText('$12,800')).toBeVisible());
    await userEvent.click(canvas.getByRole('radio', { name: 'Tasks' }));
  }
};
export const AccessReview = {
  name: 'Pipeline and access review',
  ...pattern('access-review', 'One card layout for two pipelines: deals through sales stages and access requests through review. Each card has a mark, tag, two detail lines, an owner, a star score, activity counts and a due chip; stages reorder by their handle and the access board adds requests per stage.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('img', { name: 'Deal confidence: 4 of 5' }).length).toBeGreaterThan(0);
    await userEvent.click(canvas.getByRole('radio', { name: 'Access review' }));
    await waitFor(() => expect(canvas.getByText('IAM-1021')).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Add intake' }));
    await waitFor(() => expect(canvas.getByText('New request')).toBeVisible());
    await userEvent.click(canvas.getByRole('radio', { name: 'Sales' }));
  }
};
export const Roadmap = {
  name: 'Feature roadmap',
  ...pattern('roadmap', 'Six delivery stages weighted by demand: reach, delivery progress, votes and the weekly trend. Upvote a card, sort every stage by demand, or move a card by its grip; the card keeps its own buttons because the drag handle is separate.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const vote = canvas.getByRole('button', { name: 'Upvote Smart intake routing, 83 votes' });
    await userEvent.click(vote);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Upvote Smart intake routing, 84 votes' })).toHaveAttribute('aria-pressed', 'true'));
    await expect(canvas.getByRole('button', { name: 'Move Smart intake routing' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Upvote Smart intake routing, 84 votes' }));
  }
};
export const Persisted = {
  name: 'Persisted to a backend',
  ...pattern('persisted', 'A local persistence simulation using onValueCommit: moves disable while saving, and an explicit failure restores the previous board with feedback. No backend request is made.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Fail next save (local demo)' }));
    const card = canvas.getByRole('button', { name: /Plan the autumn series/ });
    const column = card.closest('[data-slot="kanban-column"]');
    const move = async () => {
      card.focus();
      await userEvent.keyboard(' ');
      await waitFor(() => expect(canvas.getByRole('button', { name: /Plan the autumn series/ })).toHaveAttribute('aria-pressed', 'true'));
      await userEvent.keyboard('{ArrowDown}');
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await userEvent.keyboard(' ');
    };
    await move();
    await waitFor(() => expect(canvas.getByText('Saving board…', { selector: 'p' })).toBeVisible());
    await waitFor(() => expect(canvas.getByRole('button', { name: /Plan the autumn series/ })).toHaveAttribute('aria-disabled', 'true'));
    await waitFor(() => expect(canvas.getByText('Could not save. Board restored. Try the move again.')).toBeVisible(), { timeout: 4000 });
    await expect(within(column).getAllByRole('button')[1]).toHaveTextContent('Plan the autumn series');
    await move();
    await waitFor(() => expect(canvas.getByText('Moved to "To Do"', { selector: 'p' })).toBeVisible(), { timeout: 4000 });
    await expect(within(column).getAllByRole('button')[1]).toHaveTextContent('Interview two illustrators');
    card.blur();
  }
};
export const SupportEscalations = {
  name: 'Support escalations',
  ...pattern('support-escalations', 'Tickets count down to their response target: the chip turns warning under three hours and danger under one, and pauses while a ticket waits on the customer. Priority badges, requester and owner, stage icons, an SLA risk lane, reorderable stages and Add ticket.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/under an hour from the response target/)).toHaveAttribute('role', 'status');
    await expect(canvas.getAllByText('Paused').length).toBeGreaterThan(0);
    await userEvent.click(canvas.getAllByRole('button', { name: 'Add ticket' })[0]);
    await waitFor(() => expect(canvas.getByText('New ticket')).toBeVisible());
  }
};
export const RenewalsRisk = {
  name: 'Renewals risk',
  ...pattern('renewals-risk', 'Accounts by risk and close window: risk tier, ARR and renewal tiles, account health and owner. Each stage totals its ARR, so a move updates both columns; Soonest first orders every stage by days left.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const soonest = canvas.getByRole('button', { name: 'Soonest first' });
    await userEvent.click(soonest);
    await waitFor(() => expect(soonest).toHaveAttribute('aria-pressed', 'true'));
    await expect(canvas.getAllByText('Total ARR').length).toBe(4);
  }
};
export const ReleaseReadiness = {
  name: 'Release readiness',
  ...pattern('release-readiness', 'Changes with risk, service and environment, release window, owner and a launch checklist. Tick checklist items from the card to move its progress; filter by environment and release window; drag a change by its grip.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'REL-8429 checklist, 1 of 4 done' }));
    const body = page(canvasElement);
    await userEvent.click(await body.findByRole('checkbox', { name: 'Feature flag' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'REL-8429 checklist, 2 of 4 done' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'All windows' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'May 2 – May 4' }));
    await waitFor(() => expect(canvas.queryByText('REL-8429')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'May 2 – May 4' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'All windows' }));
    await waitFor(() => expect(canvas.getByText('REL-8429')).toBeVisible());
  }
};
export const Recruiting = {
  name: 'Recruiting pipeline',
  ...pattern('recruiting', 'Candidates with match score, location and time zone, interview date, salary band and scorecard state. The panel stage holds three at a time and shows when it runs over; Best match first orders every stage by fit.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('2 of 3 cards')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('switch', { name: 'Best match first' }));
    await waitFor(() => expect(canvas.getByRole('switch', { name: 'Best match first' })).toBeChecked());
    await userEvent.click(canvas.getByRole('switch', { name: 'Best match first' }));
  }
};
