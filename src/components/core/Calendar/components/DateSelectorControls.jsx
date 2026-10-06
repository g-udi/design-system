'use client';
import { addMonths, isSameMonth, subMonths } from 'date-fns';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../ToggleGroup/ToggleGroupPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { useDateSelectorContext } from '../DateSelectorContext.jsx';
function DateSelectorFilterToggle({
  value,
  onChange,
  showBetween = true,
  showIs = true,
  presetMode,
  className
}) {
  const { i18n } = useDateSelectorContext();
  const isDisabled = presetMode !== void 0;
  return (
    <ToggleGroup
      type='single'
      value={value}
      disabled={isDisabled}
      onValueChange={(newValue) => {
        if (!isDisabled && newValue) {
          onChange(newValue);
        }
      }}
      className={className}
    >
      <div
        className={cn('bg-ui-muted/80', className)}
      >
        {showIs && (
          <ToggleGroupItem
            value='is'
            aria-label={i18n.filterTypes.is}
            className='py-1 font-normal'
          >
            {i18n.filterTypes.is}
          </ToggleGroupItem>
        )}
        <ToggleGroupItem
          value='before'
          aria-label={i18n.filterTypes.before}
          className='py-1 font-normal'
        >
          {i18n.filterTypes.before}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='after'
          aria-label={i18n.filterTypes.after}
          className='py-1 font-normal'
        >
          {i18n.filterTypes.after}
        </ToggleGroupItem>
        {showBetween && (
          <ToggleGroupItem
            value='between'
            aria-label={i18n.filterTypes.between}
            className='py-1 font-normal'
          >
            {i18n.filterTypes.between}
          </ToggleGroupItem>
        )}
      </div>
    </ToggleGroup>
  );
}
function DateSelectorPeriodTabs({
  value,
  onChange,
  periodTypes,
  className,
  calendarMonth,
  onMonthChange,
  showNavigationButtons = false
}) {
  const { i18n } = useDateSelectorContext();
  const tabs = [
    { value: 'day', label: i18n.periodTypes.day },
    { value: 'month', label: i18n.periodTypes.month },
    { value: 'quarter', label: i18n.periodTypes.quarter },
    { value: 'half-year', label: i18n.periodTypes.halfYear },
    { value: 'year', label: i18n.periodTypes.year }
  ];
  const filteredTabs = periodTypes
    ? tabs.filter((tab) => periodTypes.includes(tab.value))
    : tabs;
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3',
        className
      )}
    >
      <ToggleGroup
        type='single'
        value={value}
        onValueChange={(newValue) => {
          if (newValue) {
            onChange(newValue);
          }
        }}
      >
        <div>
          {filteredTabs.map((tab) => (
            <ToggleGroupItem
              key={tab.value}
              value={tab.value}
              aria-label={tab.label}
              className='px-1 py-1 font-normal sm:px-2.5'
            >
              {tab.label}
            </ToggleGroupItem>
          ))}
        </div>
      </ToggleGroup>
      {showNavigationButtons &&
        value === 'day' &&
        calendarMonth &&
        onMonthChange && (
          <div className='flex items-center'>
            {!isSameMonth(calendarMonth, new Date()) && (
              <Button
                variant='ghost'
                tone='neutral'
                size='icon'
                aria-label={i18n.today}
                title={i18n.today}
                onClick={() => onMonthChange(new Date())}
              >
                <RegistryIcon lucide={calendarMonth > new Date() ? 'CornerUpLeftIcon' : 'CornerUpRightIcon'} />
              </Button>
            )}
            <Button
              aria-label='Previous period'
              variant='ghost'
              tone='neutral'
              size='icon'
              onClick={() => onMonthChange(subMonths(calendarMonth, 1))}
            >
              <RegistryIcon lucide='ChevronLeftIcon' />
            </Button>
            <Button
              aria-label='Next period'
              variant='ghost'
              tone='neutral'
              size='icon'
              onClick={() => onMonthChange(addMonths(calendarMonth, 1))}
            >
              <RegistryIcon lucide='ChevronRightIcon' />
            </Button>
          </div>
        )}
    </div>
  );
}
export { DateSelectorFilterToggle, DateSelectorPeriodTabs };
