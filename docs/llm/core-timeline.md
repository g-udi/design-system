# Timeline

> Core/Timeline · core · `@gaudi/design-system/core/Timeline`

Display dated activity and milestones with readable descriptions and optional actions.

## Import

```js
import Timeline from '@gaudi/design-system/core/Timeline';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `TimelineContent`, `TimelineDate`, `TimelineHeader`, `TimelineIndicator`, `TimelineItem`, `TimelineRoot`, `TimelineSeparator`, `TimelineTitle`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `Array<{ id, title, description?, time?, dateTime?, icon?, children? }>` | `[]` | no | Chronological entries with stable IDs. |
| `label` | `string` | `Activity` | no | Accessible name of the list. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import Timeline from '@gaudi/design-system/core/Timeline';

<Timeline items={milestones} />
```

## Accessibility

Use machine-readable dateTime values with visible dates. Icons supplement the text and are decorative.

## Examples

- Playground (Storybook `core-timeline--playground`)
- Long Content (Storybook `core-timeline--long-content`)

Curated patterns:

- Activity stream — registry item `@gaudi/timeline-activity-stream` (uses `Attachment`, `AttachmentAction`, `AttachmentActions`, `AttachmentContent`, `AttachmentDescription`, `AttachmentGroup`, `AttachmentMedia`, `AttachmentTitle`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `ProgressRoot`, `Rating`, `RegistryIcon`, `TimelineContent`, `TimelineDate`, `TimelineHeader`, `TimelineIndicator`, `TimelineItem`, `TimelineRoot`, `TimelineSeparator`, `useCopyToClipboard`)
- Alternating milestones — registry item `@gaudi/timeline-alternating` (uses `TimelineDate`, `TimelineHeader`, `TimelineIndicator`, `TimelineItem`, `TimelineRoot`, `TimelineSeparator`, `TimelineTitle`, `cn`)
- Release changelog — registry item `@gaudi/timeline-changelog` (uses `Badge`, `TimelineContent`, `TimelineDate`, `TimelineHeader`, `TimelineIndicator`, `TimelineItem`, `TimelineRoot`, `TimelineSeparator`, `TimelineTitle`)
- Horizontal releases — registry item `@gaudi/timeline-horizontal-releases` (uses `Badge`, `Label`, `RegistryIcon`, `SwitchRoot`, `TimelineContent`, `TimelineDate`, `TimelineHeader`, `TimelineIndicator`, `TimelineItem`, `TimelineRoot`, `TimelineSeparator`, `TimelineTitle`, `cn`)
- Pipeline steps — registry item `@gaudi/timeline-pipeline-steps` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `Frame`, `FrameHeader`, `FramePanel`, `LoaderRoot`, `RegistryIcon`, `TimelineContent`, `TimelineHeader`, `TimelineIndicator`, `TimelineItem`, `TimelineRoot`, `TimelineSeparator`, `TimelineTitle`, `cn`)
- Vertical progress — registry item `@gaudi/timeline-vertical-progress` (uses `Label`, `RegistryIcon`, `SwitchRoot`, `TimelineContent`, `TimelineDate`, `TimelineHeader`, `TimelineIndicator`, `TimelineItem`, `TimelineRoot`, `TimelineSeparator`, `TimelineTitle`, `ToggleGroupItem`, `ToggleGroupRoot`, `cn`)

## README

A dated activity feed or a set of milestones. `Timeline` takes an `items` array and renders an ordered list built from
the Timeline parts; compose `TimelineRoot`, `TimelineItem`, `TimelineIndicator`, `TimelineSeparator`, `TimelineHeader`,
`TimelineTitle`, `TimelineDate` and `TimelineContent` directly for steps, horizontal rails or avatars.

```jsx
import Timeline from '@gaudi/design-system/core/Timeline';

<Timeline
  label='Editorial activity'
  items={[{ id: 'published', title: 'Article published', time: '2 days ago', dateTime: '2026-09-27T09:00:00Z', icon: <Icon name='CircleCheck' decorative /> }]}
/>
```

- Each item needs a stable `id` and a `title`; `description`, `time` with a machine-readable `dateTime`, a decorative `icon`
  and `children` (actions, quotes, files) are optional.
- `label` names the list. Icons are decorative, so keep the meaning in the text.
- `TimelineRoot` tracks the active step (`value`, `defaultValue`, `onValueChange`, `orientation`); `TimelineRoot`,
  `TimelineItem` and `TimelineTitle` accept `asChild` to render your own element, such as `<ol>`, `<li>` or a heading level.
