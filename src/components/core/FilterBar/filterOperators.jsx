export const DEFAULT_FILTER_OPERATOR_LABELS = {
  contains: 'contains',
  not_contains: 'does not contain',
  starts_with: 'starts with',
  ends_with: 'ends with',
  is: 'is',
  is_not: 'is not',
  is_any_of: 'is any of',
  is_none_of: 'is none of',
  has_any_of: 'has any of',
  has_all_of: 'has all of',
  has_none_of: 'has none of',
  eq: 'equals',
  neq: 'does not equal',
  gt: 'is greater than',
  gte: 'is greater than or equal to',
  lt: 'is less than',
  lte: 'is less than or equal to',
  between: 'is between',
  not_between: 'is not between',
  is_before: 'is before',
  is_after: 'is after',
  is_on_or_before: 'is on or before',
  is_on_or_after: 'is on or after',
  empty: 'is empty',
  not_empty: 'is not empty'
};
const CATALOG = {
  text: [
    { value: 'contains', inverse: 'not_contains' },
    { value: 'not_contains', inverse: 'contains' },
    { value: 'starts_with' },
    { value: 'ends_with' },
    { value: 'is', inverse: 'is_not' },
    { value: 'is_not', inverse: 'is' },
    { value: 'empty', arity: 'none', inverse: 'not_empty' },
    { value: 'not_empty', arity: 'none', inverse: 'empty' }
  ],
  number: [
    { value: 'eq', inverse: 'neq' },
    { value: 'neq', inverse: 'eq' },
    { value: 'gt', inverse: 'lte' },
    { value: 'gte', inverse: 'lt' },
    { value: 'lt', inverse: 'gte' },
    { value: 'lte', inverse: 'gt' },
    { value: 'between', arity: 'range', inverse: 'not_between' },
    { value: 'not_between', arity: 'range', inverse: 'between' },
    { value: 'empty', arity: 'none', inverse: 'not_empty' },
    { value: 'not_empty', arity: 'none', inverse: 'empty' }
  ],
  range: [
    { value: 'between', arity: 'range', inverse: 'not_between' },
    { value: 'not_between', arity: 'range', inverse: 'between' },
    { value: 'empty', arity: 'none', inverse: 'not_empty' },
    { value: 'not_empty', arity: 'none', inverse: 'empty' }
  ],
  select: [
    { value: 'is', inverse: 'is_not' },
    { value: 'is_not', inverse: 'is' },
    { value: 'is_any_of', arity: 'many', inverse: 'is_none_of' },
    { value: 'is_none_of', arity: 'many', inverse: 'is_any_of' },
    { value: 'empty', arity: 'none', inverse: 'not_empty' },
    { value: 'not_empty', arity: 'none', inverse: 'empty' }
  ],
  multiselect: [
    { value: 'has_any_of', arity: 'many', inverse: 'has_none_of' },
    { value: 'has_all_of', arity: 'many' },
    { value: 'has_none_of', arity: 'many', inverse: 'has_any_of' },
    { value: 'empty', arity: 'none', inverse: 'not_empty' },
    { value: 'not_empty', arity: 'none', inverse: 'empty' }
  ],
  boolean: [
    { value: 'is', inverse: 'is_not' },
    { value: 'is_not', inverse: 'is' },
    { value: 'empty', arity: 'none', inverse: 'not_empty' },
    { value: 'not_empty', arity: 'none', inverse: 'empty' }
  ]
};
export const DEFAULT_FILTER_VALUE_TYPE = 'text';
export function createFilterOperators(labels) {
  const built = {};
  for (const type of Object.keys(CATALOG)) {
    built[type] = CATALOG[type].map((entry) => ({
      value: entry.value,
      label: labels[entry.value] ?? entry.value,
      arity: entry.arity ?? 'one',
      inverse: entry.inverse
    }));
  }
  return built;
}
export const DEFAULT_FILTER_OPERATORS = createFilterOperators(
  DEFAULT_FILTER_OPERATOR_LABELS
);
export function resolveFilterOperators(
  field,
  catalog = DEFAULT_FILTER_OPERATORS
) {
  if (typeof field.operators === 'function') return field.operators(field);
  if (field.operators) return field.operators;
  return catalog[field.type ?? DEFAULT_FILTER_VALUE_TYPE] ?? catalog.text;
}
export function visibleFilterOperators(operators) {
  return operators.filter((operator) => !operator.hidden);
}
export function getFilterOperator(operators, value) {
  if (!value) return void 0;
  return operators.find((operator) => operator.value === value);
}
export function getFilterArity(operator) {
  return operator?.arity ?? 'one';
}
export function operatorTakesValue(operator) {
  return getFilterArity(operator) !== 'none';
}
export function getDefaultFilterOperator(field, operators) {
  if (field.defaultOperator) {
    const named = getFilterOperator(operators, field.defaultOperator);
    if (named) return named.value;
  }
  const visible = visibleFilterOperators(operators);
  return visible[0]?.value ?? operators[0]?.value ?? null;
}
export function negateFilterOperator(operator, operators, negated) {
  if (operator?.inverse) {
    const inverse = getFilterOperator(operators, operator.inverse);
    if (inverse) return { operator: inverse.value, negated: Boolean(negated) };
  }
  return { operator: operator?.value ?? null, negated: !negated };
}
export function coerceFilterValue(value, from, to) {
  const nextArity = getFilterArity(to);
  if (nextArity === 'none') return void 0;
  if (value === void 0 || value === null) return value;
  const previousArity = getFilterArity(from);
  if (previousArity === nextArity) return value;
  const asArray = Array.isArray(value) ? value : [value];
  if (nextArity === 'many') return asArray;
  if (nextArity === 'one') return asArray[0];
  if (nextArity === 'range') {
    return [asArray[0], asArray[1]];
  }
  return value;
}
