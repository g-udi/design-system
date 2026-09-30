import { expandRecurrence } from './gantt-recurrence-extended.jsx';
import { TZDate } from '@date-fns/tz';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInMinutes,
  format,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear
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
function getGanttDateRange(scale, date, opts) {
  const { timeZone, weekStartsOn } = opts;
  const zoned = toZoned(date, timeZone);
  if (scale === 'week') {
    const start2 = startOfWeek(zoned, { weekStartsOn });
    const range2 = { start: start2, end: addWeeks(start2, 1) };
    return { activeRange: range2, visibleRange: range2 };
  }
  if (scale === 'month') {
    const start2 = startOfMonth(zoned);
    const range2 = { start: start2, end: startOfMonth(addMonths(zoned, 1)) };
    return { activeRange: range2, visibleRange: range2 };
  }
  if (scale === 'quarter') {
    const quarterStart = startOfQuarter(zoned);
    const quarterEnd = startOfQuarter(addMonths(zoned, 3));
    const start2 = startOfWeek(quarterStart, { weekStartsOn });
    let end = startOfWeek(quarterEnd, { weekStartsOn });
    if (end < quarterEnd) end = addWeeks(end, 1);
    return {
      activeRange: { start: quarterStart, end: quarterEnd },
      visibleRange: { start: start2, end }
    };
  }
  if (scale === 'year') {
    const start2 = startOfYear(zoned);
    const range2 = { start: start2, end: startOfYear(addYears(zoned, 1)) };
    return { activeRange: range2, visibleRange: range2 };
  }
  const start = startOfDay(zoned);
  const range = { start, end: addDays(start, 1) };
  return { activeRange: range, visibleRange: range };
}
function stepGanttDate(scale, date, direction, opts) {
  const zoned = toZoned(date, opts.timeZone);
  if (scale === 'week') return addWeeks(zoned, direction);
  if (scale === 'month') return addMonths(zoned, direction);
  if (scale === 'quarter') return addMonths(zoned, direction * 3);
  if (scale === 'year') return addYears(zoned, direction);
  return addDays(zoned, direction);
}
function rangesIntersect(a, b) {
  return a.start < b.end && a.end > b.start;
}
function eventsOverlap(a, b) {
  return a.start < b.end && a.end > b.start;
}
function occurrenceIntersects(occ, range) {
  if (occ.end.getTime() === occ.start.getTime()) {
    return occ.start >= range.start && occ.start < range.end;
  }
  return rangesIntersect(occ, range);
}
function spansMultipleDays(occ) {
  return occ.end.getTime() - occ.start.getTime() > 24 * 60 * 60 * 1e3;
}
function resolveEventBaseline(subject) {
  if (!subject.baselineStart || !subject.baselineEnd || subject.recurrence) {
    return null;
  }
  const startMs = subject.baselineStart.getTime();
  const endMs = subject.baselineEnd.getTime();
  if (endMs < startMs) return null;
  return {
    start: subject.baselineStart,
    end: subject.baselineEnd,
    milestone: endMs === startMs
  };
}
function buildDependencyPath(from, to, opts) {
  const { clearance, laneStep, arrowSize } = opts;
  const lineEndX = to.x - arrowSize;
  const arrow = `M ${to.x} ${to.y} L ${lineEndX} ${to.y - arrowSize * 0.6} L ${lineEndX} ${to.y + arrowSize * 0.6} Z`;
  if (lineEndX >= from.x + clearance) {
    return {
      line: `M ${from.x} ${from.y} H ${from.x + clearance} V ${to.y} H ${lineEndX}`,
      arrow
    };
  }
  const midY = to.y >= from.y ? from.y + laneStep : from.y - laneStep;
  return {
    line: `M ${from.x} ${from.y} H ${from.x + clearance} V ${midY} H ${to.x - clearance} V ${to.y} H ${lineEndX}`,
    arrow
  };
}
function getBaselineVariance(event) {
  const baseline = resolveEventBaseline(event);
  if (!baseline) return null;
  const deltaMs = event.end.getTime() - baseline.end.getTime();
  return deltaMs > 0 ? 'late' : deltaMs < 0 ? 'early' : 'on-time';
}
function getLaneKey(occurrence) {
  return `${occurrence.eventId}::${occurrence.recurrenceIndex ?? 0}`;
}
function packTimedSegments(segments, options = {}) {
  if (segments.length === 0) return;
  if (options.mode === 'single') {
    for (const seg of segments) {
      seg.column = 0;
      seg.columnCount = 1;
      seg.columnSpan = 1;
    }
    return;
  }
  const preferredLanes = options.preferredLanes;
  const items = segments
    .map((seg) => {
      const startMin = seg.startMin ?? 0;
      const endMin = seg.endMin ?? startMin;
      return {
        seg,
        startMin,
        effEnd: Math.max(endMin, startMin + MIN_PACK_SLOT),
        lane: -1
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
    const laneIntervals = [];
    const isFree = (lane, item) =>
      !(laneIntervals[lane] ?? []).some(
        (iv) => iv.from < item.effEnd && iv.to > item.startMin
      );
    const claim = (lane, item) => {
      while (laneIntervals.length <= lane) laneIntervals.push([]);
      const interval = { from: item.startMin, to: item.effEnd };
      laneIntervals[lane].push(interval);
      item.lane = lane;
      item.interval = interval;
    };
    const release = (item) => {
      const occupants = laneIntervals[item.lane] ?? [];
      const at = occupants.indexOf(item.interval);
      if (at >= 0) occupants.splice(at, 1);
    };
    const pending = [];
    for (const item of cluster) {
      const memo = preferredLanes?.get(getLaneKey(item.seg.occurrence));
      const untouched =
        memo !== void 0 &&
        memo.startMs === item.seg.occurrence.start.getTime() &&
        memo.endMs === item.seg.occurrence.end.getTime();
      if (untouched && memo.lane >= 0 && isFree(memo.lane, item)) {
        claim(memo.lane, item);
      } else {
        pending.push(item);
      }
    }
    for (const item of pending) {
      let lane = 0;
      while (!isFree(lane, item)) lane++;
      claim(lane, item);
    }
    const byLane = [...cluster].sort(
      (a, b) => a.lane - b.lane || a.startMin - b.startMin
    );
    for (const item of byLane) {
      if (item.lane === 0) continue;
      let lane = 0;
      while (lane < item.lane && !isFree(lane, item)) lane++;
      if (lane < item.lane) {
        release(item);
        claim(lane, item);
      }
    }
  }
  const used = [...new Set(items.map((item) => item.lane))].sort(
    (a, b) => a - b
  );
  const compacted = new Map(used.map((lane, index) => [lane, index]));
  const columnCount = used.length;
  for (const item of items) {
    item.lane = compacted.get(item.lane) ?? 0;
    item.seg.column = item.lane;
    item.seg.columnCount = columnCount;
  }
  for (const cluster of clusters) {
    for (const item of cluster) {
      let span = 1;
      while (item.lane + span < columnCount) {
        const blocked = cluster.some(
          (other) =>
            other !== item &&
            other.lane === item.lane + span &&
            other.startMin < item.effEnd &&
            other.effEnd > item.startMin
        );
        if (blocked) break;
        span++;
      }
      item.seg.columnSpan = span;
    }
  }
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
  const { timeZone } = opts;
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
        if (
          !occurrenceIntersects(
            { start: occ.start, end: occ.end },
            visibleRange
          )
        )
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
  return { occurrences };
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
function findResource(resources, id) {
  for (const resource of resources) {
    if (resource.id === id) return resource;
    const found = resource.children?.length
      ? findResource(resource.children, id)
      : null;
    if (found) return found;
  }
  return null;
}
function reorderResources(resources, resourceId, parentId, index) {
  let moved = null;
  const strip = (nodes) =>
    nodes.flatMap((node) => {
      if (node.id === resourceId) {
        moved = node;
        return [];
      }
      if (!node.children?.length) return [node];
      return [{ ...node, children: strip(node.children) }];
    });
  const stripped = strip(resources);
  if (!moved) return null;
  const contains = (node, id) =>
    node.id === id || !!node.children?.some((child) => contains(child, id));
  if (parentId !== null && contains(moved, parentId)) return null;
  const insert = (nodes) => {
    if (parentId === null) {
      const next2 = [...nodes];
      next2.splice(Math.min(Math.max(index, 0), next2.length), 0, moved);
      return next2;
    }
    return nodes.map((node) => {
      if (node.id === parentId) {
        const children = [...(node.children ?? [])];
        children.splice(
          Math.min(Math.max(index, 0), children.length),
          0,
          moved
        );
        return { ...node, children };
      }
      if (!node.children?.length) return node;
      return { ...node, children: insert(node.children) };
    });
  };
  const next = insert(stripped);
  if (parentId !== null) {
    const flat = flattenResources(next);
    if (!flat.some(({ resource }) => resource.id === resourceId)) return null;
  }
  return next;
}
const DEFAULT_WEEKEND_DAYS = [0, 6];
function resolveOffDay(day, timeZone, config) {
  if (!config) return false;
  const resolved = config === true ? {} : config;
  const weekendDays = resolved.weekendDays ?? DEFAULT_WEEKEND_DAYS;
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
  buildDependencyPath,
  buildEventIndex,
  defaultEventOrder,
  eventsOverlap,
  findResource,
  flattenResources,
  getBaselineVariance,
  getDayKey,
  getDayTotalMinutes,
  getGanttDateRange,
  getLaneKey,
  getRangeKey,
  MIN_PACK_SLOT,
  occurrenceIntersects,
  packTimedSegments,
  rangesIntersect,
  reorderResources,
  resolveEventBaseline,
  resolveOffDay,
  snapMinutes,
  spansMultipleDays,
  stepGanttDate,
  toZoned,
  zonedStartOfDay
};
