import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
/** Shared stage and transport controls for text animation examples. */
export function TextAnimationDemo({ children, paused: externallyPaused = false }) {
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  return <div style={{ width: '100%', minWidth: 0 }}>
    <div style={{ minHeight: 300, display: 'grid', placeItems: 'center', padding: 'calc(var(--ds-space-scale, 1) * 32px) calc(var(--ds-space-scale, 1) * 16px)' }}>
      <div style={{ fontSize: 'clamp(28px, 6vw, 64px)', fontWeight: 700, lineHeight: 1.3, textAlign: 'center' }}>{children({ paused: externallyPaused || paused, replay })}</div>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'calc(var(--ds-space-scale, 1) * 8px)' }}>
      <Button variant="outline" size="sm" disabled={externallyPaused} onClick={() => setPaused(value => !value)}>{paused || externallyPaused ? 'Resume animation' : 'Pause animation'}</Button>
      <Button variant="outline" size="sm" onClick={() => setReplay(value => value + 1)}>Replay</Button>
    </div>
  </div>;
}
