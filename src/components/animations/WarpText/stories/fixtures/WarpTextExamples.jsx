import { useState } from 'react';
import { WarpText } from '@gaudi/design-system/animations/WarpText';
import Button from '@gaudi/design-system/core/Button';

export function WarpTextPlayground(args) {
  const [paused, setPaused] = useState(false);
  return <div style={{ width: '100%', minWidth: 0 }}>
    <div style={{ fontSize: 'clamp(48px, 9vw, 112px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.03em' }}>
      <WarpText {...args} paused={args.paused || paused} />
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'calc(var(--ds-space-scale, 1) * 12px)' }}>
      <p style={{ fontSize: 13, color: 'var(--ds-color-text-muted)' }}>Move your pointer across the text.</p>
      <Button variant="outline" size="sm" disabled={args.paused} onClick={() => setPaused(value => !value)}>{paused || args.paused ? 'Resume animation' : 'Pause animation'}</Button>
    </div>
  </div>;
}
