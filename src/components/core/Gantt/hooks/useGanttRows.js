'use client';
import { useMemo, useRef } from 'react';
import { resolveScheduleMode, useGanttSelector } from '../Gantt.jsx';
import { getBaselineVariance, getLaneKey, packTimedSegments, resolveEventBaseline } from '../ganttModel.jsx';
import { lowestFreeLane, laneBlockRem } from '../ganttViewModel.js';
function useGanttRows({
  settings,
  viewConfig,
  rows,
  rangeEndMs,
  rangeStartMs,
  occurrences,
  laneHeightRem,
  laneGapRem,
  minRowRem,
  rowPaddingRem
}) {
  const descendantIds = useMemo(() => {
    const map = new Map();
    const walk = (resource) => {
      const ids = (resource.children ?? []).flatMap((child) => [
        child.id,
        ...walk(child)
      ]);
      map.set(resource.id, ids);
      return ids;
    };
    settings.resources.forEach(walk);
    return map;
  }, [settings.resources]);
  const allEvents = useGanttSelector((state) => state.events);
  const subtreeProgress = useMemo(() => {
    if (viewConfig.getSummaryProgress) {
      const byResource = new Map();
      for (const ev of allEvents) {
        if (!ev.resourceId) continue;
        const list = byResource.get(ev.resourceId);
        if (list) list.push(ev);
        else byResource.set(ev.resourceId, [ev]);
      }
      const map2 = new Map();
      for (const row of rows) {
        if (!row.isGroup) continue;
        const events = [];
        for (const id of descendantIds.get(row.resource.id) ?? []) {
          const list = byResource.get(id);
          if (list) events.push(...list);
        }
        map2.set(
          row.resource.id,
          viewConfig.getSummaryProgress({ resource: row.resource, events })
        );
      }
      return map2;
    }
    const perResource = new Map();
    for (const ev of allEvents) {
      if (!ev.resourceId) continue;
      let agg = perResource.get(ev.resourceId);
      if (!agg) {
        agg = { weighted: 0, total: 0, saw: false };
        perResource.set(ev.resourceId, agg);
      }
      const dur = Math.max(ev.end.getTime() - ev.start.getTime(), 1);
      agg.total += dur;
      if (typeof ev.progress === 'number') {
        agg.saw = true;
        agg.weighted += ev.progress * dur;
      }
    }
    const map = new Map();
    for (const row of rows) {
      if (!row.isGroup) continue;
      let weighted = 0;
      let weightTotal = 0;
      let saw = false;
      for (const id of descendantIds.get(row.resource.id) ?? []) {
        const agg = perResource.get(id);
        if (!agg) continue;
        weightTotal += agg.total;
        if (agg.saw) {
          saw = true;
          weighted += agg.weighted;
        }
      }
      map.set(
        row.resource.id,
        saw && weightTotal > 0
          ? Math.min(Math.max(Math.round(weighted / weightTotal), 0), 100)
          : null
      );
    }
    return map;
  }, [rows, allEvents, descendantIds, viewConfig]);
  const laneMemory = useRef(new Map());
  const scheduleMode = viewConfig.scheduleMode;
  const draftLayout = useGanttSelector(
    (state) => {
      const slotDraft = state.slotDraft;
      if (!slotDraft?.resourceId) return null;
      return {
        resourceId: slotDraft.resourceId,
        startMs: slotDraft.start.getTime(),
        endMs: slotDraft.end.getTime()
      };
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.resourceId === b.resourceId &&
          a.startMs === b.startMs &&
          a.endMs === b.endMs)
    }
  );
  const baseRowBars = useMemo(() => {
    const map = new Map();
    const previousLanes = laneMemory.current;
    const nextLanes = new Map();
    const totalMin = (rangeEndMs - rangeStartMs) / 6e4;
    const byResource = new Map();
    const envelopes = new Map();
    for (const occ of occurrences) {
      const rid = occ.event.resourceId;
      if (!rid) continue;
      const list = byResource.get(rid);
      if (list) list.push(occ);
      else byResource.set(rid, [occ]);
      const fromMin = Math.max((occ.start.getTime() - rangeStartMs) / 6e4, 0);
      const toMin = Math.min(
        (occ.end.getTime() - rangeStartMs) / 6e4,
        totalMin
      );
      const env = envelopes.get(rid);
      if (!env) {
        envelopes.set(rid, { fromMin, toMin });
      } else {
        env.fromMin = Math.min(env.fromMin, fromMin);
        env.toMin = Math.max(env.toMin, toMin);
      }
    }
    const baselinesByResource = new Map();
    const latestEndByResource = new Map();
    if (viewConfig.baselineBars) {
      for (const event of allEvents) {
        if (!event.resourceId) continue;
        const endMsActual = event.end.getTime();
        const prev = latestEndByResource.get(event.resourceId);
        if (prev === void 0 || endMsActual > prev) {
          latestEndByResource.set(event.resourceId, endMsActual);
        }
        const baseline = resolveEventBaseline(event);
        if (!baseline) continue;
        const startMs = baseline.start.getTime();
        const endMs = baseline.end.getTime();
        const visible = baseline.milestone
          ? startMs >= rangeStartMs && startMs <= rangeEndMs
          : startMs < rangeEndMs && endMs > rangeStartMs;
        if (!visible) continue;
        const list = baselinesByResource.get(event.resourceId);
        const entry = { event, baseline };
        if (list) list.push(entry);
        else baselinesByResource.set(event.resourceId, [entry]);
      }
    }
    for (const row of rows) {
      const mine = byResource.get(row.resource.id) ?? [];
      const segments = mine.map((occurrence) => ({
        occurrence,
        day: new Date(rangeStartMs),
        isStart: occurrence.start.getTime() >= rangeStartMs,
        isEnd: occurrence.end.getTime() <= rangeEndMs,
        continuesBefore: occurrence.start.getTime() < rangeStartMs,
        continuesAfter: occurrence.end.getTime() > rangeEndMs,
        startMin: Math.max(
          (occurrence.start.getTime() - rangeStartMs) / 6e4,
          0
        ),
        endMin: Math.min(
          (occurrence.end.getTime() - rangeStartMs) / 6e4,
          totalMin
        )
      }));
      const mode = resolveScheduleMode(row.resource, scheduleMode);
      packTimedSegments(segments, { mode, preferredLanes: previousLanes });
      for (const segment of segments) {
        nextLanes.set(getLaneKey(segment.occurrence), {
          lane: segment.column ?? 0,
          startMs: segment.occurrence.start.getTime(),
          endMs: segment.occurrence.end.getTime()
        });
      }
      const laneCount = segments.reduce(
        (max, segment) => Math.max(max, (segment.column ?? 0) + 1),
        1
      );
      const plans = baselinesByResource.get(row.resource.id);
      const laneByEvent = plans
        ? new Map(
            segments.map((segment) => [
              segment.occurrence.eventId,
              segment.column ?? 0
            ])
          )
        : null;
      const baselines = plans
        ? plans.flatMap(({ event, baseline }) => {
            let lane = laneByEvent?.get(event.id);
            if (lane === void 0) {
              if (mode === 'single' || segments.length === 0) {
                lane = 0;
              } else {
                const free = lowestFreeLane(
                  segments,
                  baseline.start.getTime(),
                  baseline.end.getTime()
                );
                if (free >= laneCount) return [];
                lane = free;
              }
            }
            return [
              {
                event,
                baseline,
                startMin: Math.max(
                  (baseline.start.getTime() - rangeStartMs) / 6e4,
                  0
                ),
                endMin: Math.min(
                  (baseline.end.getTime() - rangeStartMs) / 6e4,
                  totalMin
                ),
                lane,
                variance: getBaselineVariance(event) ?? 'on-time'
              }
            ];
          })
        : [];
      let from = Infinity;
      let to = -Infinity;
      for (const segment of segments) {
        from = Math.min(from, (segment.startMin ?? 0) / totalMin);
        to = Math.max(to, (segment.endMin ?? 0) / totalMin);
      }
      let summary = null;
      if (row.isGroup && segments.length === 0 && viewConfig.summaryBars) {
        let sumFrom = Infinity;
        let sumTo = -Infinity;
        for (const id of descendantIds.get(row.resource.id) ?? []) {
          const env = envelopes.get(id);
          if (!env) continue;
          sumFrom = Math.min(sumFrom, env.fromMin / totalMin);
          sumTo = Math.max(sumTo, env.toMin / totalMin);
        }
        if (sumTo > sumFrom) {
          summary = {
            from: sumFrom,
            to: sumTo,
            // all-time completion (matches a consumer's tree rollup), not the
            // visible-range slice - task progress is independent of scroll
            progress: subtreeProgress.get(row.resource.id) ?? null
          };
        }
      }
      let rowBaseline = null;
      if (viewConfig.baselineBars) {
        const plan = resolveEventBaseline(row.resource);
        if (plan) {
          const planStartMs = plan.start.getTime();
          const planEndMs = plan.end.getTime();
          const planVisible = plan.milestone
            ? planStartMs >= rangeStartMs && planStartMs <= rangeEndMs
            : planStartMs < rangeEndMs && planEndMs > rangeStartMs;
          if (planVisible) {
            const ids = row.isGroup
              ? [row.resource.id, ...(descendantIds.get(row.resource.id) ?? [])]
              : [row.resource.id];
            let latest;
            for (const id of ids) {
              const end = latestEndByResource.get(id);
              if (end !== void 0 && (latest === void 0 || end > latest)) {
                latest = end;
              }
            }
            rowBaseline = {
              baseline: plan,
              startMin: Math.max((planStartMs - rangeStartMs) / 6e4, 0),
              endMin: Math.min((planEndMs - rangeStartMs) / 6e4, totalMin),
              variance:
                latest === void 0
                  ? null
                  : latest > planEndMs
                    ? 'late'
                    : latest < planEndMs
                      ? 'early'
                      : 'on-time'
            };
          }
        }
      }
      const blockRem = laneBlockRem(laneCount, laneHeightRem, laneGapRem);
      const heightRem = Math.max(minRowRem, blockRem + 2 * rowPaddingRem);
      const laneOffsetRem = (heightRem - blockRem) / 2;
      map.set(row.resource.id, {
        segments,
        laneCount,
        baselines,
        rowBaseline,
        draftLane: null,
        scheduleMode: mode,
        heightRem,
        laneOffsetRem,
        bandRem: laneHeightRem + laneOffsetRem * 2,
        extent:
          segments.length > 0
            ? {
                from,
                to,
                color: segments[0].occurrence.event.color,
                label:
                  segments.length === 1
                    ? segments[0].occurrence.event.title
                    : settings.i18n.labels.events(segments.length),
                startMs: Math.min(
                  ...segments.map((s) => s.occurrence.start.getTime())
                )
              }
            : summary
              ? {
                  from: summary.from,
                  to: summary.to,
                  label: row.resource.title,
                  startMs:
                    rangeStartMs + summary.from * (rangeEndMs - rangeStartMs)
                }
              : null,
        summary
      });
    }
    laneMemory.current = nextLanes;
    return map;
  }, [
    rows,
    occurrences,
    allEvents,
    rangeStartMs,
    rangeEndMs,
    settings.i18n,
    viewConfig.summaryBars,
    viewConfig.baselineBars,
    descendantIds,
    subtreeProgress,
    laneHeightRem,
    rowPaddingRem,
    laneGapRem,
    minRowRem,
    scheduleMode
  ]);
  return { allEvents, draftLayout, baseRowBars };
}
export { useGanttRows };
