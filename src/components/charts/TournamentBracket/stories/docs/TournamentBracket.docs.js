import { p, className, definition } from '../../../../../docs/components/referenceProps.js';

export default {
  'Charts/TournamentBracket': {
    ...definition('A knockout bracket with connected match cards, round paging, scores, penalties, and explicit winners.', [
      p('rounds', 'Round[]', '[]', 'Ordered { id, name, matches } rounds, each with half the matches of the previous one, ending in a single final. IDs are unique.'),
      p('label', 'string', 'Tournament bracket', 'Accessible name of the bracket region.'),
      p('round / defaultRound / onRoundChange', 'number / function', '0', 'Controlled or initial leftmost round index. Clamped for the current container width.'),
      p('onMatchClick', '(match) => void', '—', 'Makes match cards buttons for host-owned details.'),
      p('disabled', 'boolean', 'false', 'Disables round navigation and match actions.'),
      p('labels', 'object', 'English labels', 'Localize navigation, match statuses, TBD, winner, penalties, versus, empty and invalid-state text.'), className
    ], 'Labelled match groups expose round and participant names. Native buttons support keyboard navigation; current rounds are announced politely. Winners have a text alternative as well as an icon and weight. Motion respects reduced-motion preferences. One, two or three rounds fit the container without page overflow.'),
    usage: "import { TournamentBracket } from '@gaudi/design-system/charts/TournamentBracket';\n\nconst rounds = [{ id: 'final', name: 'Final', matches: [{ id: 'f1', status: 'completed', home: { name: 'North', score: 2 }, away: { name: 'South', score: 1 }, winner: 'home' }] }];\n<TournamentBracket rounds={rounds} />"
  }
};
