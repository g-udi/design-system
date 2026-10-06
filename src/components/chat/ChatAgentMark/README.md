# ChatAgentMark

The assistant’s mark. By default each agent gets a Gaudí-inspired motif (trencadís mosaic, basilica spires, a wrought-iron spiral, a rose window, the palmetto gate, the flower paving tile, a twisted chimney, a sun medallion or the nativity star) glazed in one of eight tile hues. The seed, or the name, picks both, so an agent keeps the same mark everywhere. An icon, image or monogram can sit on a token tile instead, and an optional activity badge shows what the agent is doing.

## Usage

```jsx
import { ChatAgentMark } from '@gaudi/design-system/chat';

<ChatAgentMark name='Gaudi' state='thinking' />
<ChatAgentMark name='Research agent' seed='agent_42' size='sm' decorative />
<ChatAgentMark name='Gaudi' motif='trencadis' hue='teal' size='xl' />
<ChatAgentMark name='Research agent' icon='Search' tone='discovery' size='sm' decorative />
```

## API

| Prop / part | Contract |
| --- | --- |
| `name` | The accessible name, the monogram source and the default seed. |
| `seed` | A stable id (for example the agent id) that picks the motif and hue. |
| `motif` / `hue` | Pin a motif (`agentMotifs`) or a glaze (`agentHues`); `auto` derives them from the seed. |
| `icon` / `image` / `monogram` | Show these on a `tone` tile instead of a motif. |
| `size` / `tone` | xs to xl; tone (accent, discovery, neutral, solid) applies to icon, image and monogram tiles. |
| `state` | Adds an ChatActivityIndicator badge. |
| `resolveAgentMark(seed)` | Returns the `{ motif, hue }` a seed resolves to, for legends. |
| `decorative` | Hides the mark when a visible name sits beside it. |

## Accessibility

The mark is `role="img"` with the agent’s name unless `decorative`. Its badge names the state for screen readers; the tile is fixed geometry at every density.
