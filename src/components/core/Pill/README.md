# Pill

A small label for a status, category, tag or count. Use `Pill` when you want a named tone (`blue`, `green`, `amber`…) with a
`variant` for emphasis; use `Badge` when you compose with the semantic variants (`success-light`, `destructive-outline`…).
Both render the same Badge element, and Pill tones read from the shared Button tone scale, so they switch with the theme.

```jsx
import { Badge, Pill } from '@gaudi/design-system';

<Pill tone='green' variant='soft' size='sm' pulse>Live</Pill>
<Pill href='/blog/tags/tokens' tone='gray' variant='soft'>#tokens</Pill>
<Badge variant='success-light'>Shipped</Badge>
<Badge variant='discovery-light'>Suggested</Badge>
<Badge variant='attention-light'>Needs review</Badge>
```

- `tone`: `blue` (default), `green`, `amber`, `red`, `indigo`, `teal`, `rose`, `neutral`, `gray`; `yellow` is an alias of `amber`.
- `variant`: `solid` (default), `soft`, `outline`, `ghost`, `subtle`. `size`: `xs`, `sm`, `md` (default), `lg`. `radius`: `sm` (default), `md`, `full`.
- `href` renders a link with a comfortable hit target; `icon` adds a decorative leading icon; `pulse` adds a decorative live dot, so keep the meaning in the text.
- `Badge` variants: `default`, `secondary`, `outline`, and the semantic `info`, `success`, `warning`, `destructive`,
  `discovery`, `attention`, `focus`, `invert`, each with `-light` and `-outline` treatments (`primary-light`/`primary-outline` too).
  Use `discovery` for suggested or generated labels (for example tags proposed by an assistant) and `attention` for records
  that need a person to look (staged, unreviewed). They read from the `--ds-color-discovery*` and `--ds-color-attention*` tokens.
- `BadgeRoot` and `badgeVariantsPrimitive` are kept as aliases of `Badge` and `badgeVariants`.
