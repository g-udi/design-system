import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
const pattern = patternStories('plan', import.meta.url,
  import.meta.glob('./fixtures/plan/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/plan/*.jsx', { eager: true, query: '?raw', import: 'default' }));
export default { title: 'Chat/ChatPlanPanel', id: 'chat-chatplanpanel', tags: ['autodocs'], ...catalogueMeta('plan') };
export const AgentSteering = {
  name: 'Agent steering',
  ...pattern('agent-steering', 'Queue a correction for the next step or apply it immediately. Pause, edit or remove queued notes and see applied instructions stay attached to their plan step.'),
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Next step' }));
    await expect(canvas.getByText('Picked up at step start')).toBeVisible();
    await userEvent.type(canvas.getByLabelText('Steer the agent', { exact: true }), 'Keep the existing examples.');
    await userEvent.click(canvas.getByRole('button', { name: 'Apply now', exact: true }));
    await expect(canvas.getAllByRole('list', { name: 'Step notes' }).at(-1)).toHaveTextContent('Keep the existing examples.');
  }
};
