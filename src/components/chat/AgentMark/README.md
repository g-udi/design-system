# AgentMark

The assistant’s mark: an icon, an image or a monogram on a token-coloured tile that follows the global radius, with an optional activity badge.

## Usage

```jsx
import { AgentMark } from '@gaudi/design-system/chat';

<AgentMark name='Gaudi' state='thinking' />
<AgentMark name='Research agent' icon='Search' tone='discovery' size='sm' decorative />
```

## API

| Prop / part | Contract |
| --- | --- |
| `name` | The accessible name, and the monogram source. |
| `icon` / `image` / `monogram` | What the tile shows. |
| `size` / `tone` | xs to lg; accent, discovery, neutral or solid. |
| `state` | Adds an ActivityIndicator badge. |
| `decorative` | Hides the mark when a visible name sits beside it. |

## Accessibility

The mark is `role="img"` with the agent’s name unless `decorative`. Its badge names the state for screen readers; the tile is fixed geometry at every density.
