import { PixelBlast } from '@gaudi/design-system/animations/PixelBlast';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function PixelBlastPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused} hint="Click the background to send a ripple.">
      {({ paused, content }) => <PixelBlast {...args} paused={paused}>{content}</PixelBlast>}
    </BackgroundDemo>
  );
}
