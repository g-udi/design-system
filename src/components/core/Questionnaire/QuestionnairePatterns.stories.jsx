import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'questionnaire',
  import.meta.glob('../../../../.storybook/fixtures/patterns/questionnaire/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/questionnaire/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Inputs/Questionnaire', id: 'core-questionnaire', tags: ['autodocs'], ...catalogueMeta('questionnaire') };

export const QuestionnairePattern1 = {
  name: 'Guided setup',
  ...pattern(1, 'Three required questions in a card, with a segmented progress bar built from the progress render state, navigation and a summary on submit.'),
  play: catalogueInteractions['questionnaire-1']
};
export const QuestionnairePattern2 = { name: 'Answer types', ...pattern(2, 'Several answers with a live count, a written answer beside fixed choices, and an optional question that can be skipped, all carried into the summary.') };
export const QuestionnairePattern7 = { name: 'Conditional branch', ...pattern(7, 'A question joins the flow only after an earlier answer, with avatars, reset and a summary.') };
export const QuestionnairePattern6 = { name: 'Cross-question validation', ...pattern(6, 'A rule checked on submit returns the flow to the question that broke it.') };
