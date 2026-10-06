import { SideRays } from '@gaudi/design-system/animations/SideRays';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function SideRaysPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <SideRays {...args} paused={paused}>{content}</SideRays>}
    </BackgroundDemo>
  );
}
