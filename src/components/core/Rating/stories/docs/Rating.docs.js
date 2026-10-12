import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Rating": {
    ...definition('Display a rating or let people select a score using labelled stars.', [p('rating', 'number', '—', 'Current score.'), p('maxRating', 'number', '5', 'Maximum score.'), p('editable', 'boolean', 'false', 'Enable score selection.'), p('onRatingChange', '(rating: number) => void', '—', 'Receives a new score.'), p('showValue', 'boolean', 'false', 'Display the numeric score.'), p('size', 'sm | default | lg', 'default', 'Star size: sm 16px, default 20px, lg 24px.'), p('starClassName', 'string', '—', 'Class override applied to every star.'), className], 'Editable ratings expose keyboard-operable controls. Include enough text to explain the score and its range.'),
    usage: "import { Rating } from '@gaudi/design-system/core/Rating';\n\n<Rating aria-label='Rate this article' value={rating} onValueChange={setRating} />"
  }
};
