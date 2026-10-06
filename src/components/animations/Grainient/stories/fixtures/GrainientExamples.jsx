import { Grainient } from '@gaudi/design-system/animations/Grainient';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function GrainientPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <Grainient {...args} paused={paused}>{content}</Grainient>}
    </BackgroundDemo>
  );
}
