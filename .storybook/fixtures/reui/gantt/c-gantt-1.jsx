// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useMemo, useRef, useState } from 'react';
import { Gantt } from '../../../../src/components/core/Gantt/parts/gantt-extended.jsx';
import {
  GanttNav,
  GanttToolbar
} from '../../../../src/components/core/Gantt/parts/gantt-nav-extended.jsx';
import { GanttView } from '../../../../src/components/core/Gantt/parts/gantt-view-extended.jsx';
import { addDays, startOfDay, startOfWeek } from 'date-fns';
import { de, es, fr, ja } from 'date-fns/locale';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../../../src/components/core/Tabs/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const RESOURCES = [
  {
    id: 'planning',
    title: 'Planning',
    children: [
      { id: 'brief', title: 'Project brief' },
      { id: 'scope', title: 'Scope review' }
    ]
  },
  {
    id: 'design',
    title: 'Design',
    children: [
      { id: 'wireframes', title: 'Wireframes' },
      { id: 'visual-design', title: 'Visual design' }
    ]
  },
  {
    id: 'build',
    title: 'Build',
    children: [
      { id: 'frontend', title: 'Frontend' },
      { id: 'backend', title: 'Backend' },
      { id: 'qa', title: 'QA pass' },
      { id: 'release-prep', title: 'Release prep' }
    ]
  },
  {
    id: 'launch',
    title: 'Launch',
    children: [
      { id: 'docs', title: 'Docs' },
      { id: 'marketing-site', title: 'Marketing site' },
      { id: 'announcement', title: 'Announcement' }
    ]
  }
];
const RESOURCE_TITLES = new Map(
  RESOURCES.flatMap((group) => group.children ?? []).map((leaf) => [
    leaf.id,
    leaf.title
  ])
);
function buildBars(anchor) {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 });
  const day = (dayOffset) => addDays(week, dayOffset);
  const bar = (resourceId, title, startOffset, days, color, progress) => ({
    id: `bar-${resourceId}`,
    title,
    start: day(startOffset),
    end: day(startOffset + days),
    allDay: true,
    color,
    resourceId,
    progress
  });
  return [
    bar('brief', 'Project brief', -9, 3, 'var(--color-blue-500)', 100),
    bar('scope', 'Scope review', -6, 2, 'var(--color-sky-500)', 100),
    bar('wireframes', 'Wireframes', -4, 4, 'var(--color-violet-500)', 80),
    bar('visual-design', 'Visual design', 0, 5, 'var(--color-purple-500)', 35),
    bar('frontend', 'Frontend', 3, 7, 'var(--color-emerald-500)', 10),
    bar('backend', 'Backend', 5, 6, 'var(--color-teal-500)'),
    bar('qa', 'QA pass', 12, 4, 'var(--color-amber-500)')
  ];
}
const LOCALES = [
  {
    id: 'en',
    label: 'English',
    locale: void 0,
    i18n: void 0
  },
  {
    id: 'de',
    label: 'Deutsch',
    locale: de,
    i18n: {
      labels: {
        today: 'Heute',
        scheduleHint: 'Zum Planen klicken',
        reorder: 'Neu anordnen',
        scales: {
          day: 'Tag',
          week: 'Woche',
          month: 'Monat',
          quarter: 'Quartal',
          year: 'Jahr'
        }
      }
    }
  },
  {
    id: 'fr',
    label: 'Fran\xE7ais',
    locale: fr,
    i18n: {
      labels: {
        today: "Aujourd'hui",
        scheduleHint: 'Cliquer pour planifier',
        reorder: 'R\xE9organiser',
        scales: {
          day: 'Jour',
          week: 'Semaine',
          month: 'Mois',
          quarter: 'Trimestre',
          year: 'Ann\xE9e'
        }
      }
    }
  },
  {
    id: 'es',
    label: 'Espa\xF1ol',
    locale: es,
    i18n: {
      labels: {
        today: 'Hoy',
        scheduleHint: 'Clic para programar',
        reorder: 'Reordenar',
        scales: {
          day: 'D\xEDa',
          week: 'Semana',
          month: 'Mes',
          quarter: 'Trimestre',
          year: 'A\xF1o'
        }
      }
    }
  },
  {
    id: 'ja',
    label: '\u65E5\u672C\u8A9E',
    locale: ja,
    i18n: {
      labels: {
        today: '\u4ECA\u65E5',
        scheduleHint:
          '\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u4E88\u5B9A\u3092\u8FFD\u52A0',
        reorder: '\u4E26\u3079\u66FF\u3048',
        scales: {
          day: '\u65E5',
          week: '\u9031',
          month: '\u6708',
          quarter: '\u56DB\u534A\u671F',
          year: '\u5E74'
        }
      }
    }
  }
];
const TIME_ZONES = [
  { id: 'local', label: 'Browser' },
  { id: 'ny', label: 'New York', value: 'America/New_York' },
  { id: 'london', label: 'London', value: 'Europe/London' },
  { id: 'tokyo', label: 'Tokyo', value: 'Asia/Tokyo' },
  { id: 'kolkata', label: 'Kolkata', value: 'Asia/Kolkata' }
];
const SETTINGS_DEFAULTS = {
  rowCheckboxes: true,
  summaryBars: true,
  zoomControl: true,
  offscreenIndicators: true,
  infiniteScroll: true,
  nowIndicator: true,
  offDays: false,
  dragCreate: true,
  displayScheduleHint: true,
  barLabel: 'inside',
  timelineLines: 'vertical',
  interactions: { drag: true, resize: true, selectSlot: true },
  localeId: 'en',
  timeZoneId: 'local'
};
function SettingSwitch({ id, label, checked, onCheckedChange }) {
  return (
    <div className='flex items-center justify-between gap-4 py-1'>
      <Label htmlFor={id} className='font-normal'>
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
function SettingRadio({ id, value, label }) {
  return (
    <div className='flex items-center gap-2 py-0.5'>
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className='font-normal'>
        {label}
      </Label>
    </div>
  );
}
function SettingSelect({ id, label, value, options, onValueChange }) {
  return (
    <div className='flex items-center justify-between gap-4 py-1'>
      <Label htmlFor={id} className='font-normal'>
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          aria-label='Choose an option'
          id={id}
          size='sm'
          className='w-36'
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
function SettingsMenu({
  rowCheckboxes,
  onRowCheckboxesChange,
  summaryBars,
  onSummaryBarsChange,
  zoomControl,
  onZoomControlChange,
  offscreenIndicators,
  onOffscreenIndicatorsChange,
  infiniteScroll,
  onInfiniteScrollChange,
  nowIndicator,
  onNowIndicatorChange,
  offDays,
  onOffDaysChange,
  dragCreate,
  onDragCreateChange,
  displayScheduleHint,
  onDisplayScheduleHintChange,
  barLabel,
  onBarLabelChange,
  timelineLines,
  onTimelineLinesChange,
  interactions,
  onInteractionsChange,
  localeId,
  onLocaleChange,
  timeZoneId,
  onTimeZoneChange,
  onReset
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm'>
          <RegistryIcon
            lucide='SettingsIcon'
            className='size-4'
            aria-hidden='true'
          />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-80 p-0'>
        {/* Tabs keep every group one screen tall - no menu scrolling */}
        <Tabs defaultValue='display'>
          <div className='border-b p-2'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='display'>Display</TabsTrigger>
              <TabsTrigger value='behavior'>Behavior</TabsTrigger>
              <TabsTrigger value='style'>Style</TabsTrigger>
              <TabsTrigger value='region'>Region</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='display' className='space-y-0.5 p-3'>
            <SettingSwitch
              id='gantt1-row-checkboxes'
              label='Row checkboxes'
              checked={rowCheckboxes}
              onCheckedChange={onRowCheckboxesChange}
            />
            <SettingSwitch
              id='gantt1-summary-bars'
              label='Summary bars'
              checked={summaryBars}
              onCheckedChange={onSummaryBarsChange}
            />
            <SettingSwitch
              id='gantt1-zoom-control'
              label='Zoom control'
              checked={zoomControl}
              onCheckedChange={onZoomControlChange}
            />
            <SettingSwitch
              id='gantt1-offscreen-chips'
              label='Off-screen chips'
              checked={offscreenIndicators}
              onCheckedChange={onOffscreenIndicatorsChange}
            />
            <SettingSwitch
              id='gantt1-infinite-scroll'
              label='Infinite scroll'
              checked={infiniteScroll}
              onCheckedChange={onInfiniteScrollChange}
            />
            <SettingSwitch
              id='gantt1-now-indicator'
              label='Now indicator'
              checked={nowIndicator}
              onCheckedChange={onNowIndicatorChange}
            />
            <SettingSwitch
              id='gantt1-off-days'
              label='Mark off days'
              checked={offDays}
              onCheckedChange={onOffDaysChange}
            />
          </TabsContent>
          <TabsContent value='behavior' className='space-y-0.5 p-3'>
            <SettingSwitch
              id='gantt1-drag'
              label='Drag to move'
              checked={interactions.drag}
              onCheckedChange={(checked) =>
                onInteractionsChange({ ...interactions, drag: checked })
              }
            />
            <SettingSwitch
              id='gantt1-resize'
              label='Resize'
              checked={interactions.resize}
              onCheckedChange={(checked) =>
                onInteractionsChange({ ...interactions, resize: checked })
              }
            />
            <SettingSwitch
              id='gantt1-select-slot'
              label='Select slot'
              checked={interactions.selectSlot}
              onCheckedChange={(checked) =>
                onInteractionsChange({ ...interactions, selectSlot: checked })
              }
            />
            <SettingSwitch
              id='gantt1-drag-create'
              label='Drag to create'
              checked={dragCreate}
              onCheckedChange={onDragCreateChange}
            />
            <SettingSwitch
              id='gantt1-schedule-hint'
              label='Schedule hint'
              checked={displayScheduleHint}
              onCheckedChange={onDisplayScheduleHintChange}
            />
          </TabsContent>
          <TabsContent value='style' className='space-y-4 p-3'>
            <div className='space-y-1.5'>
              <div className='text-ui-muted-foreground text-xs font-medium'>
                Bar label
              </div>
              <RadioGroup
                value={barLabel}
                onValueChange={(value) => onBarLabelChange(value)}
              >
                <SettingRadio
                  id='gantt1-label-inside'
                  value='inside'
                  label='Inside'
                />
                <SettingRadio
                  id='gantt1-label-outside'
                  value='outside'
                  label='Outside'
                />
                <SettingRadio
                  id='gantt1-label-auto'
                  value='auto'
                  label='Auto'
                />
              </RadioGroup>
            </div>
            <div className='space-y-1.5'>
              <div className='text-ui-muted-foreground text-xs font-medium'>
                Grid lines
              </div>
              <RadioGroup
                value={timelineLines}
                onValueChange={(value) => onTimelineLinesChange(value)}
              >
                <SettingRadio
                  id='gantt1-lines-vertical'
                  value='vertical'
                  label='Vertical'
                />
                <SettingRadio
                  id='gantt1-lines-both'
                  value='both'
                  label='Both'
                />
                <SettingRadio
                  id='gantt1-lines-none'
                  value='none'
                  label='None'
                />
              </RadioGroup>
            </div>
          </TabsContent>
          <TabsContent value='region' className='space-y-2 p-3'>
            <SettingSelect
              id='gantt1-language'
              label='Language'
              value={localeId}
              options={LOCALES.map((entry) => ({
                value: entry.id,
                label: entry.label
              }))}
              onValueChange={onLocaleChange}
            />
            <SettingSelect
              id='gantt1-timezone'
              label='Time zone'
              value={timeZoneId}
              options={TIME_ZONES.map((entry) => ({
                value: entry.id,
                label: entry.label
              }))}
              onValueChange={onTimeZoneChange}
            />
            <p className='text-ui-muted-foreground text-xs leading-relaxed'>
              Language switches the date-fns locale, the scale names, and the
              week start. Time zone re-anchors every bar.
            </p>
          </TabsContent>
        </Tabs>
        <div className='border-t p-2'>
          <Button
            variant='outline'
            size='sm'
            className='w-full'
            onClick={onReset}
          >
            <RegistryIcon
              lucide='RotateCcwIcon'
              className='size-3.5'
              aria-hidden='true'
            />
            Reset to defaults
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export function Pattern() {
  const bars = useMemo(() => buildBars(/* @__PURE__ */ new Date()), []);
  const apiRef = useRef(null);
  const [rowCheckboxes, setRowCheckboxes] = useState(
    SETTINGS_DEFAULTS.rowCheckboxes
  );
  const [summaryBars, setSummaryBars] = useState(SETTINGS_DEFAULTS.summaryBars);
  const [zoomControl, setZoomControl] = useState(SETTINGS_DEFAULTS.zoomControl);
  const [offscreenIndicators, setOffscreenIndicators] = useState(
    SETTINGS_DEFAULTS.offscreenIndicators
  );
  const [infiniteScroll, setInfiniteScroll] = useState(
    SETTINGS_DEFAULTS.infiniteScroll
  );
  const [nowIndicator, setNowIndicator] = useState(
    SETTINGS_DEFAULTS.nowIndicator
  );
  const [offDays, setOffDays] = useState(SETTINGS_DEFAULTS.offDays);
  const [dragCreate, setDragCreate] = useState(SETTINGS_DEFAULTS.dragCreate);
  const [displayScheduleHint, setDisplayScheduleHint] = useState(
    SETTINGS_DEFAULTS.displayScheduleHint
  );
  const [barLabel, setBarLabel] = useState(SETTINGS_DEFAULTS.barLabel);
  const [timelineLines, setTimelineLines] = useState(
    SETTINGS_DEFAULTS.timelineLines
  );
  const [interactions, setInteractions] = useState(
    SETTINGS_DEFAULTS.interactions
  );
  const [localeId, setLocaleId] = useState(SETTINGS_DEFAULTS.localeId);
  const [timeZoneId, setTimeZoneId] = useState(SETTINGS_DEFAULTS.timeZoneId);
  const activeLocale =
    LOCALES.find((entry) => entry.id === localeId) ?? LOCALES[0];
  const activeTimeZone =
    TIME_ZONES.find((entry) => entry.id === timeZoneId) ?? TIME_ZONES[0];
  const resetSettings = () => {
    setRowCheckboxes(SETTINGS_DEFAULTS.rowCheckboxes);
    setSummaryBars(SETTINGS_DEFAULTS.summaryBars);
    setZoomControl(SETTINGS_DEFAULTS.zoomControl);
    setOffscreenIndicators(SETTINGS_DEFAULTS.offscreenIndicators);
    setInfiniteScroll(SETTINGS_DEFAULTS.infiniteScroll);
    setNowIndicator(SETTINGS_DEFAULTS.nowIndicator);
    setOffDays(SETTINGS_DEFAULTS.offDays);
    setDragCreate(SETTINGS_DEFAULTS.dragCreate);
    setDisplayScheduleHint(SETTINGS_DEFAULTS.displayScheduleHint);
    setBarLabel(SETTINGS_DEFAULTS.barLabel);
    setTimelineLines(SETTINGS_DEFAULTS.timelineLines);
    setInteractions(SETTINGS_DEFAULTS.interactions);
    setLocaleId(SETTINGS_DEFAULTS.localeId);
    setTimeZoneId(SETTINGS_DEFAULTS.timeZoneId);
  };
  const canSelectSlot = (slot) =>
    !!slot.resourceId &&
    !(apiRef.current?.getEvents() ?? []).some(
      (event) => event.resourceId === slot.resourceId
    );
  const handleSelectSlot = (slot) => {
    const api = apiRef.current;
    if (!api || !slot.resourceId) return;
    api.addEvent({
      id: `scheduled-${slot.resourceId}`,
      title: RESOURCE_TITLES.get(slot.resourceId) ?? 'New schedule',
      start: slot.start,
      end: slot.end,
      allDay: true,
      color: 'var(--color-indigo-500)',
      resourceId: slot.resourceId
    });
  };
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          <Gantt
            defaultEvents={bars}
            resources={RESOURCES}
            defaultScale='month'
            apiRef={apiRef}
            locale={activeLocale.locale}
            i18n={activeLocale.i18n}
            timeZone={activeTimeZone.value}
            treePanel={{ width: 200 }}
            rowCheckboxes={rowCheckboxes}
            summaryBars={summaryBars}
            zoomControl={zoomControl}
            offscreenIndicators={offscreenIndicators}
            infiniteScroll={infiniteScroll}
            nowIndicator={nowIndicator}
            offDays={offDays}
            dragCreate={dragCreate}
            displayScheduleHint={displayScheduleHint}
            barLabel={barLabel}
            timelineLines={timelineLines}
            interactions={interactions}
            onInteractionsChange={setInteractions}
            canSelectSlot={canSelectSlot}
            onSelectSlot={handleSelectSlot}
            className='h-[520px] w-full'
          >
            {/* one bordered header row, same look as the plain GanttNav:
       the row owns the border and end padding so the toolbar never
       sits glued to the edge */}
            <div className='flex flex-wrap items-center gap-2 border-b pe-3'>
              <GanttNav className='min-w-0 flex-1 border-b-0' />
              <GanttToolbar>
                <SettingsMenu
                  rowCheckboxes={rowCheckboxes}
                  onRowCheckboxesChange={setRowCheckboxes}
                  summaryBars={summaryBars}
                  onSummaryBarsChange={setSummaryBars}
                  zoomControl={zoomControl}
                  onZoomControlChange={setZoomControl}
                  offscreenIndicators={offscreenIndicators}
                  onOffscreenIndicatorsChange={setOffscreenIndicators}
                  infiniteScroll={infiniteScroll}
                  onInfiniteScrollChange={setInfiniteScroll}
                  nowIndicator={nowIndicator}
                  onNowIndicatorChange={setNowIndicator}
                  offDays={offDays}
                  onOffDaysChange={setOffDays}
                  dragCreate={dragCreate}
                  onDragCreateChange={setDragCreate}
                  displayScheduleHint={displayScheduleHint}
                  onDisplayScheduleHintChange={setDisplayScheduleHint}
                  barLabel={barLabel}
                  onBarLabelChange={setBarLabel}
                  timelineLines={timelineLines}
                  onTimelineLinesChange={setTimelineLines}
                  interactions={interactions}
                  onInteractionsChange={setInteractions}
                  localeId={localeId}
                  onLocaleChange={setLocaleId}
                  timeZoneId={timeZoneId}
                  onTimeZoneChange={setTimeZoneId}
                  onReset={resetSettings}
                />
              </GanttToolbar>
            </div>
            <GanttView />
          </Gantt>
        </CardContent>
      </Card>
    </div>
  );
}
