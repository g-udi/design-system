// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useMemo, useState } from 'react';
import { Badge } from '../../Pill/parts/badge-extended.jsx';
import { useDataGrid } from './data-grid-extended.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { FieldInput as Input } from '../../Field/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../Popover/parts/popover.jsx';
import { Separator } from '../../Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function DataGridColumnFilter({ column, title, options }) {
  const { i18n } = useDataGrid();
  const facets = column?.getFacetedUniqueValues();
  const filterValue = column?.getFilterValue();
  const selectedValues = new Set(Array.isArray(filterValue) ? filterValue : []);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm'>
          <RegistryIcon lucide='CirclePlusIcon' className='size-4' />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge variant='secondary' className='px-1 font-normal lg:hidden'>
                {selectedValues.size}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.size > 2 ? (
                  <Badge variant='secondary' className='px-1 font-normal'>
                    {i18n.labels.filterSelectedCount(selectedValues.size)}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={option.value}
                        className='px-1 font-normal'
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <div className='p-2'>
          <Input
            placeholder={title}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='h-8'
          />
        </div>
        <div className='max-h-[300px] overflow-y-auto'>
          {filteredOptions.length === 0 ? (
            <div className='text-ui-muted-foreground py-6 text-center text-sm'>
              {i18n.labels.filterNoResults}
            </div>
          ) : (
            <div className='p-1'>
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.has(option.value);
                const facetCount = facets?.get(option.value);
                const toggleOption = () => {
                  if (isSelected) {
                    selectedValues.delete(option.value);
                  } else {
                    selectedValues.add(option.value);
                  }
                  const filterValues = Array.from(selectedValues);
                  column?.setFilterValue(
                    filterValues.length ? filterValues : void 0
                  );
                };
                return (
                  <div
                    key={option.value}
                    role='button'
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={toggleOption}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleOption();
                      }
                    }}
                    className={cn(
                      'rounded-md relative flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm outline-hidden select-none',
                      'hover:bg-ui-accent hover:text-ui-accent-foreground focus:bg-ui-accent focus:text-ui-accent-foreground'
                    )}
                  >
                    <div
                      className={cn(
                        'border-ui-primary rounded-sm flex h-4 w-4 items-center justify-center border',
                        isSelected
                          ? 'bg-ui-primary text-ui-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <RegistryIcon lucide='CheckIcon' className='h-4 w-4' />
                    </div>
                    {option.icon && (
                      <option.icon className='text-ui-muted-foreground h-4 w-4' />
                    )}
                    <span>{option.label}</span>
                    {facetCount !== void 0 && (
                      <span className='ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs'>
                        {facetCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {selectedValues.size > 0 && (
            <>
              <div className='bg-ui-border -mx-1 my-1 h-px' />
              <div className='p-1'>
                <div
                  role='button'
                  tabIndex={0}
                  onClick={() => column?.setFilterValue(void 0)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      column?.setFilterValue(void 0);
                    }
                  }}
                  className='hover:bg-ui-accent hover:text-ui-accent-foreground focus:bg-ui-accent focus:text-ui-accent-foreground rounded-md relative flex cursor-pointer items-center justify-center px-2 py-1.5 text-sm outline-hidden select-none'
                >
                  {i18n.labels.filterClear}
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
export { DataGridColumnFilter };
