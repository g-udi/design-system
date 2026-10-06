import { useState } from 'react';
import { WordSpotlight } from '@gaudi/design-system/animations/WordSpotlight';
import Button from '@gaudi/design-system/core/Button';
export function WordSpotlightPlayground(args) {
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  return <div style={{ width: '100%', minWidth: 0 }}>
    <div style={{ minHeight: 300, display: 'grid', placeItems: 'center', padding: '32px 16px' }}>
      <div style={{ fontSize: 'clamp(28px, 6vw, 64px)', fontWeight: 700, lineHeight: 1.3, textAlign: 'center' }}><WordSpotlight key={replay} {...args} paused={args.paused || paused} /></div>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
      <Button variant="outline" size="sm" disabled={args.paused} onClick={() => setPaused(value => !value)}>{paused || args.paused ? 'Resume animation' : 'Pause animation'}</Button>
      <Button variant="outline" size="sm" onClick={() => setReplay(value => value + 1)}>Replay</Button>
    </div>
  </div>;
}
