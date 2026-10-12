# ChatAgentMark

> Chat/ChatAgentMark · chat · `@gaudi/design-system/chat/ChatAgentMark`

The assistant’s mark: a Gaudí-inspired motif glazed in a tile hue picked from a seed, or an icon, image or monogram on a token tile, with an optional activity badge.

## Import

```js
import ChatAgentMark from '@gaudi/design-system/chat/ChatAgentMark';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatAgentMark`, `agentHues`, `agentMarkVariants`, `agentMotifs`, `default`, `resolveAgentMark`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string` | `Gaudi` | no | Accessible name, monogram source and default seed. |
| `seed` | `string` | `name` | no | Stable id that picks the motif and hue. |
| `motif` | `auto \| trencadis \| spire \| ironwork \| rose \| palmetto \| panot \| helicoid \| sun \| star` | `auto` | no | Pin a motif. |
| `hue` | `auto \| teal \| blue \| amber \| rose \| green \| indigo \| red \| yellow` | `auto` | no | Pin a glaze. |
| `size` | `xs \| sm \| md \| lg \| xl` | `md` | no | Tile size. |
| `tone` | `accent \| discovery \| neutral \| solid` | `accent` | no | Tile colour. |
| `state` | `idle \| thinking \| streaming \| tool \| done \| error` | — | no | Adds an ChatActivityIndicator badge. |
| `monogram` | `boolean` | `false` | no | Initials instead of the icon. |
| `icon` | `string` | `Sparkles` | no | Glyph, image and hiding. |
| `image` | `string` | — | no | Glyph, image and hiding. |
| `decorative` | `boolean` | `false` | no | Glyph, image and hiding. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `motif`: `auto`, `trencadis`, `spire`, `ironwork`, `rose`, `palmetto`, `panot`, `helicoid`, `sun`, `star`
- `hue`: `auto`, `teal`, `blue`, `amber`, `rose`, `green`, `indigo`, `red`, `yellow`
- `size`: `xs`, `sm`, `md`, `lg`, `xl`
- `tone`: `accent`, `discovery`, `neutral`, `solid`
- `state`: `idle`, `thinking`, `streaming`, `tool`, `done`, `error`

## Usage

```jsx
import { ChatAgentMark } from '@gaudi/design-system/chat';

<>
<ChatAgentMark name='Gaudi' state='thinking' />
<ChatAgentMark name='Research agent' icon='Search' tone='discovery' size='sm' decorative />
</>
```

## Accessibility

role=img named after the agent unless decorative.

## Examples

- Playground (Storybook `chat-agentmark--playground`)
- Motifs and glazes (Storybook `chat-agentmark--motifs`)
- Status at every size (Storybook `chat-agentmark--statuses`)
- Icon, image or monogram instead (Storybook `chat-agentmark--icons-and-monograms`)
- In a thread, with several agents (Storybook `chat-agentmark--in-a-thread`)

## Related

`chat-chatactivityindicator`

## README

The assistant’s mark. By default each agent gets a Gaudí-inspired motif (trencadís mosaic, basilica spires, a wrought-iron spiral, a rose window, the palmetto gate, the flower paving tile, a twisted chimney, a sun medallion or the nativity star) glazed in one of eight tile hues. The seed, or the name, picks both, so an agent keeps the same mark everywhere. An icon, image or monogram can sit on a token tile instead, and an optional activity badge shows what the agent is doing.

### Usage

```jsx
import { ChatAgentMark } from '@gaudi/design-system/chat';

<ChatAgentMark name='Gaudi' state='thinking' />
<ChatAgentMark name='Research agent' seed='agent_42' size='sm' decorative />
<ChatAgentMark name='Gaudi' motif='trencadis' hue='teal' size='xl' />
<ChatAgentMark name='Research agent' icon='Search' tone='discovery' size='sm' decorative />
```

### API

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

### Accessibility

The mark is `role="img"` with the agent’s name unless `decorative`. Its badge names the state for screen readers; the tile is fixed geometry at every density.
