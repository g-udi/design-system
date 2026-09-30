'use client';
import { createContext, useContext, useMemo, useState } from 'react';
import * as BasePhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue
} from '../../Select/parts/combobox.jsx';
import { FieldInput as Input } from '../../Field/index.js';
import { ScrollArea } from '../../ScrollArea/parts/scroll-area.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const PhoneInputContext = createContext({
  variant: 'default',
  invalid: false,
  popupClassName: void 0,
  scrollAreaClassName: void 0
});
function PhoneInput({
  className,
  variant,
  popupClassName,
  scrollAreaClassName,
  onChange,
  value,
  ...props
}) {
  const phoneInputSize = variant || 'default';
  // One invalid flag paints both halves: the country trigger and the number input.
  const invalid = [true, 'true'].includes(props['aria-invalid']);
  return (
    <PhoneInputContext.Provider
      value={{
        variant: phoneInputSize,
        invalid,
        popupClassName,
        scrollAreaClassName
      }}
    >
      <BasePhoneInput.default
        className={cn('flex', className)}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        value={value || void 0}
        onChange={(value2) => onChange?.(value2 || '')}
        {...props}
      />
    </PhoneInputContext.Provider>
  );
}
function InputComponent({ className, ...props }) {
  const { variant, invalid } = useContext(PhoneInputContext);
  return (
    <Input
      invalid={invalid}
      className={cn(
        'rounded-s-none focus:z-1',
        variant === 'sm' && 'h-7',
        variant === 'lg' && 'h-9',
        className
      )}
      {...props}
    />
  );
}
function CountrySelect({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange
}) {
  const { variant, invalid, popupClassName } = useContext(PhoneInputContext);
  const [searchValue, setSearchValue] = useState('');
  const filteredCountries = useMemo(() => {
    if (!searchValue) return countryList;
    return countryList.filter(({ label }) =>
      label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [countryList, searchValue]);
  return (
    <Combobox
      items={filteredCountries}
      value={selectedCountry || ''}
      onValueChange={(country) => {
        if (country) {
          onChange(country);
        }
      }}
    >
      <ComboboxTrigger
        render={
          <Button
            variant='outline'
            size={variant}
            className={cn(
              'rounded-s-lg flex gap-1 rounded-e-none border-e-0 px-2.5 py-0 leading-none hover:bg-transparent focus:z-10 data-pressed:bg-transparent',
              disabled && 'opacity-50',
              // Matches FieldInput's invalid border so both halves read as one control.
              invalid && 'border-danger'
            )}
            disabled={disabled}
          >
            <span className='sr-only'>
              <ComboboxValue />
            </span>
            <FlagComponent
              country={selectedCountry}
              countryName={selectedCountry}
            />
          </Button>
        }
      />
      <ComboboxContent
        className={cn(
          'w-xs *:data-[slot=input-group]:bg-transparent',
          popupClassName
        )}
      >
        <ComboboxInput
          placeholder='e.g. United States'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          showTrigger={false}
          className='border-ui-input focus-visible:border-ui-border rounded-none border-0 px-0 py-2.5 shadow-none ring-0! outline-none! focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <ComboboxSeparator />
        <ComboboxEmpty className='px-4 py-2.5 text-sm'>
          No country found.
        </ComboboxEmpty>
        <ComboboxList>
          <div className='relative flex max-h-full'>
            <div className='flex max-h-[min(var(--available-height),24rem)] w-full scroll-pt-2 scroll-pb-2 flex-col overscroll-contain'>
              <ScrollArea className='size-full min-h-0 **:data-[slot=scroll-area-scrollbar]:m-0 [&_[data-slot=scroll-area-viewport]]:h-full [&_[data-slot=scroll-area-viewport]]:overscroll-contain'>
                {filteredCountries.map((item) =>
                  item.value ? (
                    <ComboboxItem
                      key={item.value}
                      value={item.value}
                      className='flex items-center gap-2'
                    >
                      <FlagComponent
                        country={item.value}
                        countryName={item.label}
                      />
                      <span className='flex-1 text-sm'>{item.label}</span>
                      <span className='text-ui-foreground text-sm'>
                        {`+${BasePhoneInput.getCountryCallingCode(item.value)}`}
                      </span>
                    </ComboboxItem>
                  ) : null
                )}
              </ScrollArea>
            </div>
          </div>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
function FlagComponent({ country, countryName }) {
  const Flag = flags[country];
  return (
    <span className="flex h-4 w-4 items-center justify-center [&_svg:not([class*='size-'])]:size-full! [&_svg:not([class*='size-'])]:rounded-sm">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <RegistryIcon lucide='GlobeIcon' className='size-4 opacity-60' />
      )}
    </span>
  );
}
export { PhoneInput };
