import { Hyperspeed } from '@gaudi/design-system/animations/Hyperspeed';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function HyperspeedPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused} hint="Hide demo content, then hold the background to accelerate.">
      {({ paused, content }) => <Hyperspeed {...args} paused={paused}>{content}</Hyperspeed>}
    </BackgroundDemo>
  );
}
