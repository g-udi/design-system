import { useState } from 'react';
import { GlyphInspector } from '@gaudi/design-system/animations/GlyphInspector';
import Button from '@gaudi/design-system/core/Button';
export function GlyphInspectorPlayground(args) {
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  return <div style={{ width: '100%', minWidth: 0 }}>
    <div style={{ minHeight: 340, display: 'grid', placeItems: 'center', width: '100%' }}>
      <div style={{ width: '100%', minWidth: 0, fontSize: 'clamp(48px, 10vw, 112px)', fontWeight: 700, lineHeight: 1.3, textAlign: 'center' }}><GlyphInspector key={replay} {...args} paused={args.paused || paused} /></div>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
      <Button variant="outline" size="sm" disabled={args.paused} onClick={() => setPaused(value => !value)}>{paused || args.paused ? 'Resume animation' : 'Pause animation'}</Button>
      <Button variant="outline" size="sm" onClick={() => setReplay(value => value + 1)}>Replay</Button>
    </div>
  </div>;
}
