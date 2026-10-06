import { Dither } from '@gaudi/design-system/animations/Dither';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function DitherPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <Dither {...args} paused={paused}>{content}</Dither>}
    </BackgroundDemo>
  );
}
