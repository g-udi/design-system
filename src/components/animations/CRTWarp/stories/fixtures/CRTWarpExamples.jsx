import { CRTWarp } from '@gaudi/design-system/animations/CRTWarp';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function CRTWarpPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <CRTWarp {...args} paused={paused}>{content}</CRTWarp>}
    </BackgroundDemo>
  );
}
