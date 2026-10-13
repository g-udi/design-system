'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@gaudi/design-system/themes';

/** Gaudi's ThemeProvider owns the preset and light/dark/system mode (persisted in localStorage). */
export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider defaultMode='system'>{children}</ThemeProvider>;
}
