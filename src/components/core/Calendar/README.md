# Calendar

A month grid for picking one date, several dates or a range. Use it inline or inside a Popover for a date field; use `DateSelector` when people filter by day, month, quarter, half-year or year.

```jsx
import { Calendar } from '@gaudi/design-system';

<Calendar mode='range' selected={range} onSelect={setRange} numberOfMonths={2} disabled={{ before: new Date() }} />
```

- `mode` is `single`, `multiple` or `range`. `disabled` takes dates, ranges or matchers, and `footer` shows a summary under the grid.
- `captionLayout` switches the header between a label and month or year dropdowns; `showOutsideDays`, `showWeekNumber` and `numberOfMonths` shape the grid.
- Day cells are squares of `--cell-size` (32px, 40px on touch screens). Set the variable on the calendar to fit custom day content; the month never stretches to fill its container.
- `CalendarDayButton` is the default day cell, for custom `components.DayButton` renderers.

## DateSelector

`DateSelector` combines an is/before/after/between filter, period tabs and a calendar or period grid, with optional typed input. Pass `value` / `onChange` and translate every string with `i18n`.

## Accessibility

Days are buttons in a grid with the full date as their name. Arrow keys move by day and week, Page Up and Page Down by month, and disabled days cannot be picked.
