# Stat Cards

> Blocks/Stat Cards · blocks · `@gaudi/design-system/blocks/StatCard`

Metric cards on the Core Card: a label, value and change badge with optional icon tile, actions, description, footer and a segmented meter.

## Import

```js
import StatCards from '@gaudi/design-system/blocks/StatCard';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `StatCard`, `StatDelta`, `StatIcon`, `StatMeter`, `default`, `statTones`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label / value` | `ReactNode` | — | no | Metric name and its prepared value. |
| `valueMotion` | `none \| reel` | `none` | no | reel spins a text or number value into each new figure on ReelText reels; other values render unchanged. |
| `delta` | `string \| number` | — | no | Change in your formatting, including its sign and zero. |
| `deltaDirection` | `up \| down \| flat` | — | no | Explicit arrow and semantic colour; the host decides what the change means. |
| `deltaTone` | `semantic tone` | `neutral` | no | Explicit arrow and semantic colour; the host decides what the change means. |
| `icon` | `string` | — | no | Icon tile and its colour. |
| `tone` | `neutral \| accent \| info \| success \| warning \| danger \| discovery \| attention` | `neutral` | no | Icon tile and its colour. |
| `variant` | `default \| tinted \| inverse` | `default` | no | Card, colour block in tone, or dark surface. |
| `action` | `ReactNode` | — | no | Header slot, usually a menu, range switch or status badge. |
| `description / footer` | `ReactNode` | — | no | Comparison line and footer text. |
| `StatMeter.segments` | `Array<{ label, value, tone }>` | `[]` | no | Segmented bar with a legend of values and shares. |
| `StatDelta.value` | `string \| number` | — | no | Standalone change badge with explicit presentation and unchanged value. |
| `direction` | `up \| down \| flat` | — | no | Standalone change badge with explicit presentation and unchanged value. |
| `tone` | `semantic tone` | `neutral` | no | Standalone change badge with explicit presentation and unchanged value. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `valueMotion`: `none`, `reel`
- `deltaDirection`: `up`, `down`, `flat`
- `tone`: `neutral`, `accent`, `info`, `success`, `warning`, `danger`, `discovery`, `attention`
- `variant`: `default`, `tinted`, `inverse`
- `direction`: `up`, `down`, `flat`

## Usage

```jsx
import { StatCard } from '@gaudi/design-system/blocks/StatCard';

<StatCard label='Subscribers' value='4,180' delta='+8.4%' deltaDirection='up' deltaTone='success' />
```

## Accessibility

Change badges announce their direction (Up, Down, Unchanged) and never rely on colour alone; meters are decorative bars backed by a text legend.

## Notes

- Values are prepared by the host; StatCard never formats or infers data.

## Examples

- Playground (Storybook `blocks-stat-cards--playground`)

Curated patterns:

- Balance — registry item `@gaudi/stat-card-balance` (uses `Button`, `RegistryIcon`, `StatCard`, `StatMeter`)
- Breakdowns — registry item `@gaudi/stat-card-breakdowns` (uses `Badge`, `Button`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `RegistryIcon`, `StatCard`, `StatMeter`)
- Hero metrics — registry item `@gaudi/stat-card-hero` (uses `Button`, `CardContent`, `CardFooter`, `CardRoot`, `RegistryIcon`, `StatDelta`)
- Interval switch — registry item `@gaudi/stat-card-interval-reel` (uses `StatCard`, `ToggleGroup`)
- KPI overview — registry item `@gaudi/stat-card-kpi-overview` (uses `Button`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `RegistryIcon`, `StatCard`, `StatDelta`, `ToggleGroupItem`, `ToggleGroupRoot`, `cn`)
- Leads with a range — registry item `@gaudi/stat-card-lead-range` (uses `ProgressRoot`, `StatCard`, `StatMeter`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Quota and progress — registry item `@gaudi/stat-card-quota` (uses `Badge`, `ProgressRoot`, `RegistryIcon`, `StatCard`)
- Revenue breakdown — registry item `@gaudi/stat-card-revenue` (uses `Button`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `Link`, `RegistryIcon`, `StatCard`)
- Support metrics — registry item `@gaudi/stat-card-support` (uses `Badge`, `StatCard`)
- Team performance — registry item `@gaudi/stat-card-team-performance` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `ProgressRoot`, `StatCard`, `StatDelta`)

## Related

`core-card`, `animations-text-reeltext`, `core-icon`

## README

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
