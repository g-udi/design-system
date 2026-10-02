'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';
import { areAllSectionsExpanded, collapsibleSectionsReducer, createCollapsibleSectionsState } from './collapsible-sections-model.js';

/**
 * Which of several collapsible sections are open, with "Expand all" and "Collapse all": settings
 * pages, filter sidebars, long FAQs and inspector panels. The initial expansion is read once;
 * `onChange` receives the expanded ids after each change (not for the initial state).
 *
 * @param {{ sections: string[], initialExpanded?: string[], expandAll?: boolean, onChange?: (expanded: string[]) => void }} config
 */
export function useCollapsibleSections({ sections, initialExpanded = [], expandAll: startExpanded = false, onChange }) {
  const [ state, dispatch ] = useReducer(
    collapsibleSectionsReducer,
    { sections, initialExpanded, startExpanded },
    (initial) => createCollapsibleSectionsState(initial.sections, initial.initialExpanded, initial.startExpanded)
  );
  const onChangeRef = useLatestRef(onChange);
  // The initial expansion is host input, not a change; StrictMode replays must not report it.
  const notified = useRef(state.expanded);

  useEffect(() => {
    if (notified.current === state.expanded) return;
    notified.current = state.expanded;
    onChangeRef.current?.(Array.from(state.expanded));
  }, [ onChangeRef, state.expanded ]);

  const toggle = useCallback((section) => dispatch({ type: 'TOGGLE', section }), []);
  const expand = useCallback((section) => dispatch({ type: 'EXPAND', section }), []);
  const collapse = useCallback((section) => dispatch({ type: 'COLLAPSE', section }), []);
  const expandAll = useCallback(() => dispatch({ type: 'EXPAND_ALL', sections }), [ sections ]);
  const collapseAll = useCallback(() => dispatch({ type: 'COLLAPSE_ALL' }), []);
  const setExpanded = useCallback((ids) => dispatch({ type: 'SET_EXPANDED', sections: ids }), []);
  const isExpanded = useCallback((section) => state.expanded.has(section), [ state.expanded ]);
  const allExpanded = useMemo(() => areAllSectionsExpanded(sections, state.expanded), [ sections, state.expanded ]);
  const expandedSections = useMemo(() => Array.from(state.expanded), [ state.expanded ]);

  return {
    isExpanded,
    expandedSections,
    expandedCount: state.expanded.size,
    allExpanded,
    allCollapsed: state.expanded.size === 0,
    toggle,
    expand,
    collapse,
    expandAll,
    collapseAll,
    setExpanded
  };
}
