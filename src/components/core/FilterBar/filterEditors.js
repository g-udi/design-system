import {
  FilterBooleanEditor,
  FilterMultiSelectEditor,
  FilterNumberEditor,
  FilterRangeEditor,
  FilterSelectEditor,
  FilterTextEditor
} from './components/FiltersEditors.jsx';

// The editor registry stays out of the client editors module, so the map and resolver are server-safe.
export const DEFAULT_FILTER_EDITORS = {
  text: FilterTextEditor,
  number: FilterNumberEditor,
  range: FilterRangeEditor,
  select: FilterSelectEditor,
  multiselect: FilterMultiSelectEditor,
  boolean: FilterBooleanEditor
};

export function resolveFilterEditor(field, operator, editors) {
  if (typeof field.editor === 'function') {
    return field.editor;
  }
  if (typeof field.editor === 'string') {
    const named = editors[field.editor];
    if (named) return named;
  }
  const arity = operator?.arity ?? 'one';
  if (arity === 'none') return void 0;
  if (arity === 'range') return editors.range;
  if (arity === 'many') {
    if (field.options || field.loadOptions) return editors.multiselect;
  }
  return editors[field.type ?? 'text'] ?? editors.text;
}
