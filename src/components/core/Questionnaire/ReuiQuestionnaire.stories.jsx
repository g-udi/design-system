// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'questionnaire',
  import.meta.glob('../../../../.storybook/fixtures/reui/questionnaire/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/questionnaire/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Questionnaire', tags: ['autodocs'], ...catalogueMeta('questionnaire') };

export const ReuiQuestionnaire1 = {
  name: 'Guided setup',
  ...pattern(1, 'Three required questions in a card, with progress, navigation and a summary on submit.'),
  play: catalogueInteractions['questionnaire-1']
};
export const ReuiQuestionnaire2 = { name: 'Multiple answers', ...pattern(2, 'A checkbox question with a live count and a chip summary.') };
export const ReuiQuestionnaire3 = { name: 'Written answer', ...pattern(3, 'A text input beside the fixed choices, so an answer can be typed instead of picked.') };
export const ReuiQuestionnaire4 = { name: 'Segmented progress', ...pattern(4, 'A custom progress bar with step labels, built from the progress render state.') };
export const ReuiQuestionnaire5 = { name: 'Optional question', ...pattern(5, 'A question the visitor may skip, with the skipped state carried into the summary.') };
export const ReuiQuestionnaire6 = { name: 'Cross-question validation', ...pattern(6, 'A rule checked on submit returns the flow to the question that broke it.') };
export const ReuiQuestionnaire7 = { name: 'Conditional branch', ...pattern(7, 'A question joins the flow only after an earlier answer, with avatars, reset and a summary.') };
