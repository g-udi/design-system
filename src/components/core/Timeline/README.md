# Timeline

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
