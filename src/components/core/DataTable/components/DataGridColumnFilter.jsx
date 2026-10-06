'use client';
import { Badge } from '../../Pill/Badge.jsx';
import { useDataGrid } from '../DataGrid.jsx';
import { default as Button } from '../../Button/index.js';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../../Commander/Command.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../Popover/PopoverPrimitives.jsx';
import { Separator } from '../../Separator/Separator.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function DataGridColumnFilter({ column, title, options }) {
  const { i18n } = useDataGrid();
  const facets = column?.getFacetedUniqueValues();
  const filterValue = column?.getFilterValue();
  const selectedValues = new Set(Array.isArray(filterValue) ? filterValue : []);
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
              <div className='hidden gap-1 lg:flex'>
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
        <Command label={title}>
          <CommandInput placeholder={title} aria-label={title} />
          <CommandList aria-multiselectable='true'>
            <CommandEmpty>{i18n.labels.filterNoResults}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                const facetCount = facets?.get(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={String(option.value)}
                    keywords={[String(option.label)]}
                    data-checked={isSelected}
                    aria-checked={isSelected}
                    onSelect={() => {
                      const next = new Set(selectedValues);
                      if (isSelected) next.delete(option.value);
                      else next.add(option.value);
                      column?.setFilterValue(next.size ? [...next] : undefined);
                    }}
                  >
                    {option.icon ? <option.icon className='size-4' aria-hidden='true' /> : null}
                    <span className='min-w-0 flex-1'>{option.label}</span>
                    {facetCount !== undefined ? <span className='text-xs tabular-nums'>{facetCount}</span> : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {selectedValues.size > 0 ? (
            <>
              <Separator />
              <Button variant='ghost' size='sm' onClick={() => column?.setFilterValue(undefined)}>
                {i18n.labels.filterClear}
              </Button>
            </>
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export { DataGridColumnFilter };
