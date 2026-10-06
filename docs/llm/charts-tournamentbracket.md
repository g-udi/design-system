# TournamentBracket

> Charts/TournamentBracket · charts · `@gaudi/design-system/charts/TournamentBracket`

A knockout bracket with connected match cards, round paging, scores, penalties, and explicit winners.

## Import

```js
import { TournamentBracket } from '@gaudi/design-system/charts/TournamentBracket';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `TournamentBracket`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `rounds` | `Round[]` | `[]` | no | Ordered { id, name, matches } rounds, each with half the matches of the previous one, ending in a single final. IDs are unique. |
| `label` | `string` | `Tournament bracket` | no | Accessible name of the bracket region. |
| `round / defaultRound / onRoundChange` | `number / function` | `0` | no | Controlled or initial leftmost round index. Clamped for the current container width. |
| `onMatchClick` | `(match) => void` | — | no | Makes match cards buttons for host-owned details. |
| `disabled` | `boolean` | `false` | no | Disables round navigation and match actions. |
| `labels` | `object` | `English labels` | no | Localize navigation, match statuses, TBD, winner, penalties, versus, empty and invalid-state text. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { TournamentBracket } from '@gaudi/design-system/charts/TournamentBracket';

const rounds = [{ id: 'final', name: 'Final', matches: [{ id: 'f1', status: 'completed', home: { name: 'North', score: 2 }, away: { name: 'South', score: 1 }, winner: 'home' }] }];
<TournamentBracket rounds={rounds} />
```

## Accessibility

Labelled match groups expose round and participant names. Native buttons support keyboard navigation; current rounds are announced politely. Winners have a text alternative as well as an icon and weight. Motion respects reduced-motion preferences. One, two or three rounds fit the container without page overflow.

## Examples

- Playground (Storybook `charts-tournamentbracket--playground`)
- Final with a winner (Storybook `charts-tournamentbracket--final-result`)
- Empty (Storybook `charts-tournamentbracket--empty`)

## README

A knockout bracket with connected match cards and responsive round paging. Import from `@gaudi/design-system/charts/TournamentBracket` or `@gaudi/design-system/charts`, with Gaudi's global stylesheet.

```jsx
import { TournamentBracket } from '@gaudi/design-system/charts/TournamentBracket';

const rounds = [{
  id: 'final', name: 'Final', matches: [{
    id: 'f1', label: 'Oct 25 · 19:00', status: 'completed',
    home: { name: 'North', score: 2 }, away: { name: 'South', score: 1 }, winner: 'home'
  }]
}];
<TournamentBracket rounds={rounds} />
```

Supply ordered rounds `{ id, name, matches }`. Each round must have half as many matches as the previous one, ending with a single final. Round IDs are unique, and match IDs are unique across rounds. Empty data has an empty state; structurally invalid data displays a readable error. Represent byes and undecided participants with null sides while preserving the bracket structure.

Matches accept `id`, optional `label`, `status` (`upcoming`, `live`, `completed`), `home`, `away`, and `winner` (`home` or `away`). Each side accepts `name`, `seed`, `score`, and `penalties`. Zero scores are preserved. Winners and advancement are explicitly supplied by the application: scores never infer a result, and the component does not propagate winners.

The measured container shows one round below 560px, two below 880px, and up to three above it. Navigation shifts one round at a time and keeps the final two rounds together when space permits. `defaultRound` selects the initial leftmost round; `round` and `onRoundChange` provide controlled navigation. Out-of-range values are clamped for rendering without changing host state. `onMatchClick(match)` turns cards into keyboard-accessible buttons. `disabled` disables navigation and match actions.

Match groups name their round and participants; winners have visible icons and accessible text. Navigation announces the visible rounds. Layout motion respects reduced motion. Override `labels` to localize `previous`, `next`, `empty`, `invalid`, `invalidDescription`, `tbd`, `winner`, `completed`, `live`, `upcoming`, `penalties`, and `versus`.

The round-window interaction was inspired by [Skiper UI's knockout bracket](https://skiper-ui.com/v1/skiper107). This is an independent Gaudi implementation using its own primitives, hooks, tokens and CSS grid geometry; no Skiper source or remote assets are bundled.
