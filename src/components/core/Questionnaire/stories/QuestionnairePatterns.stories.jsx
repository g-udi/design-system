import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../docs/components/PatternInteractions.js';

const pattern = patternStories(
  'questionnaire', import.meta.url,
  import.meta.glob('./fixtures/questionnaire/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/questionnaire/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Advanced Inputs/Questionnaire', id: 'core-questionnaire', tags: ['autodocs'], ...catalogueMeta('questionnaire') };

export const GuidedSetup = {
  name: 'Guided setup',
  ...pattern('guided-setup', 'Three required questions in a card, with a segmented progress bar built from the progress render state, navigation and a summary on submit.'),
  play: catalogueInteractions['questionnaire-guided-setup']
};
export const AnswerTypes = {
  name: 'Answer types',
  ...pattern('answer-types', 'Several answers with a live count, a written answer beside fixed choices, and an optional question that can be skipped, all carried into the summary.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: /^Morning picks/ }));
    await userEvent.click(canvas.getByRole('checkbox', { name: /^Reply alerts/ }));
    await expect(canvas.getByText('2 of 4 selected')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Next', exact: true }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Somewhere else' }), 'A local reading group');
    await userEvent.click(canvas.getByRole('button', { name: 'Next', exact: true }));
    await userEvent.click(canvas.getByRole('button', { name: 'Skip for now' }));
    await expect(await canvas.findByText('Emails switched on')).toBeVisible();
    await expect(canvas.getByText('A local reading group')).toBeVisible();
    await expect(canvas.getByText('Skipped', { exact: true })).toBeVisible();
    await expect(canvas.getByText('2 of 4 workflows start sending tomorrow.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Change answers' }));
    await expect(canvas.getByText('0 of 4 selected')).toBeVisible();
    await expect(canvas.getByRole('checkbox', { name: /^Morning picks/ })).not.toBeChecked();
  }
};
export const ConditionalBranch = {
  name: 'Conditional branch',
  ...pattern('conditional-branch', 'A question joins the flow only after an earlier answer, with avatars, reset and a summary.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'A team writing for one publication' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next', exact: true }));
    await expect(canvas.getByText('Who should own the workspace?')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: /Yewande Achterberg/ }));
    await userEvent.click(canvas.getByRole('button', { name: 'Previous', exact: true }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Just me' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next', exact: true }));
    await expect(canvas.getByText('What should we bring over first?')).toBeVisible();
    await expect(canvas.queryByRole('radio', { name: /Yewande Achterberg/ })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'Posts and their drafts' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next', exact: true }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Right away' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Create the publication' }));
    await expect(await canvas.findByText('Publication created')).toBeVisible();
    await expect(canvas.getByText('Not applicable')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Create another' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Start over' }));
    await expect(canvas.getByRole('radio', { name: 'Just me' })).not.toBeChecked();
  }
};
export const CrossValidation = { name: 'Cross-question validation', ...pattern('cross-validation', 'A rule checked on submit returns the flow to the question that broke it.'), play: async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('radio', {name: 'Your own servers'}));
  await userEvent.click(canvas.getByRole('button', {name: 'Next', exact:true}));
  await userEvent.click(canvas.getByRole('radio', {name: 'Growth', exact:true}));
  await userEvent.click(canvas.getByRole('button', {name: 'Next', exact:true}));
  await userEvent.click(canvas.getByRole('radio', {name: 'I will sign'}));
  await userEvent.click(canvas.getByRole('button', {name: 'Send the contract'}));
  await expect(await canvas.findByText(/Hosting on your own servers needs the Enterprise plan/)).toBeVisible();
  await userEvent.click(canvas.getByRole('radio', {name: 'Enterprise', exact:true}));
  await userEvent.click(canvas.getByRole('button', {name: 'Next', exact:true}));
  await userEvent.click(canvas.getByRole('button', {name: 'Send the contract'}));
  await expect(await canvas.findByText('Contract sent for signature')).toBeVisible();
  await expect(canvas.getByText('Enterprise', {exact:true})).toBeVisible();
  await userEvent.click(canvas.getByRole('button', {name: 'Start over'}));
} };
