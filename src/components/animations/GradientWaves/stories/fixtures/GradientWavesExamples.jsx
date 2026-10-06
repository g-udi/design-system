import { GradientWaves } from '@gaudi/design-system/animations/GradientWaves';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function GradientWavesPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <GradientWaves {...args} paused={paused}>{content}</GradientWaves>}
    </BackgroundDemo>
  );
}
