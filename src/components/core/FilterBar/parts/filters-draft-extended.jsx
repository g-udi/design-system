// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
export function createFilterDraft(cascaderPath = []) {
  return {
    step: 'field',
    status: 'editing',
    ruleId: null,
    path: [],
    cascaderPath,
    operator: null,
    value: void 0,
    query: ''
  };
}
function previousStep(step) {
  if (step === 'value') return 'operator';
  if (step === 'operator') return 'field';
  return null;
}
export function filterDraftReducer(state, action) {
  switch (action.type) {
    case 'openCreate':
      return createFilterDraft(action.cascaderPath ?? []);
    case 'openAmend':
      return {
        step: action.step,
        status: 'editing',
        ruleId: action.ruleId,
        path: action.path,
        // Defaults the picker to the field's own level, so amend opens beside
        // its siblings, not at the root. Callers may override.
        cascaderPath: action.cascaderPath ?? action.path.slice(0, -1),
        operator: action.operator,
        value: action.value,
        query: ''
      };
    case 'close':
      return null;
    case 'setCascaderPath':
      if (!state) return state;
      if (state.cascaderPath === action.path) return state;
      return { ...state, cascaderPath: action.path };
    case 'setQuery':
      if (!state) return state;
      if (state.query === action.query) return state;
      return { ...state, query: action.query };
    case 'selectField': {
      if (!state) return state;
      return {
        ...state,
        path: action.path,
        operator: action.defaultOperator,
        status: 'ready',
        // A field change invalidates the value: "Active" means nothing once
        // the field becomes "Created at".
        value: void 0,
        step: 'operator',
        query: ''
      };
    }
    case 'selectOperator': {
      if (!state) return state;
      if (action.arity === 'none') {
        return {
          ...state,
          operator: action.operator,
          value: void 0,
          status: 'ready',
          query: ''
        };
      }
      return {
        ...state,
        operator: action.operator,
        value: action.value,
        step: 'value',
        status: 'editing',
        query: ''
      };
    }
    case 'setValue':
      if (!state) return state;
      return { ...state, value: action.value };
    case 'commit':
      if (!state) return state;
      return {
        ...state,
        value: action.value === void 0 ? state.value : action.value,
        status: 'ready'
      };
    case 'back': {
      if (!state) return state;
      const step = previousStep(state.step);
      if (!step) return null;
      return { ...state, step, status: 'editing', query: '' };
    }
    case 'goto':
      if (!state) return state;
      if (state.step === action.step) return state;
      return { ...state, step: action.step, status: 'editing', query: '' };
    default:
      return state;
  }
}
export function isFilterDraftCommittable(draft) {
  return Boolean(draft && draft.path.length > 0);
}
