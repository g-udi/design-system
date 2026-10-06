'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  DateSelector,
  DEFAULT_DATE_SELECTOR_I18N,
  formatDateValue
} from '@gaudi/design-system/core/Calendar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DialogRoot as Dialog,
  DialogClosePrimitive as DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@gaudi/design-system/core/Dialog';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
function createI18nConfig(translations2) {
  return { ...DEFAULT_DATE_SELECTOR_I18N, ...translations2 };
}
const translations = {
  es: {
    selectDate: 'Seleccionar fecha',
    apply: 'Aplicar',
    cancel: 'Cancelar',
    clear: 'Limpiar',
    today: 'Hoy',
    filterTypes: {
      is: 'es',
      before: 'antes de',
      after: 'despu\xE9s de',
      between: 'entre'
    },
    periodTypes: {
      day: 'D\xEDa',
      month: 'Mes',
      quarter: 'Trimestre',
      halfYear: 'Semestre',
      year: 'A\xF1o'
    },
    months: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ],
    monthsShort: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic'
    ],
    quarters: ['T1', 'T2', 'T3', 'T4'],
    halfYears: ['S1', 'S2'],
    weekdays: [
      'Domingo',
      'Lunes',
      'Martes',
      'Mi\xE9rcoles',
      'Jueves',
      'Viernes',
      'S\xE1bado'
    ],
    weekdaysShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S\xE1'],
    placeholder: 'Seleccionar fecha...',
    rangePlaceholder: 'Seleccionar rango de fechas...'
  },
  fr: {
    selectDate: 'S\xE9lectionner une date',
    apply: 'Appliquer',
    cancel: 'Annuler',
    clear: 'Effacer',
    today: "Aujourd'hui",
    filterTypes: {
      is: 'est',
      before: 'avant',
      after: 'apr\xE8s',
      between: 'entre'
    },
    periodTypes: {
      day: 'Jour',
      month: 'Mois',
      quarter: 'Trimestre',
      halfYear: 'Semestre',
      year: 'Ann\xE9e'
    },
    months: [
      'Janvier',
      'F\xE9vrier',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Ao\xFBt',
      'Septembre',
      'Octobre',
      'Novembre',
      'D\xE9cembre'
    ],
    monthsShort: [
      'Jan',
      'F\xE9v',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Ao\xFB',
      'Sep',
      'Oct',
      'Nov',
      'D\xE9c'
    ],
    quarters: ['T1', 'T2', 'T3', 'T4'],
    halfYears: ['S1', 'S2'],
    weekdays: [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi'
    ],
    weekdaysShort: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    placeholder: 'S\xE9lectionner une date...',
    rangePlaceholder: 'S\xE9lectionner une plage de dates...'
  },
  de: {
    selectDate: 'Datum ausw\xE4hlen',
    apply: 'Anwenden',
    cancel: 'Abbrechen',
    clear: 'L\xF6schen',
    today: 'Heute',
    filterTypes: {
      is: 'ist',
      before: 'vor',
      after: 'nach',
      between: 'zwischen'
    },
    periodTypes: {
      day: 'Tag',
      month: 'Monat',
      quarter: 'Quartal',
      halfYear: 'Halbjahr',
      year: 'Jahr'
    },
    months: [
      'Januar',
      'Februar',
      'M\xE4rz',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember'
    ],
    monthsShort: [
      'Jan',
      'Feb',
      'M\xE4r',
      'Apr',
      'Mai',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Dez'
    ],
    quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
    halfYears: ['H1', 'H2'],
    weekdays: [
      'Sonntag',
      'Montag',
      'Dienstag',
      'Mittwoch',
      'Donnerstag',
      'Freitag',
      'Samstag'
    ],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    placeholder: 'Datum ausw\xE4hlen...',
    rangePlaceholder: 'Datumsbereich ausw\xE4hlen...'
  }
};
const i18nConfigs = {
  en: DEFAULT_DATE_SELECTOR_I18N,
  es: createI18nConfig(translations.es),
  fr: createI18nConfig(translations.fr),
  de: createI18nConfig(translations.de)
};
const languageMetadata = {
  en: {
    label: 'English',
    flag: '\u{1F1FA}\u{1F1F8}',
    dateFormat: 'MM/dd/yyyy',
    weekStartsOn: 0,
    ui: {
      label: 'Due date',
      hint: 'Try: 2025, Q4, 05/10/2025',
      placeholder: 'Select a date'
    }
  },
  es: {
    label: 'Espa\xF1ol',
    flag: '\u{1F1EA}\u{1F1F8}',
    dateFormat: 'dd/MM/yyyy',
    weekStartsOn: 1,
    ui: {
      label: 'Fecha de vencimiento',
      hint: 'Prueba: 2025, T4, 05/10/2025',
      placeholder: 'Seleccionar una fecha'
    }
  },
  fr: {
    label: 'Fran\xE7ais',
    flag: '\u{1F1EB}\u{1F1F7}',
    dateFormat: 'dd/MM/yyyy',
    weekStartsOn: 1,
    ui: {
      label: "Date d'\xE9ch\xE9ance",
      hint: 'Essayez: 2025, T4, 05/10/2025',
      placeholder: 'S\xE9lectionner une date'
    }
  },
  de: {
    label: 'Deutsch',
    flag: '\u{1F1E9}\u{1F1EA}',
    dateFormat: 'dd.MM.yyyy',
    weekStartsOn: 1,
    ui: {
      label: 'F\xE4lligkeitsdatum',
      hint: 'Versuchen Sie: 2025, Q4, 05.10.2025',
      placeholder: 'Datum ausw\xE4hlen'
    }
  }
};
const languageOptions = Object.entries(languageMetadata).map(
  ([value, meta]) => ({
    value,
    label: meta.label,
    flag: meta.flag
  })
);
export function Pattern() {
  const [value, setValue] = useState();
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const currentMeta = useMemo(
    () => languageMetadata[currentLanguage] || languageMetadata.en,
    [currentLanguage]
  );
  const currentI18n = useMemo(
    () => i18nConfigs[currentLanguage] || i18nConfigs.en,
    [currentLanguage]
  );
  useEffect(() => {
    if (open) {
      setInternalValue(value);
    }
  }, [open, value]);
  const formattedValue = useMemo(
    () =>
      value ? formatDateValue(value, currentI18n, currentMeta.dateFormat) : '',
    [value, currentI18n, currentMeta.dateFormat]
  );
  const displayText = formattedValue || currentMeta.ui.placeholder;
  const handleApply = () => {
    setValue(internalValue);
    setOpen(false);
  };
  const handleCancel = () => {
    setInternalValue(value);
    setOpen(false);
  };
  return (
    <div className='flex h-full w-full grow flex-col items-stretch gap-4'>
      <div className='flex w-full justify-end'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label='Language'
              variant='outline'
              size='sm'
              className='flex items-center gap-2'
            >
              <span>{currentMeta.flag}</span>
              <span>{currentMeta.label}</span>
              <RegistryIcon lucide='ChevronDownIcon' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            {languageOptions.map((lang) => (
              <DropdownMenuItem
                key={lang.value}
                onClick={() => setCurrentLanguage(lang.value)}
                className='flex items-center gap-2'
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex grow items-center justify-center'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='outline' className='w-56 justify-start'>
              <RegistryIcon lucide='CalendarIcon' />
              {displayText}
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-lg' showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{currentMeta.ui.label}</DialogTitle>
            </DialogHeader>
            <DateSelector
              value={internalValue}
              onChange={setInternalValue}
              showInput={true}
              i18n={currentI18n}
              dayDateFormat={currentMeta.dateFormat}
              weekStartsOn={currentMeta.weekStartsOn}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline' onClick={handleCancel}>
                  {currentI18n.cancel}
                </Button>
              </DialogClose>
              <Button onClick={handleApply}>{currentI18n.apply}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
