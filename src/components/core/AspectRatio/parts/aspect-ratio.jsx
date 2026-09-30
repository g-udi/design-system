// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { AspectRatio as AspectRatioPrimitive } from 'radix-ui';
function AspectRatio({ ...props }) {
  return <AspectRatioPrimitive.Root data-slot='aspect-ratio' {...props} />;
}
export { AspectRatio };
