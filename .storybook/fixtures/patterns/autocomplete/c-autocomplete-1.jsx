import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList
} from '../../../../src/components/core/Select/parts/autocomplete-extended.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';

// Free-text search with suggestions. Each field below changes one input option.
function TagAutocomplete({ id, label, inputProps, ...props }) {
  return (
    <div className='flex flex-col gap-2'>
      <Label htmlFor={id}>{label}</Label>
      <Autocomplete items={items} {...props}>
        <AutocompleteInput id={id} placeholder='e.g. feature' {...inputProps} />
        <AutocompleteContent>
          <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.id} value={item.value}>
                {item.value}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  );
}

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xl gap-3 sm:grid-cols-2'>
      <TagAutocomplete id='autocomplete-basic' label='Tag' />
      <TagAutocomplete id='autocomplete-highlight' label='Auto highlight' autoHighlight />
      <TagAutocomplete id='autocomplete-clear' label='Clear button' defaultValue='Feature' inputProps={{ showClear: true }} />
      <TagAutocomplete id='autocomplete-trigger' label='Trigger button' inputProps={{ showTrigger: true }} />
      <TagAutocomplete id='autocomplete-both' label='Clear and trigger' defaultValue='Docs' inputProps={{ showTrigger: true, showClear: true }} />
      <TagAutocomplete id='autocomplete-disabled' label='Disabled' disabled defaultValue='Bug' />
      <TagAutocomplete id='autocomplete-sm' label='Small' inputProps={{ size: 'sm', showTrigger: true, showClear: true }} />
      <TagAutocomplete id='autocomplete-lg' label='Large' inputProps={{ size: 'lg', showTrigger: true, showClear: true }} />
    </div>
  );
}
const items = [
  { id: 't1', value: 'Feature' },
  { id: 't2', value: 'Fix' },
  { id: 't3', value: 'Bug' },
  { id: 't4', value: 'Docs' },
  { id: 't5', value: 'Internal' },
  { id: 't6', value: 'Mobile' },
  { id: 'c-accordion', value: 'component: Accordion' },
  { id: 'c-alert-dialog', value: 'component: Alert Dialog' },
  { id: 'c-autocomplete', value: 'component: Autocomplete' },
  { id: 'c-avatar', value: 'component: Avatar' },
  { id: 'c-checkbox', value: 'component: Checkbox' },
  { id: 'c-checkbox-group', value: 'component: Checkbox Group' },
  { id: 'c-collapsible', value: 'component: Collapsible' },
  { id: 'c-combobox', value: 'component: Combobox' },
  { id: 'c-context-menu', value: 'component: Context Menu' },
  { id: 'c-dialog', value: 'component: Dialog' },
  { id: 'c-field', value: 'component: Field' },
  { id: 'c-fieldset', value: 'component: Fieldset' },
  { id: 'c-filterable-menu', value: 'component: Filterable Menu' },
  { id: 'c-form', value: 'component: Form' },
  { id: 'c-input', value: 'component: Input' },
  { id: 'c-menu', value: 'component: Menu' },
  { id: 'c-menubar', value: 'component: Menubar' },
  { id: 'c-meter', value: 'component: Meter' },
  { id: 'c-navigation-menu', value: 'component: Navigation Menu' },
  { id: 'c-number-field', value: 'component: Number Field' },
  { id: 'c-popover', value: 'component: Popover' },
  { id: 'c-preview-card', value: 'component: Preview Card' },
  { id: 'c-progress', value: 'component: Progress' },
  { id: 'c-radio', value: 'component: Radio' },
  { id: 'c-scroll-area', value: 'component: Scroll Area' },
  { id: 'c-select', value: 'component: Select' },
  { id: 'c-separator', value: 'component: Separator' },
  { id: 'c-slider', value: 'component: Slider' },
  { id: 'c-switch', value: 'component: Switch' },
  { id: 'c-tabs', value: 'component: Tabs' },
  { id: 'c-toast', value: 'component: Toast' },
  { id: 'c-toggle', value: 'component: Toggle' },
  { id: 'c-toggle-group', value: 'component: Toggle Group' },
  { id: 'c-toolbar', value: 'component: Toolbar' },
  { id: 'c-tooltip', value: 'component: Tooltip' }
];
