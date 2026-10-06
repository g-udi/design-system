import { MicroSlats } from '@gaudi/design-system/animations/MicroSlats';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function MicroSlatsPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused} hint="Move the pointer to brush the slats.">
      {({ paused, content }) => <MicroSlats {...args} paused={paused}>{content}</MicroSlats>}
    </BackgroundDemo>
  );
}
