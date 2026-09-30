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
  name: 'Guided workspace setup',
  ...pattern(1, 'Three required questions in a card, with progress, navigation and a summary on submit.'),
  play: catalogueInteractions['questionnaire-1']
};
export const ReuiQuestionnaire2 = { name: 'Multi-select answers', ...pattern(2, 'A checkbox question that accepts several answers, with a live count and a chip summary.') };
export const ReuiQuestionnaire3 = { name: 'A written answer beside the choices', ...pattern(3, 'A text input sitting with the fixed choices, so an answer can be typed instead of picked.') };
export const ReuiQuestionnaire4 = { name: 'Segmented progress with step labels', ...pattern(4, 'A custom progress bar built from the progress render state, over a four question flow.') };
export const ReuiQuestionnaire5 = { name: 'An optional question with skip', ...pattern(5, 'A question the visitor may skip on purpose, with the skipped state carried into the summary.') };
export const ReuiQuestionnaire6 = { name: 'A rule that sends you back', ...pattern(6, 'A cross-question rule checked on submit, returning the flow to the question that broke it.') };
export const ReuiQuestionnaire7 = { name: 'A branch that appears when it applies', ...pattern(7, 'A question that only joins the flow after an earlier answer, with avatars, reset and a summary.') };
