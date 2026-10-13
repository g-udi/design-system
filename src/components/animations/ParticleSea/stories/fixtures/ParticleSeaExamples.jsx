import { ParticleSea } from '@gaudi/design-system/animations/ParticleSea';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function ParticleSeaPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused} darkContent hint='Move the pointer to lift the sea.'>
      {({ paused, content }) => <ParticleSea {...args} paused={paused}>{content}</ParticleSea>}
    </BackgroundDemo>
  );
}
