'use client';

import Button from '@gaudi/design-system/core/Button';
import Pill from '@gaudi/design-system/core/Pill';
import Progress from '@gaudi/design-system/core/Progress';
import Switch from '@gaudi/design-system/core/Switch';
import { listThemes, useTheme } from '@gaudi/design-system/themes';

interface ThemeSummary { id: string; name: string; description: string; tags: string[] }

/**
 * Live preset previews: each card is a nested `data-theme` scope (themes.css), so the real
 * components inside render with that preset in the current light/dark mode.
 */
export function PresetGrid({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, themes } = useTheme();
  const presets = (listThemes(themes) as ThemeSummary[]);
  return (
    <ul className='not-prose my-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4' data-testid='preset-gallery'>
      {presets.map((preset) => (
        <li key={preset.id}>
          <div data-theme={preset.id} className='flex h-full flex-col gap-3 rounded-(--ds-radius-card) border border-border bg-background p-4 text-text'>
            <div className='flex items-start justify-between gap-2'>
              <div className='min-w-0'>
                <p className='font-semibold' style={{ fontFamily: 'var(--ds-font-heading)' }}>{preset.name}</p>
                {compact ? null : <p className='mt-0.5 line-clamp-2 text-xs text-text-muted'>{preset.description}</p>}
              </div>
              {theme === preset.id ? <Pill size='xs' tone='blue' variant='soft'>Active</Pill> : null}
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button size='sm'>Primary</Button>
              <Button size='sm' variant='outline' tone='neutral'>Outline</Button>
            </div>
            <Progress value={64} label={`${preset.name} progress`} />
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <Switch size='sm' label='Notify' defaultChecked id={`preset-switch-${preset.id}`} />
              <div className='flex gap-1' aria-hidden>
                {[1, 2, 3, 4, 5].map((index) => <span key={index} className='size-3 rounded-full' style={{ background: `var(--ds-color-chart-${index})` }} />)}
              </div>
            </div>
            <Button size='sm' variant='soft' tone='neutral' className='mt-auto' onClick={() => setTheme(preset.id)} aria-pressed={theme === preset.id} data-testid={`use-preset-${preset.id}`}>
              {theme === preset.id ? 'In use' : `Use ${preset.name}`}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
