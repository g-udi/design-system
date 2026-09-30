import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'questionnaire',
  import.meta.glob('../../../../.storybook/fixtures/patterns/questionnaire/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/questionnaire/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Questionnaire', tags: ['autodocs'], ...catalogueMeta('questionnaire') };

export const QuestionnairePattern1 = {
  name: 'Guided setup',
  ...pattern(1, 'Three required questions in a card, with progress, navigation and a summary on submit.'),
  play: catalogueInteractions['questionnaire-1']
};
export const QuestionnairePattern2 = { name: 'Multiple answers', ...pattern(2, 'A checkbox question with a live count and a chip summary.') };
export const QuestionnairePattern3 = { name: 'Written answer', ...pattern(3, 'A text input beside the fixed choices, so an answer can be typed instead of picked.') };
export const QuestionnairePattern4 = { name: 'Segmented progress', ...pattern(4, 'A custom progress bar with step labels, built from the progress render state.') };
export const QuestionnairePattern5 = { name: 'Optional question', ...pattern(5, 'A question the visitor may skip, with the skipped state carried into the summary.') };
export const QuestionnairePattern6 = { name: 'Cross-question validation', ...pattern(6, 'A rule checked on submit returns the flow to the question that broke it.') };
export const QuestionnairePattern7 = { name: 'Conditional branch', ...pattern(7, 'A question joins the flow only after an earlier answer, with avatars, reset and a summary.') };
