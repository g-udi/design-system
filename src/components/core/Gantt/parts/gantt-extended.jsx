'use client';
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore
} from 'react';
import { mergeGanttI18n } from './gantt-i18n-extended.jsx';
import {
  buildEventIndex,
  defaultEventOrder,
  eventsOverlap,
  findResource,
  getGanttDateRange,
  getRangeKey,
  stepGanttDate,
  toZoned
} from './gantt-lib-extended.jsx';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
const DEFAULT_INTERACTIONS = {
  drag: true,
  resize: true,
  selectSlot: true
};
const MAX_RANGE_WINDOW = 12;
const DEFAULT_SCHEDULE_MODE = 'multiple';
const DEFAULT_ROW_ALIGN = 'start';
function resolveScheduleMode(node, scheduleMode) {
  return node?.scheduleMode ?? scheduleMode ?? DEFAULT_SCHEDULE_MODE;
}
const EMPTY_SELECTION = { eventKeys: [], slot: null };
function resolveSettings(options) {
  const {
    // strip state pairs; the rest flows into settings
    events: _e,
    defaultEvents: _de,
    scale: _v,
    defaultScale: _dv,
    date: _d,
    defaultDate: _dd,
    selection: _s,
    defaultSelection: _ds,
    interactions: _i,
    defaultInteractions: _di,
    loading: _l,
    ...rest
  } = options;
  const getEventPriority =
    options.getEventPriority ?? ((event) => event.priority ?? 0);
  return {
    ...rest,
    timeZone:
      options.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: options.locale,
    // locale-first default: a de/fr locale gets Monday weeks without also
    // having to set weekStartsOn; an explicit weekStartsOn always wins
    weekStartsOn:
      options.weekStartsOn ?? options.locale?.options?.weekStartsOn ?? 0,
    slotDuration: options.slotDuration ?? 30,
    snapDuration: options.snapDuration ?? 15,
    i18n: mergeGanttI18n(options.i18n),
    rangeBounds: options.rangeBounds,
    resources: options.resources ?? [],
    overlap: options.overlap ?? 'allow',
    getEventPriority,
    // priority-aware default: higher getEventPriority packs/orders first
    eventOrder:
      options.eventOrder ??
      ((a, b) =>
        getEventPriority(b.event) - getEventPriority(a.event) ||
        defaultEventOrder(a, b)),
    getOccurrences: options.getOccurrences
  };
}
const warned = new Set();
function warnOnce(key, message) {
  if (process.env.NODE_ENV !== 'production' && !warned.has(key)) {
    warned.add(key);
    console.warn(`[gantt] ${message}`);
  }
}
function createGanttStore(initial) {
  let options = initial;
  let settings = resolveSettings(initial);
  let settingsVersion = 0;
  const listeners = new Set();
  const internal = {
    scale: initial.defaultScale ?? 'day',
    date: initial.defaultDate ?? new Date(),
    events: initial.defaultEvents ?? [],
    selection: initial.defaultSelection ?? EMPTY_SELECTION,
    interactions: { ...DEFAULT_INTERACTIONS, ...initial.defaultInteractions },
    drag: null,
    slotDraft: null,
    /** Whole extra periods rendered on each side (infinite scroll). */
    rangeWindow: { before: 0, after: 0 },
    /** Visible-center instant reported by the view; drives the nav title. */
    viewportCenter: null
  };
  let snapshot = null;
  let indexCache = null;
  let lastEmittedRangeKey = null;
  let lastAnchorChangeWasSlide = false;
  const invalidate = () => {
    snapshot = null;
  };
  const notify = () => {
    listeners.forEach((listener) => listener());
    emitRangeIfChanged();
  };
  const getState = () => {
    if (snapshot) return snapshot;
    const scale = options.scale ?? internal.scale;
    const date = options.date ?? internal.date;
    const rangeOpts = {
      timeZone: settings.timeZone,
      weekStartsOn: settings.weekStartsOn
    };
    const { visibleRange: baseRange, activeRange } = getGanttDateRange(
      scale,
      date,
      rangeOpts
    );
    const { before, after } = internal.rangeWindow;
    let visibleRange = baseRange;
    if (before > 0 || after > 0) {
      let earlier = date;
      for (let i = 0; i < before; i++) {
        earlier = stepGanttDate(scale, earlier, -1, rangeOpts);
      }
      let later = date;
      for (let i = 0; i < after; i++) {
        later = stepGanttDate(scale, later, 1, rangeOpts);
      }
      visibleRange = {
        start: getGanttDateRange(scale, earlier, rangeOpts).visibleRange.start,
        end: getGanttDateRange(scale, later, rangeOpts).visibleRange.end
      };
    }
    snapshot = {
      scale,
      date,
      visibleRange,
      activeRange,
      events: options.events ?? internal.events,
      selection: options.selection ?? internal.selection,
      interactions: options.interactions
        ? { ...DEFAULT_INTERACTIONS, ...options.interactions }
        : internal.interactions,
      loading: options.loading ?? false,
      drag: internal.drag,
      slotDraft: internal.slotDraft,
      viewportCenter: internal.viewportCenter
    };
    return snapshot;
  };
  const emitRangeIfChanged = () => {
    if (!settings.onRangeChange) return;
    const state = getState();
    const key = `${state.scale}:${getRangeKey(state.visibleRange)}:${settings.timeZone}`;
    if (key === lastEmittedRangeKey) return;
    lastEmittedRangeKey = key;
    settings.onRangeChange({
      range: state.visibleRange,
      activeRange: state.activeRange,
      scale: state.scale,
      date: state.date,
      timeZone: settings.timeZone
    });
  };
  const setField = (key, value) => {
    const controlled = options[key] !== void 0;
    if (key === 'date' || key === 'scale') {
      const current = getState()[key];
      const same =
        key === 'date'
          ? current.getTime() === value.getTime()
          : current === value;
      if (same) return;
      internal.rangeWindow = { before: 0, after: 0 };
      internal.viewportCenter = null;
      lastAnchorChangeWasSlide = false;
      invalidate();
    }
    if (!controlled) {
      internal[key] = value;
      invalidate();
    }
    const callbacks = {
      scale: settings.onScaleChange,
      date: settings.onDateChange,
      events: settings.onEventsChange,
      selection: settings.onSelectionChange,
      interactions: settings.onInteractionsChange
    };
    callbacks[key]?.(value);
    if (!controlled) notify();
  };
  const applyProposedUpdate = (update, extra) => {
    const result = settings.onEventUpdate?.(update);
    if (result === false) return false;
    const adjusted =
      result && typeof result === 'object'
        ? {
            start: result.start ?? update.start,
            end: result.end ?? update.end,
            allDay: result.allDay ?? update.allDay
          }
        : { start: update.start, end: update.end, allDay: update.allDay };
    if (update.resourceId !== void 0) adjusted.resourceId = update.resourceId;
    const merged = extra ? { ...extra, ...adjusted } : adjusted;
    const events = getState().events;
    const next = events.map((event) =>
      event.id === update.event.id ? { ...event, ...merged } : event
    );
    setField('events', next);
    return true;
  };
  const getIndex = () => {
    const state = getState();
    const rangeKey = getRangeKey(state.visibleRange);
    if (
      indexCache &&
      indexCache.events === state.events &&
      indexCache.rangeKey === rangeKey &&
      indexCache.timeZone === settings.timeZone
    ) {
      return indexCache.index;
    }
    const index = buildEventIndex(state.events, state.visibleRange, {
      timeZone: settings.timeZone,
      eventOrder: settings.eventOrder,
      getOccurrences: settings.getOccurrences
    });
    indexCache = {
      events: state.events,
      rangeKey,
      timeZone: settings.timeZone,
      index
    };
    return index;
  };
  const clampToBounds = (date) => {
    const bounds = settings.rangeBounds;
    if (!bounds) return date;
    if (bounds.min && date.getTime() < bounds.min.getTime()) return bounds.min;
    if (bounds.max && date.getTime() > bounds.max.getTime()) return bounds.max;
    return date;
  };
  const api = {
    next() {
      const state = getState();
      setField(
        'date',
        clampToBounds(
          stepGanttDate(state.scale, state.date, 1, {
            timeZone: settings.timeZone
          })
        )
      );
    },
    prev() {
      const state = getState();
      setField(
        'date',
        clampToBounds(
          stepGanttDate(state.scale, state.date, -1, {
            timeZone: settings.timeZone
          })
        )
      );
    },
    today() {
      setField('date', clampToBounds(new Date()));
    },
    goTo(date) {
      setField('date', clampToBounds(date));
    },
    setScale(scale) {
      setField('scale', scale);
    },
    getEvents() {
      return getState().events;
    },
    getEvent(id) {
      return getState().events.find((event) => event.id === id);
    },
    setEvents(events) {
      setField('events', events);
    },
    addEvent(event) {
      setField('events', [...getState().events, event]);
    },
    updateEvent(id, patch) {
      const event = api.getEvent(id);
      if (!event) return;
      const merged = { ...event, ...patch };
      const timingChanged =
        patch.start !== void 0 ||
        patch.end !== void 0 ||
        patch.allDay !== void 0;
      if (timingChanged && settings.onEventUpdate) {
        const rest = { ...patch };
        delete rest.start;
        delete rest.end;
        delete rest.allDay;
        applyProposedUpdate(
          {
            event: merged,
            occurrence: null,
            start: merged.start,
            end: merged.end,
            allDay: merged.allDay ?? false,
            source: 'api'
          },
          Object.keys(rest).length > 0 ? rest : void 0
        );
        return;
      }
      setField(
        'events',
        getState().events.map((e) => (e.id === id ? merged : e))
      );
    },
    removeEvent(id) {
      setField(
        'events',
        getState().events.filter((event) => event.id !== id)
      );
    },
    getOccurrences(range) {
      if (!range) return getIndex().occurrences;
      const state = getState();
      const within =
        range.start >= state.visibleRange.start &&
        range.end <= state.visibleRange.end;
      if (within) {
        return getIndex().occurrences.filter((occ) =>
          eventsOverlap(occ, range)
        );
      }
      return buildEventIndex(state.events, range, {
        timeZone: settings.timeZone,
        eventOrder: settings.eventOrder,
        getOccurrences: settings.getOccurrences
      }).occurrences;
    },
    findOverlapping({ start, end, excludeEventId }) {
      return api
        .getOccurrences({ start, end })
        .filter((occ) => occ.eventId !== excludeEventId);
    },
    select(partial) {
      const current = getState().selection;
      setField('selection', {
        eventKeys: partial.eventKeys ?? current.eventKeys,
        slot: partial.slot !== void 0 ? partial.slot : current.slot
      });
    },
    selectEvent(key, opts) {
      const current = getState().selection;
      const eventKeys = opts?.additive
        ? current.eventKeys.includes(key)
          ? current.eventKeys.filter((k) => k !== key)
          : [...current.eventKeys, key]
        : [key];
      setField('selection', { ...current, eventKeys });
    },
    clearSelection() {
      setField('selection', EMPTY_SELECTION);
    },
    setInteractions(patch) {
      setField('interactions', { ...getState().interactions, ...patch });
    },
    getVisibleRange() {
      return getState().visibleRange;
    },
    getActiveRange() {
      return getState().activeRange;
    },
    toZoned(date) {
      return toZoned(date, settings.timeZone);
    }
  };
  const internals = {
    getIndex,
    setDrag(drag) {
      internal.drag = drag;
      invalidate();
      notify();
    },
    setSlotDraft(draft) {
      internal.slotDraft = draft;
      invalidate();
      notify();
    },
    setViewportCenter(date) {
      const prev = internal.viewportCenter;
      if (prev?.getTime() === date?.getTime()) return;
      internal.viewportCenter = date;
      invalidate();
      notify();
    },
    applyProposedUpdate,
    getSettingsVersion() {
      return settingsVersion;
    },
    extendRange(direction) {
      const state = getState();
      const bounds = settings.rangeBounds;
      if (
        direction === 'before' &&
        bounds?.min &&
        state.visibleRange.start.getTime() <= bounds.min.getTime()
      ) {
        return false;
      }
      if (
        direction === 'after' &&
        bounds?.max &&
        state.visibleRange.end.getTime() >= bounds.max.getTime()
      ) {
        return false;
      }
      const cap = Math.max(1, settings.maxRangeWindow ?? MAX_RANGE_WINDOW);
      const { before, after } = internal.rangeWindow;
      const grow = direction === 'before' ? before < cap : after < cap;
      if (grow) {
        internal.rangeWindow =
          direction === 'before'
            ? { before: before + 1, after }
            : { before, after: after + 1 };
      } else {
        const next = stepGanttDate(
          state.scale,
          state.date,
          direction === 'before' ? -1 : 1,
          {
            timeZone: settings.timeZone
          }
        );
        if (options.date !== void 0) {
          settings.onDateChange?.(next);
          return false;
        }
        internal.date = next;
        lastAnchorChangeWasSlide = true;
        settings.onDateChange?.(next);
      }
      invalidate();
      notify();
      return true;
    },
    didAnchorSlide() {
      return lastAnchorChangeWasSlide;
    }
  };
  const instance = {
    getState,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    api,
    get settings() {
      return settings;
    },
    internals
  };
  const STATE_KEYS = [
    'events',
    'scale',
    'date',
    'selection',
    'interactions',
    'loading'
  ];
  const SETTINGS_KEYS = [
    'timeZone',
    'locale',
    'weekStartsOn',
    'slotDuration',
    'snapDuration',
    'i18n',
    'rangeBounds',
    'activation',
    'maxRangeWindow',
    'resources',
    'overlap',
    'enforceCanDrop',
    'getEventPriority',
    'eventOrder',
    'getOccurrences'
  ];
  return {
    instance,
    setOptions(next) {
      const prev = options;
      options = next;
      if (
        prev.date?.getTime() !== next.date?.getTime() ||
        prev.scale !== next.scale
      ) {
        internal.rangeWindow = { before: 0, after: 0 };
        lastAnchorChangeWasSlide = false;
      }
      let changed = false;
      for (const key of STATE_KEYS) {
        if (prev[key] !== next[key]) {
          changed = true;
          break;
        }
      }
      let settingsChanged = false;
      for (const key of SETTINGS_KEYS) {
        if (prev[key] !== next[key]) {
          settingsChanged = true;
          break;
        }
      }
      settings = resolveSettings(next);
      if (settingsChanged) {
        settingsVersion++;
        changed = true;
      }
      if (changed) invalidate();
      return changed;
    },
    notify,
    emitRangeIfChanged
  };
}
function useGanttState(options = {}) {
  const [store] = useState(() => createGanttStore(options));
  const changed = store.setOptions(options);
  const changedRef = useRef(false);
  if (changed) changedRef.current = true;
  useLayoutEffect(() => {
    if (changedRef.current) {
      changedRef.current = false;
      store.notify();
    }
  });
  useEffect(() => {
    store.emitRangeIfChanged();
  }, [store]);
  return store.instance;
}
const GanttContext = createContext(null);
function useGantt() {
  const instance = useContext(GanttContext);
  if (!instance) {
    throw new Error('useGantt must be used within <Gantt>');
  }
  return instance;
}
function useGanttSelector(selector, options) {
  const contextInstance = useContext(GanttContext);
  const instance = options?.calendar ?? contextInstance;
  if (!instance) {
    throw new Error(
      'useGanttSelector needs an <Gantt> ancestor or an explicit `calendar` option'
    );
  }
  const isEqual = options?.isEqual ?? Object.is;
  const lastRef = useRef(null);
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const getSnapshot = () => {
    const next = selectorRef.current(instance.getState());
    if (lastRef.current && isEqual(lastRef.current.value, next)) {
      return lastRef.current.value;
    }
    lastRef.current = { value: next };
    return next;
  };
  return useSyncExternalStore(instance.subscribe, getSnapshot, getSnapshot);
}
function useGanttScale() {
  const instance = useGantt();
  const scale = useGanttSelector((state) => state.scale);
  return { scale, setScale: instance.api.setScale };
}
function useGanttNavigation() {
  const instance = useGantt();
  const { settings } = instance;
  const slice = useGanttSelector(
    (state) => ({
      date: state.date,
      scale: state.scale,
      visibleRange: state.visibleRange,
      activeRange: state.activeRange,
      viewportCenter: state.viewportCenter
    }),
    {
      isEqual: (a, b) =>
        a.date.getTime() === b.date.getTime() &&
        a.scale === b.scale &&
        a.viewportCenter?.getTime() === b.viewportCenter?.getTime() &&
        getRangeKey(a.visibleRange) === getRangeKey(b.visibleRange)
    }
  );
  useGanttSettingsVersion(instance);
  const now = new Date();
  const titleDate = slice.viewportCenter ?? slice.date;
  const titleActive = slice.viewportCenter
    ? getGanttDateRange(slice.scale, slice.viewportCenter, {
        timeZone: settings.timeZone,
        weekStartsOn: settings.weekStartsOn
      }).activeRange
    : slice.activeRange;
  return {
    date: slice.date,
    title: settings.i18n.functions.formatTitle(slice.scale, {
      date: toZoned(titleDate, settings.timeZone),
      activeRange: titleActive,
      visibleRange: slice.visibleRange,
      locale: settings.locale
    }),
    visibleRange: slice.visibleRange,
    activeRange: slice.activeRange,
    next: instance.api.next,
    prev: instance.api.prev,
    today: instance.api.today,
    goTo: instance.api.goTo,
    isToday: now >= slice.activeRange.start && now < slice.activeRange.end
  };
}
function useGanttSelection() {
  const instance = useGantt();
  const selection = useGanttSelector((state) => state.selection);
  return {
    selection,
    select: instance.api.select,
    selectEvent: instance.api.selectEvent,
    clearSelection: instance.api.clearSelection
  };
}
function useGanttInteractions() {
  const instance = useGantt();
  const interactions = useGanttSelector((state) => state.interactions);
  return { interactions, setInteractions: instance.api.setInteractions };
}
function useGanttOccurrences(range) {
  const instance = useGantt();
  return useGanttSelector(() => instance.api.getOccurrences(range), {
    calendar: instance,
    // keys encode id + start only, so end edits (resize-end) and payload
    // changes (title, color, progress) must be compared explicitly
    isEqual: (a, b) =>
      a.length === b.length &&
      a.every(
        (occ, i) =>
          occ.key === b[i]?.key &&
          occ.end.getTime() === b[i].end.getTime() &&
          occ.event === b[i].event
      )
  });
}
function useGanttNodeSchedules(nodeId) {
  const settings = useGanttSettings();
  const viewConfig = useGanttViewConfig();
  const occurrences = useGanttOccurrences();
  const node = findResource(settings.resources, nodeId);
  const schedules = occurrences.filter(
    (occurrence) => occurrence.event.resourceId === nodeId
  );
  const conflicts = [];
  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      if (eventsOverlap(schedules[i], schedules[j])) {
        conflicts.push([schedules[i], schedules[j]]);
      }
    }
  }
  return {
    node,
    scheduleMode: resolveScheduleMode(node, viewConfig.scheduleMode),
    schedules,
    conflicts
  };
}
function useGanttSettingsVersion(instance) {
  return useSyncExternalStore(
    instance.subscribe,
    instance.internals.getSettingsVersion,
    instance.internals.getSettingsVersion
  );
}
function useGanttSettings() {
  const instance = useGantt();
  useGanttSettingsVersion(instance);
  return instance.settings;
}
function resolveTimelineLines(value) {
  if (value === 'none') return { vertical: null, horizontal: null };
  if (value === 'vertical') return { vertical: 'solid', horizontal: null };
  if (value === 'both' || value === void 0) {
    return { vertical: 'solid', horizontal: 'solid' };
  }
  const stroke = (line) =>
    line === false ? null : line === true || line === void 0 ? 'solid' : line;
  return {
    vertical: stroke(value.vertical),
    horizontal: stroke(value.horizontal)
  };
}
const DEFAULT_VIEW_CONFIG = {
  nowIndicator: true,
  interval: 60,
  scrollbars: 'custom',
  displayScheduleHint: false,
  initialCenter: 'now',
  displayCreateTaskHint: false,
  dragCreate: false,
  zoomControl: true,
  wheelZoom: true,
  navButtonVariant: 'ghost',
  navButtonSize: 'sm',
  timelineLines: 'vertical',
  barLabel: 'inside',
  offscreenIndicators: true,
  infiniteScroll: true,
  stickyNav: false,
  rowCheckboxes: true,
  parentScheduling: false,
  summaryBars: true,
  baselineBars: true,
  dependencyLines: true,
  scheduleMode: 'multiple',
  rowAlign: 'start'
};
const GanttViewConfigContext = createContext(DEFAULT_VIEW_CONFIG);
function useGanttViewConfig() {
  return useContext(GanttViewConfigContext);
}
const VIEW_CONFIG_KEYS = [
  'nowIndicator',
  'interval',
  'scrollbars',
  'displayScheduleHint',
  'initialCenter',
  'displayCreateTaskHint',
  'dragCreate',
  'zoomControl',
  'wheelZoom',
  'navButtonVariant',
  'navButtonSize',
  'offDays',
  'columns',
  'columnsMenu',
  'treePanel',
  'metrics',
  'timelineLines',
  'barLabel',
  'offscreenIndicators',
  'infiniteScroll',
  'zoomRange',
  'stickyNav',
  'rowCheckboxes',
  'selectedRows',
  'onSelectedRowsChange',
  'collapsedGroups',
  'defaultCollapsedGroups',
  'onCollapsedGroupsChange',
  'zoom',
  'defaultZoom',
  'onZoomChange',
  'parentScheduling',
  'summaryBars',
  'baselineBars',
  'dependencyLines',
  'scheduleMode',
  'rowAlign',
  'classNames',
  'renderEvent',
  'renderEventMenu',
  'renderResourceLabel',
  'renderResourceMenu',
  'renderNoResources',
  'renderDragPreview',
  'renderResizeIndicator',
  'renderScheduleHint',
  'renderSummary',
  'renderBaseline',
  'renderRowBaseline',
  'getSummaryProgress'
];
const OPTION_KEYS = [
  'events',
  'defaultEvents',
  'scale',
  'defaultScale',
  'date',
  'defaultDate',
  'selection',
  'defaultSelection',
  'interactions',
  'defaultInteractions',
  'loading',
  'timeZone',
  'locale',
  'weekStartsOn',
  'slotDuration',
  'snapDuration',
  'i18n',
  'rangeBounds',
  'activation',
  'maxRangeWindow',
  'resources',
  'overlap',
  'enforceCanDrop',
  'getEventPriority',
  'eventOrder',
  'getOccurrences',
  'onEventClick',
  'onEventDoubleClick',
  'onEventUpdate',
  'canDropEvent',
  'onSlotClick',
  'onSelectSlot',
  'canSelectSlot',
  'onCreateTask',
  'canCreateTask',
  'onResourceClick',
  'onResourceDoubleClick',
  'onRangeChange',
  'onScaleChange',
  'onDateChange',
  'onSelectionChange',
  'onInteractionsChange',
  'onEventsChange',
  'onResourceReorder',
  'onResourceReorderReject',
  'canReorderResource'
];
function shallowEqualRecord(a, b) {
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;
  for (const key of aKeys) {
    if (!Object.is(a[key], b[key])) return false;
  }
  return true;
}
function splitOptions(props) {
  const options = {};
  const viewConfig = { ...DEFAULT_VIEW_CONFIG };
  const rest = {};
  for (const [key, value] of Object.entries(props)) {
    if (OPTION_KEYS.includes(key)) options[key] = value;
    else if (VIEW_CONFIG_KEYS.includes(key)) {
      if (value !== void 0) viewConfig[key] = value;
    } else rest[key] = value;
  }
  return {
    options,
    viewConfig,
    rest
  };
}
function Gantt({
  calendar,
  apiRef,
  className,
  asChild = false,
  children,
  ...props
}) {
  const { options, viewConfig, rest } = splitOptions(props);
  const viewConfigRef = useRef(viewConfig);
  if (!shallowEqualRecord(viewConfigRef.current, viewConfig)) {
    viewConfigRef.current = viewConfig;
  }
  const stableViewConfig = viewConfigRef.current;
  if (calendar && Object.keys(options).length > 0) {
    warnOnce(
      'calendar-and-options',
      'both `calendar` and option props were passed; option props are ignored when adopting an instance.'
    );
  }
  const own = useGanttState(calendar ? {} : options);
  const instance = calendar ?? own;
  useEffect(() => {
    if (apiRef) apiRef.current = instance.api;
  }, [apiRef, instance]);
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <GanttContext.Provider value={instance}>
      <GanttViewConfigContext.Provider value={stableViewConfig}>
        <Comp
          data-slot='gantt'
          className={cn(
            'text-ui-foreground flex min-h-0 min-w-0 flex-col text-xs',
            className
          )}
          {...rest}
        >
          {/* Slottable keeps the announcer sibling legal when asChild slots
       the consumer element (Slot.Root allows one non-Slottable child). */}
          <Slot.Slottable>{children}</Slot.Slottable>
          <div
            data-slot='gantt-announcer'
            aria-live='polite'
            className='sr-only'
          />
        </Comp>
      </GanttViewConfigContext.Provider>
    </GanttContext.Provider>
  );
}
export {
  DEFAULT_ROW_ALIGN,
  DEFAULT_SCHEDULE_MODE,
  DEFAULT_VIEW_CONFIG,
  Gantt,
  GanttContext,
  GanttViewConfigContext,
  resolveScheduleMode,
  resolveTimelineLines,
  useGantt,
  useGanttInteractions,
  useGanttNavigation,
  useGanttNodeSchedules,
  useGanttOccurrences,
  useGanttScale,
  useGanttSelection,
  useGanttSelector,
  useGanttSettings,
  useGanttSettingsVersion,
  useGanttState,
  useGanttViewConfig
};
