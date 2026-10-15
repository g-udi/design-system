# StatCard

Metric cards compose Core Card, Badge and IconTile. Applications supply the formatted values and their meaning.

```jsx
import { StatCard, StatDelta } from '@gaudi/design-system/blocks/StatCard';

<StatCard label='Failed runs' value='12' delta='−0.5%' deltaDirection='down' deltaTone='success' />
<StatDelta value='+0.00%' direction='flat' tone='neutral' />
```

`StatDelta` preserves `value` exactly, including its sign and zero. `direction` (`up`, `down`, `flat`) is optional and controls the icon and spoken direction. `tone` defaults to `neutral`; choose `accent`, `info`, `success`, `warning`, `danger`, `discovery` or `attention` explicitly. A lower value can be favorable or unfavorable depending on the metric.

`StatCard` passes `delta`, `deltaDirection` and `deltaTone` to its badge. The previous `invert` prop and automatic sign/color inference are removed; provide direction and tone explicitly when migrating. Card `tone` independently controls its optional icon and tinted background. Other slots are `label`, `value`, `icon`, `action`, `description`, `footer` and `children`; `variant` is `default`, `tinted` or `inverse`.

`valueMotion='reel'` animates a text or number `value` with [ReelText](../../animations/ReelText/README.md): its digits spin into each new figure, for example when a range switch in `action` changes the period. Other values render unchanged, and reduced motion swaps the figure instantly.

`StatMeter` accepts `segments` with `label`, numeric `value` and optional `tone`, plus `label` and `formatValue`. Its decorative bar has a text legend for assistive technology even when `showLegend={false}` visually hides it.
