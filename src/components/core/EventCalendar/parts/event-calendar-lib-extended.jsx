// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { expandRecurrence } from './event-calendar-recurrence-extended.jsx';
import { TZDate } from '@date-fns/tz';
import {
  addDays,
  addMonths,
  addWeeks,
  differenceInCalendarDays,
  differenceInMinutes,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek
} from 'date-fns';
const MIN_PACK_SLOT = 30;
function toZoned(date, timeZone) {
  return new TZDate(date.getTime(), timeZone);
}
function zonedStartOfDay(date, timeZone) {
  return startOfDay(toZoned(date, timeZone));
}
function getDayKey(date, timeZone) {
  return format(toZoned(date, timeZone), 'yyyy-MM-dd');
}
function getDayTotalMinutes(dayStart, timeZone) {
  const next = zonedStartOfDay(
    addDays(toZoned(dayStart, timeZone), 1),
    timeZone
  );
  return differenceInMinutes(next, dayStart);
}
function snapMinutes(minutes, snap) {
  return Math.round(minutes / snap) * snap;
}
function getViewDateRange(view, date, opts) {
  const { timeZone, weekStartsOn, dayCount, agendaDayCount, fixedWeeks } = opts;
  const zoned = toZoned(date, timeZone);
  if (view === 'month') {
    const activeStart = startOfMonth(zoned);
    const activeEnd = startOfMonth(addMonths(zoned, 1));
    const visibleStart = startOfWeek(activeStart, { weekStartsOn });
    let visibleEnd;
    if (fixedWeeks) {
      visibleEnd = addDays(visibleStart, 42);
    } else {
      visibleEnd = startOfWeek(addDays(activeEnd, -1), { weekStartsOn });
      visibleEnd = addWeeks(visibleEnd, 1);
    }
    return {
      activeRange: { start: activeStart, end: activeEnd },
      visibleRange: { start: visibleStart, end: visibleEnd }
    };
  }
  if (view === 'week') {
    const start2 = startOfWeek(zoned, { weekStartsOn });
    const range2 = { start: start2, end: addWeeks(start2, 1) };
    return { activeRange: range2, visibleRange: range2 };
  }
  if (view === 'day' || view === 'resource') {
    const start2 = startOfDay(zoned);
    const range2 = { start: start2, end: addDays(start2, 1) };
    return { activeRange: range2, visibleRange: range2 };
  }
  if (view === 'days') {
    const start2 = startOfDay(zoned);
    const range2 = {
      start: start2,
      end: addDays(start2, Math.max(1, dayCount))
    };
    return { activeRange: range2, visibleRange: range2 };
  }
  const start = startOfDay(zoned);
  const range = { start, end: addDays(start, Math.max(1, agendaDayCount)) };
  return { activeRange: range, visibleRange: range };
}
function lastDayOfZonedMonth(date) {
  return addDays(startOfMonth(addMonths(date, 1)), -1).getDate();
}
function stepDate(view, date, direction, opts) {
  const zoned = toZoned(date, opts.timeZone);
  if (view === 'month') {
    const stepped = addMonths(zoned, direction);
    if (zoned.getDate() !== lastDayOfZonedMonth(zoned)) return stepped;
    return addDays(stepped, lastDayOfZonedMonth(stepped) - stepped.getDate());
  }
  if (view === 'week') return addWeeks(zoned, direction);
  if (view === 'day' || view === 'resource') return addDays(zoned, direction);
  if (view === 'days')
    return addDays(zoned, direction * Math.max(1, opts.dayCount));
  return addDays(zoned, direction * Math.max(1, opts.agendaDayCount));
}
function rangesIntersect(a, b) {
  return a.start < b.end && a.end > b.start;
}
function eventsOverlap(a, b) {
  return a.start < b.end && a.end > b.start;
}
function segmentOccurrence(occurrence, range, timeZone) {
  const occStart = occurrence.start;
  const occEnd = occurrence.end;
  const isZeroLength = occEnd.getTime() === occStart.getTime();
  const clampStart = occStart > range.start ? occStart : range.start;
  const clampEnd = occEnd < range.end ? occEnd : range.end;
  if (clampEnd < clampStart) return [];
  if (clampEnd.getTime() === clampStart.getTime() && !isZeroLength) return [];
  const segments = [];
  let cursor = zonedStartOfDay(clampStart, timeZone);
  while (cursor < clampEnd || (isZeroLength && segments.length === 0)) {
    const next = zonedStartOfDay(
      addDays(toZoned(cursor, timeZone), 1),
      timeZone
    );
    const segStart = clampStart > cursor ? clampStart : cursor;
    const segEnd = clampEnd < next ? clampEnd : next;
    const emptySeg = segEnd.getTime() <= segStart.getTime();
    if (!emptySeg || isZeroLength) {
      const isStart = segStart.getTime() === occStart.getTime();
      const isEnd = segEnd.getTime() === occEnd.getTime();
      segments.push({
        occurrence,
        day: cursor,
        isStart,
        isEnd,
        continuesBefore: !isStart,
        continuesAfter: !isEnd,
        startMin: occurrence.allDay
          ? void 0
          : differenceInMinutes(segStart, cursor),
        endMin: occurrence.allDay
          ? void 0
          : Math.max(
              differenceInMinutes(segEnd, cursor),
              differenceInMinutes(segStart, cursor)
            )
      });
    }
    if (isZeroLength) break;
    cursor = next;
  }
  return segments;
}
function isBarOccurrence(occurrence, timeZone) {
  return occurrence.allDay || spansMultipleDays(occurrence, timeZone);
}
function spansMultipleDays(occ, timeZone) {
  const dayStart = startOfDay(
    timeZone ? toZoned(occ.start, timeZone) : occ.start
  );
  const nextDayStart = startOfDay(addDays(dayStart, 1));
  return (
    occ.end.getTime() - occ.start.getTime() >
    nextDayStart.getTime() - dayStart.getTime()
  );
}
function packTimedSegments(segments) {
  if (segments.length === 0) return;
  const items = segments
    .map((seg) => {
      const startMin = seg.startMin ?? 0;
      const endMin = seg.endMin ?? startMin;
      return {
        seg,
        startMin,
        effEnd: Math.max(endMin, startMin + MIN_PACK_SLOT)
      };
    })
    .sort(
      (a, b) =>
        a.startMin - b.startMin ||
        b.effEnd - b.startMin - (a.effEnd - a.startMin) ||
        a.seg.occurrence.key.localeCompare(b.seg.occurrence.key)
    );
  const clusters = [];
  let current = [];
  let clusterEnd = -Infinity;
  for (const item of items) {
    if (item.startMin >= clusterEnd) {
      current = [];
      clusters.push(current);
      clusterEnd = -Infinity;
    }
    current.push(item);
    clusterEnd = Math.max(clusterEnd, item.effEnd);
  }
  for (const cluster of clusters) {
    const colEnds = [];
    const byColumn = /* @__PURE__ */ new Map();
    for (const item of cluster) {
      let col = colEnds.findIndex((end) => end <= item.startMin);
      if (col === -1) {
        col = colEnds.length;
        colEnds.push(0);
      }
      colEnds[col] = item.effEnd;
      item.seg.column = col;
      const bucket = byColumn.get(col) ?? [];
      bucket.push(item);
      byColumn.set(col, bucket);
    }
    const columnCount = colEnds.length;
    for (const item of cluster) {
      let span = 1;
      const col = item.seg.column ?? 0;
      while (col + span < columnCount) {
        const occupants = byColumn.get(col + span) ?? [];
        const blocked = occupants.some(
          (o) => o.startMin < item.effEnd && o.effEnd > item.startMin
        );
        if (blocked) break;
        span++;
      }
      item.seg.columnCount = columnCount;
      item.seg.columnSpan = span;
    }
  }
}
function packWeekRowLanes(segments, rowIndex, rowStart, timeZone) {
  const bars = segments.map((seg) => {
    const dayIndex = Math.round(
      (zonedStartOfDay(seg.day, timeZone).getTime() -
        zonedStartOfDay(rowStart, timeZone).getTime()) /
        (24 * 60 * 60 * 1e3)
    );
    return {
      seg,
      colStart: Math.max(0, Math.min(6, dayIndex)),
      colSpan: 1,
      isStart: seg.isStart,
      isEnd: seg.isEnd,
      lane: 0
    };
  });
  const merged = /* @__PURE__ */ new Map();
  for (const bar of bars) {
    const key = bar.seg.occurrence.key;
    const existing = merged.get(key);
    if (existing) {
      const start = Math.min(existing.colStart, bar.colStart);
      const end = Math.max(
        existing.colStart + existing.colSpan,
        bar.colStart + bar.colSpan
      );
      existing.colStart = start;
      existing.colSpan = end - start;
      existing.isStart = existing.isStart || bar.isStart;
      existing.isEnd = existing.isEnd || bar.isEnd;
    } else {
      merged.set(key, bar);
    }
  }
  const rowBars = Array.from(merged.values()).sort(
    (a, b) =>
      a.colStart - b.colStart ||
      b.colSpan - a.colSpan ||
      a.seg.occurrence.key.localeCompare(b.seg.occurrence.key)
  );
  const lanes = [];
  for (const bar of rowBars) {
    let lane = 0;
    for (;;) {
      lanes[lane] ??= new Array(7).fill(false);
      const row = lanes[lane];
      let free = true;
      for (let c = bar.colStart; c < bar.colStart + bar.colSpan; c++) {
        if (row[c]) {
          free = false;
          break;
        }
      }
      if (free) break;
      lane++;
    }
    for (let c = bar.colStart; c < bar.colStart + bar.colSpan; c++) {
      lanes[lane][c] = true;
    }
    bar.lane = lane;
  }
  return rowBars.map((bar) => ({
    ...bar.seg,
    isStart: bar.isStart,
    isEnd: bar.isEnd,
    continuesBefore: !bar.isStart,
    continuesAfter: !bar.isEnd,
    lane: bar.lane,
    rowIndex,
    colStart: bar.colStart,
    colSpan: bar.colSpan
  }));
}
function defaultEventOrder(a, b) {
  return (
    a.start.getTime() - b.start.getTime() ||
    b.end.getTime() -
      b.start.getTime() -
      (a.end.getTime() - a.start.getTime()) ||
    a.key.localeCompare(b.key)
  );
}
function buildEventIndex(events, visibleRange, opts) {
  const { timeZone, weekStartsOn } = opts;
  const order = opts.eventOrder ?? defaultEventOrder;
  const overrideTimes = /* @__PURE__ */ new Map();
  for (const event of events) {
    if (!event.recurringEventId || !event.originalStart) continue;
    let times = overrideTimes.get(event.recurringEventId);
    if (!times)
      overrideTimes.set(
        event.recurringEventId,
        (times = /* @__PURE__ */ new Set())
      );
    times.add(event.originalStart.getTime());
  }
  const occurrences = [];
  for (const event of events) {
    const replaced = overrideTimes.get(event.id);
    const custom = opts.getOccurrences?.(event, visibleRange, { timeZone });
    if (custom) {
      custom.forEach((occ, i) => {
        if (replaced?.has(occ.start.getTime())) return;
        if (!rangesIntersect({ start: occ.start, end: occ.end }, visibleRange))
          return;
        occurrences.push({
          key: `${event.id}::${occ.start.toISOString()}`,
          eventId: event.id,
          event,
          start: occ.start,
          end: occ.end,
          allDay: event.allDay ?? false,
          isRecurring: true,
          recurrenceIndex: i
        });
      });
      continue;
    }
    const expanded = expandRecurrence(event, visibleRange, { timeZone });
    occurrences.push(
      ...(replaced
        ? expanded.filter((occ) => !replaced.has(occ.start.getTime()))
        : expanded)
    );
  }
  occurrences.sort(order);
  const byDay = /* @__PURE__ */ new Map();
  const barSegmentsByRow = /* @__PURE__ */ new Map();
  const firstRowStart = startOfWeek(toZoned(visibleRange.start, timeZone), {
    weekStartsOn
  });
  for (const occurrence of occurrences) {
    const segments = segmentOccurrence(occurrence, visibleRange, timeZone);
    const bar = isBarOccurrence(occurrence, timeZone);
    for (const seg of segments) {
      const key = getDayKey(seg.day, timeZone);
      let bucket = byDay.get(key);
      if (!bucket) {
        bucket = { allDay: [], timed: [] };
        byDay.set(key, bucket);
      }
      if (bar) {
        bucket.allDay.push(seg);
        const rowIndex = Math.floor(
          differenceInCalendarDays(toZoned(seg.day, timeZone), firstRowStart) /
            7
        );
        const rowBucket = barSegmentsByRow.get(rowIndex) ?? [];
        rowBucket.push(seg);
        barSegmentsByRow.set(rowIndex, rowBucket);
      } else {
        bucket.timed.push(seg);
      }
    }
  }
  for (const bucket of byDay.values()) {
    packTimedSegments(bucket.timed);
  }
  const weekRows = [];
  for (const [rowIndex, segs] of barSegmentsByRow) {
    const rowStart = addWeeks(firstRowStart, rowIndex);
    weekRows.push({
      rowIndex,
      rowStart,
      bars: packWeekRowLanes(segs, rowIndex, rowStart, timeZone)
    });
  }
  weekRows.sort((a, b) => a.rowIndex - b.rowIndex);
  return { occurrences, byDay, weekRows };
}
function getRangeKey(range) {
  return `${range.start.getTime()}-${range.end.getTime()}`;
}
function flattenResources(resources, depth = 0) {
  const rows = [];
  for (const resource of resources) {
    rows.push({ resource, depth });
    if (resource.children?.length) {
      rows.push(...flattenResources(resource.children, depth + 1));
    }
  }
  return rows;
}
const DEFAULT_WEEKEND_DAYS = [0, 6];
function resolveOffDay(day, timeZone, config, defaultWeekendDays) {
  if (!config) return false;
  const resolved = config === true ? {} : config;
  const weekendDays =
    resolved.weekendDays ?? defaultWeekendDays ?? DEFAULT_WEEKEND_DAYS;
  const zoned = toZoned(day, timeZone);
  if (weekendDays.includes(zoned.getDay())) return true;
  if (resolved.dates?.length) {
    const key = getDayKey(day, timeZone);
    if (resolved.dates.some((date) => getDayKey(date, timeZone) === key)) {
      return true;
    }
  }
  return resolved.isOffDay?.(day) ?? false;
}
export {
  buildEventIndex,
  defaultEventOrder,
  eventsOverlap,
  flattenResources,
  getDayKey,
  getDayTotalMinutes,
  getRangeKey,
  getViewDateRange,
  isBarOccurrence,
  MIN_PACK_SLOT,
  packTimedSegments,
  packWeekRowLanes,
  rangesIntersect,
  resolveOffDay,
  segmentOccurrence,
  snapMinutes,
  spansMultipleDays,
  stepDate,
  toZoned,
  zonedStartOfDay
};
