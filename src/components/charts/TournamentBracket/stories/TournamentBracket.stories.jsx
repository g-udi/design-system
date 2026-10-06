import { expect, fn, userEvent, within } from 'storybook/test';
import { TournamentBracket } from '../index.js';
import { rounds } from './fixtures/rounds.js';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Charts/TournamentBracket');
const imports = `import { TournamentBracket } from '@gaudi/design-system/charts/TournamentBracket';\n\nconst rounds = ${JSON.stringify(rounds, null, 2)};`;

export default {
  title: 'Charts/TournamentBracket', id: 'charts-tournamentbracket', component: TournamentBracket, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', defaultRound: 'number', disabled: 'boolean' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { label: 'Autumn Cup knockout stage', defaultRound: 0, disabled: false, onRoundChange: fn(), onMatchClick: fn() },
  parameters: { docs: { source: playgroundSource('TournamentBracket', { imports, attributes: ['rounds={rounds}'] }) } },
  render: (args) => <TournamentBracket key={args.defaultRound} rounds={rounds} {...args} />,
  play: async ({ args, canvasElement }) => {
    if (args.defaultRound !== 0) return;
    const canvas = within(canvasElement);
    const previous = canvas.getByRole('button', { name: 'Previous round' });
    const next = canvas.getByRole('button', { name: 'Next round' });
    await expect(previous).toBeDisabled();
    if (args.disabled) { await expect(next).toBeDisabled(); return; }
    await userEvent.click(within(canvas.getByRole('group', { name: 'Quarter-finals: North London versus Bristol City' })).getByRole('button'));
    await expect(args.onMatchClick).toHaveBeenCalledWith(rounds[0].matches[0]);
    next.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onRoundChange).toHaveBeenLastCalledWith(1);
    await expect(canvas.queryByRole('group', { name: 'Quarter-finals: North London versus Bristol City' })).not.toBeInTheDocument();
    await userEvent.click(previous);
    await expect(args.onRoundChange).toHaveBeenLastCalledWith(0);
    await expect(canvas.getByRole('group', { name: 'Quarter-finals: North London versus Bristol City' })).toBeVisible();
  }
};

export const FinalResult = {
  name: 'Final with a winner',
  args: { rounds: [{ id: 'final', name: 'Final', matches: [{ id: 'f1', status: 'completed', label: 'Oct 25 · Full time', home: { name: 'North London', score: 0 }, away: { name: 'East London', score: 1 }, winner: 'away' }] }] },
  parameters: { docs: { source: playgroundSource('TournamentBracket', { imports: "import { TournamentBracket } from '@gaudi/design-system/charts/TournamentBracket';" }) } },
  render: (args) => <TournamentBracket {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Winner')).toBeInTheDocument();
    await expect(canvas.getByText('0', { exact: true })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Next round' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Previous round' })).toBeDisabled();
  }
};

export const Empty = {
  parameters: { docs: { source: { code: "import { TournamentBracket } from '@gaudi/design-system/charts/TournamentBracket';\n\n<TournamentBracket rounds={[]} />" } } },
  render: () => <TournamentBracket rounds={[]} />,
  play: async ({ canvasElement }) => { await expect(within(canvasElement).getByText('No matches to display')).toBeVisible(); }
};
