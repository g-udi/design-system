'use client';
import { useControllableState } from '../../../../hooks/state/use-controllable-state.js';
import { useMemo } from 'react';
import { getDayKey, resolveOffDay, toZoned, zonedStartOfDay } from '../ganttModel.jsx';
import { addDays, addMinutes, addMonths, format, getWeek, startOfMonth, startOfQuarter, startOfWeek } from 'date-fns';
const DEFAULT_ZOOM_RANGE = { min: 0.5, max: 3 };
function useGanttTimeScale({
  timeZone,
  scale,
  interval,
  settings,
  range,
  rangeEndMs,
  viewConfig,
  metrics,
  todayDayKey
}) {
  const { units, groups, unitWidthRem } = useMemo(() => {
    const units2 = [];
    const groups2 = [];
    const todayStartMs = zonedStartOfDay(
      new Date(),
      timeZone
    ).getTime();
    if (scale === 'day') {
      const labelFormat =
        interval % 60 === 0 ? settings.i18n.formats.timeGutter : 'h:mm';
      let dayCursor = zonedStartOfDay(range.start, timeZone);
      while (dayCursor.getTime() < rangeEndMs) {
        const zonedDay = toZoned(dayCursor, timeZone);
        const nextDay = zonedStartOfDay(addDays(zonedDay, 1), timeZone);
        const dayMinutes = (nextDay.getTime() - dayCursor.getTime()) / 6e4;
        const dayOff = resolveOffDay(
          dayCursor,
          timeZone,
          viewConfig.offDays ?? true
        );
        let span = 0;
        for (let m = 0; m < dayMinutes; m += interval) {
          const time = addMinutes(zonedDay, m);
          const weight = Math.min(interval, dayMinutes - m) / interval;
          units2.push({
            key: `${getDayKey(dayCursor, timeZone)}-m${m}`,
            label: format(time, labelFormat, { locale: settings.locale }),
            ms: time.getTime(),
            weight,
            isOff: dayOff
          });
          span += weight;
        }
        groups2.push({
          key: getDayKey(dayCursor, timeZone),
          label: format(zonedDay, settings.i18n.formats.dayTitle, {
            locale: settings.locale
          }),
          span
        });
        dayCursor = nextDay;
      }
      return {
        units: units2,
        groups: groups2,
        unitWidthRem:
          metrics?.unitWidths?.day ?? Math.max(2.5, 5 * (interval / 60))
      };
    }
    if (scale === 'quarter') {
      let cursor2 = zonedStartOfDay(range.start, timeZone);
      while (cursor2.getTime() < rangeEndMs) {
        const zoned = toZoned(cursor2, timeZone);
        const next = zonedStartOfDay(addDays(zoned, 7), timeZone);
        const weight =
          (next.getTime() - cursor2.getTime()) / (7 * 24 * 60 * 6e4);
        units2.push({
          key: getDayKey(cursor2, timeZone),
          label: format(zoned, 'MMM d', { locale: settings.locale }),
          ms: cursor2.getTime(),
          weight,
          isToday:
            todayStartMs >= cursor2.getTime() && todayStartMs < next.getTime()
        });
        const monthKey = format(zoned, 'yyyy-MM');
        const lastGroup = groups2[groups2.length - 1];
        if (lastGroup && lastGroup.key === monthKey) {
          lastGroup.span += weight;
        } else {
          groups2.push({
            key: monthKey,
            label: format(zoned, 'MMMM', { locale: settings.locale }),
            span: weight
          });
        }
        cursor2 = next;
      }
      return {
        units: units2,
        groups: groups2,
        unitWidthRem: metrics?.unitWidths?.quarter ?? 8
      };
    }
    if (scale === 'year') {
      let cursor2 = startOfMonth(toZoned(range.start, timeZone));
      while (cursor2.getTime() < rangeEndMs) {
        const next = startOfMonth(addMonths(cursor2, 1));
        const weight = (next.getTime() - cursor2.getTime()) / (24 * 60 * 6e4);
        units2.push({
          key: format(cursor2, 'yyyy-MM'),
          label: format(cursor2, 'MMM', { locale: settings.locale }),
          ms: cursor2.getTime(),
          weight,
          isToday:
            todayStartMs >= cursor2.getTime() && todayStartMs < next.getTime()
        });
        const quarterStart = startOfQuarter(cursor2);
        const quarterKey = format(quarterStart, 'yyyy-QQQ');
        const lastGroup = groups2[groups2.length - 1];
        if (lastGroup && lastGroup.key === quarterKey) {
          lastGroup.span += weight;
        } else {
          groups2.push({
            key: quarterKey,
            label: format(quarterStart, 'QQQ yyyy', {
              locale: settings.locale
            }),
            span: weight
          });
        }
        cursor2 = next;
      }
      return {
        units: units2,
        groups: groups2,
        unitWidthRem: metrics?.unitWidths?.year ?? 10
      };
    }
    let cursor = zonedStartOfDay(range.start, timeZone);
    while (cursor.getTime() < rangeEndMs) {
      const zoned = toZoned(cursor, timeZone);
      const nextDay = zonedStartOfDay(addDays(zoned, 1), timeZone);
      const weight = (nextDay.getTime() - cursor.getTime()) / (24 * 60 * 6e4);
      units2.push({
        key: getDayKey(cursor, timeZone),
        label: format(zoned, 'EEE d', { locale: settings.locale }),
        ms: cursor.getTime(),
        weight,
        isToday: getDayKey(cursor, timeZone) === todayDayKey,
        isOff: resolveOffDay(cursor, timeZone, viewConfig.offDays ?? true)
      });
      const weekNumber = getWeek(zoned, {
        locale: settings.locale,
        weekStartsOn: settings.weekStartsOn
      });
      const weekStart = startOfWeek(zoned, {
        weekStartsOn: settings.weekStartsOn
      });
      const weekKey = `w-${format(weekStart, 'yyyy-MM-dd')}`;
      const lastGroup = groups2[groups2.length - 1];
      if (lastGroup && lastGroup.key === weekKey) {
        lastGroup.span += weight;
      } else {
        groups2.push({
          key: weekKey,
          label: `${settings.i18n.labels.week(weekNumber)} ${format(weekStart, 'MMM d', { locale: settings.locale })} - ${format(addDays(weekStart, 6), 'd', { locale: settings.locale })}`,
          span: weight
        });
      }
      cursor = nextDay;
    }
    return {
      units: units2,
      groups: groups2,
      unitWidthRem: metrics?.unitWidths?.[scale] ?? (scale === 'week' ? 10 : 4)
    };
  }, [
    scale,
    interval,
    range.start,
    rangeEndMs,
    timeZone,
    settings.i18n,
    settings.locale,
    settings.weekStartsOn,
    viewConfig.offDays,
    todayDayKey,
    metrics
  ]);
  const zoomRange = { ...DEFAULT_ZOOM_RANGE, ...viewConfig.zoomRange };
  const clampZoom = (value) =>
    Math.min(Math.max(value, zoomRange.min), zoomRange.max);
  const [zoomValue, setZoom] = useControllableState({ value: viewConfig.zoom, defaultValue: viewConfig.defaultZoom ?? 1, onChange: viewConfig.onZoomChange });
  const zoom = clampZoom(zoomValue);
  const setZoomValue = (next) => {
    const clamped = clampZoom(next);
    setZoom(clamped);
  };
  const canZoomIn = zoom < zoomRange.max - 1e-9;
  const canZoomOut = zoom > zoomRange.min + 1e-9;
  const trackRemWidth = units.length * unitWidthRem * zoom;
  const trackWidth = `${trackRemWidth}rem`;
  const uniform = units.every(
    (unit) => Math.abs(unit.weight - units[0].weight) < 1e-9
  );
  const totalWeight = units.reduce((sum, unit) => sum + unit.weight, 0);
  const unitFractions = useMemo(() => {
    let acc = 0;
    return units.map((unit) => {
      const start = acc / totalWeight;
      acc += unit.weight;
      return { unit, start, width: unit.weight / totalWeight };
    });
  }, [units, totalWeight]);
  const resolveHintStop = useMemo(() => {
    return (fraction) => {
      for (let i = 0; i < unitFractions.length; i++) {
        const { unit, start, width } = unitFractions[i];
        if (fraction < start + width || i === unitFractions.length - 1) {
          return {
            index: i,
            center: start + width / 2,
            ms: unit.ms,
            endMs: unitFractions[i + 1]?.unit.ms ?? unit.ms
          };
        }
      }
      return null;
    };
  }, [unitFractions]);
  const groupBoundaries = useMemo(() => {
    const fractions = [];
    let acc = 0;
    for (let i = 0; i < groups.length - 1; i++) {
      acc += groups[i].span;
      fractions.push(acc / totalWeight);
    }
    return fractions;
  }, [groups, totalWeight]);
  return { units, groups, zoomRange, clampZoom, zoom, setZoomValue, canZoomIn, canZoomOut, trackRemWidth, trackWidth, uniform, unitFractions, resolveHintStop, groupBoundaries };
}
export { useGanttTimeScale };
