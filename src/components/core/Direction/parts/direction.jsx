// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { Direction } from 'radix-ui';
function DirectionProvider({ dir, direction, children }) {
  return (
    <Direction.DirectionProvider dir={direction ?? dir}>
      {children}
    </Direction.DirectionProvider>
  );
}
const useDirection = Direction.useDirection;
export { DirectionProvider, useDirection };
