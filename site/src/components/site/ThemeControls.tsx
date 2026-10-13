'use client';

import Button from '@gaudi/design-system/core/Button';
import DropdownMenu, { DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from '@gaudi/design-system/core/DropdownMenu';
import Icon from '@gaudi/design-system/core/Icon';
import { listThemes, useTheme } from '@gaudi/design-system/themes';

type Mode = 'light' | 'dark' | 'system';
const MODES: { value: Mode; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'Sun' },
  { value: 'dark', label: 'Dark', icon: 'Moon' },
  { value: 'system', label: 'System', icon: 'Monitor' }
];

interface ThemeSummary { id: string; name: string; swatches: { light: string[]; dark: string[] } }

function Swatches({ colors }: { colors: string[] }) {
  return (
    <span aria-hidden className='inline-flex shrink-0 overflow-hidden rounded-(--ds-radius-sm) border border-border'>
      {colors.slice(0, 4).map((color, index) => (
        <span key={index} className='size-3.5' style={{ background: color }} />
      ))}
    </span>
  );
}

/** Light/dark/system mode menu. */
export function ModeMenu() {
  const { mode, setMode } = useTheme();
  const current = MODES.find((entry) => entry.value === mode) || MODES[2];
  return (
    <DropdownMenu
      trigger={
        <Button variant='ghost' tone='neutral' size='icon-sm' aria-label={`Colour mode: ${current.label}`} data-testid='mode-menu'>
          <Icon name={current.icon} decorative size='sm' />
        </Button>
      }
    >
      <DropdownMenuLabel>Colour mode</DropdownMenuLabel>
      <DropdownMenuRadioGroup value={mode} onValueChange={(value: string) => setMode(value as Mode)}>
        {MODES.map((entry) => (
          <DropdownMenuRadioItem key={entry.value} value={entry.value}>
            <Icon name={entry.icon} decorative size='sm' />
            {entry.label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenu>
  );
}

/** Theme preset picker over the design system presets (persisted by ThemeProvider). */
export function PresetMenu() {
  const { theme, themes, setTheme, resolvedMode } = useTheme();
  const summaries = listThemes(themes) as ThemeSummary[];
  const active = summaries.find((entry) => entry.id === theme) || summaries[0];
  const modeKey = resolvedMode === 'dark' ? 'dark' : 'light';
  return (
    <DropdownMenu
      trigger={
        <Button variant='ghost' tone='neutral' size='sm' aria-label={`Theme preset: ${active?.name}`} data-testid='preset-menu'>
          <Icon name='Palette' decorative size='sm' />
          <span className='hidden xl:inline'>{active?.name}</span>
        </Button>
      }
    >
      <DropdownMenuLabel>Theme preset</DropdownMenuLabel>
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        {summaries.map((entry) => (
          <DropdownMenuRadioItem key={entry.id} value={entry.id} data-testid={`preset-${entry.id}`}>
            <Swatches colors={entry.swatches[modeKey]} />
            {entry.name}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className='font-normal text-text-muted'>Import your own on the Themes page.</DropdownMenuLabel>
    </DropdownMenu>
  );
}
