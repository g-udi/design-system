# Scheduling

> Blocks/Scheduling · blocks · `@gaudi/design-system/blocks/Scheduling`

Scheduling building blocks on the Core Calendar and ToggleGroup: a calendar with per-day markers and a single-choice grid of time slots, plus time helpers.

## Import

```js
import Scheduling from '@gaudi/design-system/blocks/Scheduling';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `ScheduleCalendar`, `TimeSlots`, `addMinutes`, `dayKey`, `default`, `formatDuration`, `formatTime`, `minutesBetween`, `scheduleTones`, `timeSlots`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ScheduleCalendar.markers` | `Record<YYYY-MM-DD, tone[]>` | `{}` | no | Up to three dots per day; build keys with dayKey(date). |
| `ScheduleCalendar.markerLabel` | `(tones) => string` | `n events` | no | Screen-reader text for a marked day. |
| `TimeSlots.slots` | `string[]` | `[]` | no | HH:MM start times, usually from timeSlots(). |
| `TimeSlots.value / defaultValue / onValueChange` | `string / (slot) => void` | — | no | Controlled or initial selected slot. |
| `TimeSlots.unavailable` | `string[]` | `[]` | no | Booked slots: listed but disabled. |
| `TimeSlots.hour12` | `boolean` | `false` | no | Clock format and grid columns. |
| `columns` | `1 \| 2 \| 3 \| 4` | `3` | no | Clock format and grid columns. |
| `timeSlots({ start, end, step, duration })` | `helper` | `09:00–17:00 every 30` | no | Start times where the whole meeting fits before end. |
| `formatTime / formatDuration / addMinutes / minutesBetween` | `helpers` | — | no | Format and calculate HH:MM times and durations. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `columns`: `1`, `2`, `3`, `4`

## Usage

```jsx
import { TimeSlots, timeSlots } from '@gaudi/design-system/blocks/Scheduling';

<TimeSlots
  slots={timeSlots({ start: '09:00', end: '17:00', step: 30, duration: 30 })}
  unavailable={bookedTimes}
  value={selectedTime}
  onValueChange={setSelectedTime}
/>
```

## Accessibility

Marked days add their marker label to the day button name; time slots are a radio group with arrow-key navigation and disabled booked times.

## Notes

- Pass every other Calendar prop (mode, selected, disabled) straight to ScheduleCalendar.

## Examples

- Playground (Storybook `blocks-scheduling--playground`)

Curated patterns:

- Book a meeting — registry item `@gaudi/scheduling-book-meeting` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `RegistryIcon`, `ScheduleCalendar`, `ScrollArea`, `TimeSlots`, `ToggleGroupItem`, `ToggleGroupRoot`, `addMinutes`, `dayKey`, `timeSlots`)
- Create a schedule — registry item `@gaudi/scheduling-create-schedule` (uses `Attachment`, `AttachmentAction`, `AttachmentActions`, `AttachmentContent`, `AttachmentDescription`, `AttachmentMedia`, `AttachmentTitle`, `AttachmentTrigger`, `Button`, `Calendar`, `Combobox`, `ComboboxChip`, `ComboboxChips`, `ComboboxChipsInput`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxItem`, `ComboboxList`, `ComboboxValue`, `Input`, `Label`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RegistryIcon`, `formatBytes`, `useComboboxAnchor`, `useFileUpload`)
- Date and time popover — registry item `@gaudi/scheduling-date-time-popover` (uses `Button`, `Calendar`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RegistryIcon`, `TimeSlots`, `timeSlots`)
- Day agenda — registry item `@gaudi/scheduling-day-agenda` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Badge`, `RegistryIcon`, `ScheduleCalendar`, `ToggleGroupItem`, `ToggleGroupRoot`, `dayKey`)
- Month at a glance — registry item `@gaudi/scheduling-month-overview` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `ProgressRoot`, `ScheduleCalendar`, `ToggleGroupItem`, `ToggleGroupRoot`, `cn`, `dayKey`)
- Plan a meeting — registry item `@gaudi/scheduling-plan-meeting` (uses `Button`, `Label`, `ScheduleCalendar`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `addMinutes`, `formatDuration`, `minutesBetween`, `timeSlots`)
- Webinar details and RSVP — registry item `@gaudi/scheduling-webinar-rsvp` (uses `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`, `AvatarRoot`, `Badge`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `RegistryIcon`, `ToggleGroupItem`, `ToggleGroupRoot`)

## Related

`core-calendar`, `core-togglegroup`
