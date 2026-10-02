'use client';

import { useCallback, useMemo } from 'react';
import { useControllableState } from './use-controllable-state.js';

/**
 * Open and closed state for dialogs, menus, drawers and disclosures, controlled or uncontrolled.
 * Spread `getTriggerProps()` on a custom trigger to wire `aria-expanded`, `aria-controls` and the
 * toggle; Gaudi overlays already accept `open` and `onOpenChange` directly.
 */
export function useDisclosure({ open: openProp, defaultOpen = false, onOpenChange, id } = {}) {
  const [ open, setOpen ] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const onOpen = useCallback(() => setOpen(true), [ setOpen ]);
  const onClose = useCallback(() => setOpen(false), [ setOpen ]);
  const onToggle = useCallback(() => setOpen((current) => !current), [ setOpen ]);
  const getTriggerProps = useCallback((props = {}) => ({
    ...props,
    'aria-expanded': Boolean(open),
    ...(id ? { 'aria-controls': id } : {}),
    onClick: (event) => {
      props.onClick?.(event);
      if (!event?.defaultPrevented) onToggle();
    }
  }), [ id, onToggle, open ]);

  return useMemo(
    () => ({ open: Boolean(open), setOpen, onOpen, onClose, onToggle, getTriggerProps }),
    [ getTriggerProps, onClose, onOpen, onToggle, open, setOpen ]
  );
}
