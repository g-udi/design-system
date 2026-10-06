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
export const AnswerTypes = { name: 'Answer types', ...pattern('answer-types', 'Several answers with a live count, a written answer beside fixed choices, and an optional question that can be skipped, all carried into the summary.') };
export const ConditionalBranch = { name: 'Conditional branch', ...pattern('conditional-branch', 'A question joins the flow only after an earlier answer, with avatars, reset and a summary.') };
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
