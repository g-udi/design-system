import { LightRays } from '@gaudi/design-system/animations/LightRays';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function LightRaysPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <LightRays {...args} paused={paused}>{content}</LightRays>}
    </BackgroundDemo>
  );
}
