import { PatternWaves } from '@gaudi/design-system/animations/PatternWaves';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function PatternWavesPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused} hint="Move the pointer to ripple the pattern.">
      {({ paused, content }) => <PatternWaves {...args} paused={paused}>{content}</PatternWaves>}
    </BackgroundDemo>
  );
}
