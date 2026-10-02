/**
 * The pure model behind useCollapsibleSections: state is `{ expanded: Set<string> }` and every
 * action returns the same state object when nothing changes, so React can skip the render.
 */

export function createCollapsibleSectionsState(sections, initialExpanded = [], expandAll = false) {
  return { expanded: new Set(expandAll ? sections : initialExpanded) };
}

const sameMembers = (set, ids) => set.size === ids.size && [ ...ids ].every((id) => set.has(id));

export function collapsibleSectionsReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const expanded = new Set(state.expanded);
      if (expanded.has(action.section)) expanded.delete(action.section);
      else expanded.add(action.section);
      return { expanded };
    }
    case 'EXPAND': {
      if (state.expanded.has(action.section)) return state;
      return { expanded: new Set(state.expanded).add(action.section) };
    }
    case 'COLLAPSE': {
      if (!state.expanded.has(action.section)) return state;
      const expanded = new Set(state.expanded);
      expanded.delete(action.section);
      return { expanded };
    }
    case 'EXPAND_ALL':
    case 'SET_EXPANDED': {
      const expanded = new Set(action.sections);
      return sameMembers(state.expanded, expanded) ? state : { expanded };
    }
    case 'COLLAPSE_ALL':
      return state.expanded.size === 0 ? state : { expanded: new Set() };
    default:
      return state;
  }
}

export function areAllSectionsExpanded(sections, expanded) {
  return sections.every((section) => expanded.has(section));
}
