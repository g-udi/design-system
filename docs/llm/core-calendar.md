# Calendar

> Core/Calendar · core · `@gaudi/design-system/core/Calendar`

Date selection for single dates, ranges, bookings and localized calendars.

## Import

```js
import { Calendar } from '@gaudi/design-system/core/Calendar';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Calendar`, `CalendarDayButton`, `DEFAULT_DATE_SELECTOR_I18N`, `DateSelector`, `formatDateValue`, `useDateSelector`, `useDateSelectorContext`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `mode` | `single \| multiple \| range` | — | no | DayPicker selection mode. |
| `selected / onSelect` | `Date \| Date[] \| DateRange / function` | — | no | Controlled selection and selection callback; the shape follows mode. |
| `disabled` | `Matcher \| Matcher[]` | — | no | Dates that cannot be selected. |
| `numberOfMonths` | `number` | `1` | no | Number of visible months. |
| `showOutsideDays` | `boolean` | `true` | no | Show dates outside the current month. |
| `captionLayout` | `label \| dropdown \| dropdown-months \| dropdown-years` | `label` | no | Month and year navigation controls. |
| `buttonVariant` | `Button variant` | `ghost` | no | Variant for calendar navigation buttons. |
| `locale / formatters / components` | `Locale / Formatters / CustomComponents` | — | no | Localized text and explicit DayPicker overrides. |
| `classNames` | `Partial<ClassNames>` | — | no | Classes for individual DayPicker slots. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `mode`: `single`, `multiple`, `range`
- `captionLayout`: `label`, `dropdown`, `dropdown-months`, `dropdown-years`

## Usage

```jsx
import { Calendar } from '@gaudi/design-system/core/Calendar';

<Calendar mode='single' selected={date} onSelect={setDate} />
```

## Accessibility

DayPicker supplies grid navigation and selected-date announcements. Label the calendar and explain disabled dates.

## Notes

- Calendar forwards DayPicker props. Range selection uses `{ from, to }`; an incomplete range may have no end date.
- DateSelector is a separate compound export for period selection. Its examples include the complete value and localization shape.

## Examples

- Playground (Storybook `core-calendar--playground`)

Curated patterns:

- Appointment booking — registry item `@gaudi/calendar-appointment-booking` (uses `Button`, `Calendar`, `CardContent`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `RegistryIcon`, `ScrollArea`)
- Caption and navigation — registry item `@gaudi/calendar-caption-navigation` (uses `Button`, `Calendar`, `CardContent`, `CardRoot`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Daily pricing — registry item `@gaudi/calendar-daily-pricing` (uses `Calendar`, `CalendarDayButton`, `cn`)
- Event list — registry item `@gaudi/calendar-event-list` (uses `Button`, `Calendar`, `CardContent`, `CardFooter`, `CardRoot`, `EmptyState`, `RegistryIcon`, `cn`)
- Date pickers in popovers — registry item `@gaudi/calendar-popover-pickers` (uses `Button`, `Calendar`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RegistryIcon`, `Separator`, `cn`)
- Presets — registry item `@gaudi/calendar-presets` (uses `Button`, `Calendar`, `CardContent`, `CardRoot`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Selection and display options — registry item `@gaudi/calendar-selection-options` (uses `Calendar`, `CardContent`, `CardRoot`, `Label`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Year and month grid — registry item `@gaudi/calendar-year-month-grid` (uses `Button`, `Calendar`, `CardContent`, `CardRoot`, `RegistryIcon`, `ScrollArea`)
- Date selector: Opened from a field — registry item `@gaudi/date-selector-in-popover` (uses `Button`, `DateSelector`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RegistryIcon`, `Separator`, `formatDateValue`)
- Date selector: Options — registry item `@gaudi/date-selector-options` (uses `CardContent`, `CardRoot`, `DateSelector`, `Label`, `SwitchRoot`, `formatDateValue`)
- Date selector: Translated, in a dialog — registry item `@gaudi/date-selector-translated-dialog` (uses `Button`, `DEFAULT_DATE_SELECTOR_I18N`, `DateSelector`, `DialogClosePrimitive`, `DialogContent`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `RegistryIcon`, `formatDateValue`)

## README

A month grid for picking one date, several dates or a range. Use it inline or inside a Popover for a date field; use `DateSelector` when people filter by day, month, quarter, half-year or year.

```jsx
import { Calendar } from '@gaudi/design-system';

<Calendar mode='range' selected={range} onSelect={setRange} numberOfMonths={2} disabled={{ before: new Date() }} />
```

- `mode` is `single`, `multiple` or `range`. `disabled` takes dates, ranges or matchers, and `footer` shows a summary under the grid.
- `captionLayout` switches the header between a label and month or year dropdowns; `showOutsideDays`, `showWeekNumber` and `numberOfMonths` shape the grid.
- Day cells are squares of `--cell-size` (32px, 40px on touch screens). Set the variable on the calendar to fit custom day content; the month never stretches to fill its container.
- `CalendarDayButton` is the default day cell, for custom `components.DayButton` renderers.

### DateSelector

`DateSelector` combines an is/before/after/between filter, period tabs and a calendar or period grid, with optional typed input. Pass `value` / `onChange` and translate every string with `i18n`.

The period grid shows `yearRange` years (10 by default) around `baseYear`, or the current year when omitted. Pass both `minYear` and `maxYear` to supply an explicit inclusive year window.

An empty `value` clears a previous selection, including a cancelled draft in an overlay that is still closing. Hosts keep committed and draft values separate when using Apply and Cancel.

### Accessibility

Days are buttons in a grid with the full date as their name. Arrow keys move by day and week, Page Up and Page Down by month, and disabled days cannot be picked.

### Implementation ownership

`Calendar` owns the DayPicker bridge. DateSelector formatting, labels, state and context are separate from its private day/period views and controls. All supported exports remain available from the Calendar entry.
