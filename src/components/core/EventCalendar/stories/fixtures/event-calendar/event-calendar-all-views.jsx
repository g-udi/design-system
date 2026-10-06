'use client';
import { useMemo, useRef, useState } from 'react';
import { EventCalendar } from '@gaudi/design-system/core/EventCalendar';
import { EventCalendarContent } from '@gaudi/design-system/core/EventCalendar';
import {
  EventCalendarNav,
  EventCalendarToolbar
} from '@gaudi/design-system/core/EventCalendar';
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  setHours,
  startOfDay,
  startOfWeek
} from 'date-fns';
import { de, es, fr, ja } from 'date-fns/locale';
import {
  AvatarRoot as Avatar,
  AvatarFallback
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import { Label } from '@gaudi/design-system/core/Field';
import {
  PopoverPrimitive as Popover,
  PopoverContentPrimitive as PopoverContent,
  PopoverTriggerPrimitive as PopoverTrigger
} from '@gaudi/design-system/core/Popover';
import {
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@gaudi/design-system/core/Tabs';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const TEAM = [
  { id: 'alex', title: 'Alex', color: 'var(--color-blue-500)' },
  { id: 'mia', title: 'Mia', color: 'var(--color-violet-500)' },
  { id: 'sam', title: 'Sam', color: 'var(--color-emerald-500)' }
];
function buildEvents(anchor) {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 });
  const at = (dayOffset, hour, minute = 0) =>
    addMinutes(setHours(addDays(week, dayOffset), hour), minute);
  const day = (dayOffset) => addDays(week, dayOffset);
  return [
    {
      id: 'team-sync',
      title: 'Team sync',
      start: at(1, 9, 0),
      end: at(1, 9, 30),
      resourceId: 'alex'
    },
    {
      id: 'design-review',
      title: 'Design review',
      start: at(2, 11, 0),
      end: at(2, 12, 0),
      resourceId: 'mia',
      color: 'var(--color-violet-500)'
    },
    {
      id: 'product-demo',
      title: 'Product demo',
      start: at(3, 15, 0),
      end: at(3, 16, 0),
      resourceId: 'sam',
      color: 'var(--color-emerald-500)'
    },
    {
      id: 'roadmap-planning',
      title: 'Roadmap planning',
      start: at(4, 10, 0),
      end: at(4, 11, 30),
      resourceId: 'alex',
      color: 'var(--color-indigo-500)'
    },
    {
      id: 'client-call',
      title: 'Client call',
      start: at(5, 14, 0),
      end: at(5, 15, 0),
      resourceId: 'mia',
      color: 'var(--color-amber-500)'
    },
    {
      id: 'team-offsite',
      title: 'Team offsite',
      start: day(4),
      end: day(6),
      allDay: true,
      color: 'var(--color-rose-500)'
    },
    {
      id: 'sprint-planning',
      title: 'Sprint planning',
      start: at(9, 9, 30),
      end: at(9, 10, 30),
      resourceId: 'sam',
      color: 'var(--color-blue-500)'
    },
    {
      id: 'quarterly-review',
      title: 'Quarterly review',
      start: at(17, 13, 0),
      end: at(17, 14, 30),
      resourceId: 'alex',
      color: 'var(--color-cyan-500)'
    }
  ];
}
function renderEventContent({ occurrence }) {
  const { event } = occurrence;
  if (event.id === 'design-review') {
    return (
      <>
        <span className='flex shrink-0 -space-x-1'>
          <Avatar className='ring-ui-background size-4 ring-1'>
            <AvatarFallback className='bg-violet-500 text-xs font-semibold text-white'>
              M
            </AvatarFallback>
          </Avatar>
          <Avatar className='ring-ui-background size-4 ring-1'>
            <AvatarFallback className='bg-sky-500 text-xs font-semibold text-white'>
              A
            </AvatarFallback>
          </Avatar>
        </span>
        <span className='truncate font-medium'>{event.title}</span>
      </>
    );
  }
  if (event.id === 'client-call') {
    return (
      <span className='flex w-full min-w-0 items-center gap-1.5'>
        <span
          aria-hidden
          className='-me-0.5 size-1.5 shrink-0 rounded-full bg-(--ec-event-color)'
        />
        <span className='truncate font-medium'>{event.title}</span>
        <span className='ms-auto shrink-0 rounded bg-(--ec-event-color)/25 px-1 text-xs font-semibold'>
          {differenceInMinutes(occurrence.end, occurrence.start)}m
        </span>
      </span>
    );
  }
  return void 0;
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
        allDay: 'Ganzt\xE4gig',
        noEvents: 'Keine Termine',
        more: (count) => `+${count} weitere`
      },
      viewNames: {
        month: 'Monat',
        week: 'Woche',
        day: 'Tag',
        days: (count) => `${count} Tage`,
        agenda: 'Agenda',
        resource: 'Zeitraster'
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
        allDay: 'Journ\xE9e enti\xE8re',
        noEvents: 'Aucun \xE9v\xE9nement',
        more: (count) => `+${count} autres`
      },
      viewNames: {
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour',
        days: (count) => `${count} jours`,
        agenda: 'Agenda',
        resource: 'Grille horaire'
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
        allDay: 'Todo el d\xEDa',
        noEvents: 'Sin eventos',
        more: (count) => `+${count} m\xE1s`
      },
      viewNames: {
        month: 'Mes',
        week: 'Semana',
        day: 'D\xEDa',
        days: (count) => `${count} d\xEDas`,
        agenda: 'Agenda',
        resource: 'Cuadr\xEDcula'
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
        allDay: '\u7D42\u65E5',
        noEvents: '\u4E88\u5B9A\u306A\u3057',
        more: (count) => `\u4ED6${count}\u4EF6`
      },
      viewNames: {
        month: '\u6708',
        week: '\u9031',
        day: '\u65E5',
        days: (count) => `${count}\u65E5\u9593`,
        agenda: '\u4E88\u5B9A',
        resource: '\u30BF\u30A4\u30E0\u30B0\u30EA\u30C3\u30C9'
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
const DEFAULT_SETTINGS = {
  viewSettings: {
    weekends: true,
    weekNumbers: false,
    nowIndicator: true,
    offDays: false
  },
  interactions: { drag: true, resize: true, selectSlot: true },
  weekStartsOn: 0,
  dayStartHour: 0,
  dayEndHour: 24,
  interval: 60,
  snapDuration: 15,
  eventTooltip: false,
  showDayAddButton: false,
  localeId: 'en',
  timeZoneId: 'local'
};
function SettingsSwitch({ id, label, checked, onCheckedChange }) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <Label htmlFor={id} className='font-normal'>
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
function SettingsSelect({ id, label, value, options, onValueChange }) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <Label htmlFor={id} className='font-normal'>
        {label}
      </Label>
      <Select
        value={String(value)}
        onValueChange={(next) => onValueChange(Number(next))}
      >
        <SelectTrigger
          aria-label={label}
          id={id}
          size='sm'
          className='w-28'
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
function SettingsTextSelect({ id, label, value, options, onValueChange }) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <Label htmlFor={id} className='font-normal'>
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          aria-label={label}
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
export function Pattern() {
  const events = useMemo(() => buildEvents(new Date()), []);
  const apiRef = useRef(null);
  const newEventCount = useRef(0);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [view, setView] = useState('month');
  const isTimeGridView = view !== 'month' && view !== 'agenda';
  const activeLocale =
    LOCALES.find((entry) => entry.id === settings.localeId) ?? LOCALES[0];
  const activeTimeZone =
    TIME_ZONES.find((entry) => entry.id === settings.timeZoneId) ??
    TIME_ZONES[0];
  const patch = (partial) =>
    setSettings((current) => ({ ...current, ...partial }));
  const addEvent = () => {
    const api = apiRef.current;
    if (!api) return;
    const start = setHours(startOfDay(new Date()), 12);
    const end = addMinutes(start, 60);
    api.addEvent({
      id: `new-event-${newEventCount.current++}`,
      title: 'New event',
      start,
      end,
      resourceId: 'alex',
      color: 'var(--color-blue-500)'
    });
    api.goTo(start);
  };
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          <EventCalendar
            defaultEvents={events}
            defaultView='month'
            onViewChange={setView}
            resources={TEAM}
            apiRef={apiRef}
            renderEvent={renderEventContent}
            locale={activeLocale.locale}
            i18n={activeLocale.i18n}
            timeZone={activeTimeZone.value}
            viewSettings={settings.viewSettings}
            onViewSettingsChange={(viewSettings) => patch({ viewSettings })}
            interactions={settings.interactions}
            onInteractionsChange={(interactions) => patch({ interactions })}
            weekStartsOn={settings.weekStartsOn}
            dayStartHour={settings.dayStartHour}
            dayEndHour={settings.dayEndHour}
            interval={settings.interval}
            snapDuration={settings.snapDuration}
            eventTooltip={settings.eventTooltip}
            showDayAddButton={settings.showDayAddButton}
            offDays
            className='h-[640px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 pe-2'>
              <EventCalendarNav className='min-w-0 flex-[1_1_16rem]' />
              <EventCalendarToolbar>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='outline' size='sm'>
                      <RegistryIcon
                        lucide='Settings2Icon'
                        className='size-4'
                        aria-hidden='true'
                      />
                      Settings
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='end' sideOffset={8} className='w-80'>
                    <Tabs defaultValue='view'>
                      <TabsList className='w-full'>
                        <TabsTrigger value='view' className='flex-1'>
                          View
                        </TabsTrigger>
                        {/* time-grid internals only exist where an hour track
       renders, so the tab follows the active view */}
                        {isTimeGridView && (
                          <TabsTrigger value='time' className='flex-1'>
                            Time grid
                          </TabsTrigger>
                        )}
                        <TabsTrigger value='behavior' className='flex-1'>
                          Behavior
                        </TabsTrigger>
                        <TabsTrigger value='region' className='flex-1'>
                          Region
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value='view' className='flex flex-col gap-3'>
                        <SettingsSwitch
                          id='ec-set-weekends'
                          label='Weekends'
                          checked={settings.viewSettings.weekends ?? true}
                          onCheckedChange={(weekends) =>
                            patch({
                              viewSettings: {
                                ...settings.viewSettings,
                                weekends
                              }
                            })
                          }
                        />
                        <SettingsSwitch
                          id='ec-set-week-numbers'
                          label='Week numbers'
                          checked={settings.viewSettings.weekNumbers ?? false}
                          onCheckedChange={(weekNumbers) =>
                            patch({
                              viewSettings: {
                                ...settings.viewSettings,
                                weekNumbers
                              }
                            })
                          }
                        />
                        <SettingsSwitch
                          id='ec-set-now'
                          label='Now indicator'
                          checked={settings.viewSettings.nowIndicator ?? true}
                          onCheckedChange={(nowIndicator) =>
                            patch({
                              viewSettings: {
                                ...settings.viewSettings,
                                nowIndicator
                              }
                            })
                          }
                        />
                        <SettingsSwitch
                          id='ec-set-off-days'
                          label='Mark off days'
                          checked={settings.viewSettings.offDays ?? false}
                          onCheckedChange={(offDays) =>
                            patch({
                              viewSettings: {
                                ...settings.viewSettings,
                                offDays
                              }
                            })
                          }
                        />
                        <SettingsSwitch
                          id='ec-set-day-add'
                          label='Day add button'
                          checked={settings.showDayAddButton}
                          onCheckedChange={(showDayAddButton) =>
                            patch({ showDayAddButton })
                          }
                        />
                        {/* week start shapes month and week grids alike, so
       it lives here rather than in time-grid internals */}
                        <SettingsSelect
                          id='ec-set-week-start'
                          label='Week starts'
                          value={settings.weekStartsOn}
                          options={[
                            { value: 0, label: 'Sunday' },
                            { value: 1, label: 'Monday' }
                          ]}
                          onValueChange={(weekStartsOn) =>
                            patch({ weekStartsOn })
                          }
                        />
                      </TabsContent>
                      <TabsContent value='time' className='flex flex-col gap-3'>
                        <SettingsSelect
                          id='ec-set-day-start'
                          label='Day starts'
                          value={settings.dayStartHour}
                          options={[
                            { value: 0, label: '00:00' },
                            { value: 6, label: '06:00' },
                            { value: 8, label: '08:00' }
                          ]}
                          onValueChange={(dayStartHour) =>
                            patch({ dayStartHour })
                          }
                        />
                        <SettingsSelect
                          id='ec-set-day-end'
                          label='Day ends'
                          value={settings.dayEndHour}
                          options={[
                            { value: 18, label: '18:00' },
                            { value: 20, label: '20:00' },
                            { value: 24, label: '24:00' }
                          ]}
                          onValueChange={(dayEndHour) => patch({ dayEndHour })}
                        />
                        <SettingsSelect
                          id='ec-set-interval'
                          label='Grid interval'
                          value={settings.interval}
                          options={[
                            { value: 30, label: '30 min' },
                            { value: 60, label: '60 min' }
                          ]}
                          onValueChange={(interval) => patch({ interval })}
                        />
                        <SettingsSelect
                          id='ec-set-snap'
                          label='Drag snap'
                          value={settings.snapDuration}
                          options={[
                            { value: 5, label: '5 min' },
                            { value: 15, label: '15 min' },
                            { value: 30, label: '30 min' }
                          ]}
                          onValueChange={(snapDuration) =>
                            patch({ snapDuration })
                          }
                        />
                      </TabsContent>
                      <TabsContent
                        value='behavior'
                        className='flex flex-col gap-3'
                      >
                        <SettingsSwitch
                          id='ec-set-drag'
                          label='Drag to move'
                          checked={settings.interactions.drag}
                          onCheckedChange={(drag) =>
                            patch({
                              interactions: { ...settings.interactions, drag }
                            })
                          }
                        />
                        <SettingsSwitch
                          id='ec-set-resize'
                          label='Drag to resize'
                          checked={settings.interactions.resize}
                          onCheckedChange={(resize) =>
                            patch({
                              interactions: {
                                ...settings.interactions,
                                resize
                              }
                            })
                          }
                        />
                        <SettingsSwitch
                          id='ec-set-select-slot'
                          label='Select time range'
                          checked={settings.interactions.selectSlot}
                          onCheckedChange={(selectSlot) =>
                            patch({
                              interactions: {
                                ...settings.interactions,
                                selectSlot
                              }
                            })
                          }
                        />
                        <SettingsSwitch
                          id='ec-set-tooltip'
                          label='Event tooltips'
                          checked={settings.eventTooltip}
                          onCheckedChange={(eventTooltip) =>
                            patch({ eventTooltip })
                          }
                        />
                      </TabsContent>
                      <TabsContent
                        value='region'
                        className='flex flex-col gap-3'
                      >
                        <SettingsTextSelect
                          id='ec-set-language'
                          label='Language'
                          value={settings.localeId}
                          options={LOCALES.map((entry) => ({
                            value: entry.id,
                            label: entry.label
                          }))}
                          onValueChange={(localeId) => patch({ localeId })}
                        />
                        <SettingsTextSelect
                          id='ec-set-timezone'
                          label='Time zone'
                          value={settings.timeZoneId}
                          options={TIME_ZONES.map((entry) => ({
                            value: entry.id,
                            label: entry.label
                          }))}
                          onValueChange={(timeZoneId) => patch({ timeZoneId })}
                        />
                        <p className='text-ui-muted-foreground text-xs leading-relaxed'>
                          Language switches the date-fns locale and every UI
                          label. Time zone shifts all event times.
                        </p>
                      </TabsContent>
                    </Tabs>
                    <Button
                      variant='outline'
                      size='sm'
                      className='mt-4 w-full'
                      onClick={() => setSettings(DEFAULT_SETTINGS)}
                    >
                      Reset to defaults
                    </Button>
                  </PopoverContent>
                </Popover>
                <Button size='sm' onClick={addEvent}>
                  <RegistryIcon
                    lucide='PlusIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                  New event
                </Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
        </CardContent>
      </Card>
    </div>
  );
}
