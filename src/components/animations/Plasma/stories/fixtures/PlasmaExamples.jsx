import { Plasma } from '@gaudi/design-system/animations/Plasma';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function PlasmaPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <Plasma {...args} paused={paused}>{content}</Plasma>}
    </BackgroundDemo>
  );
}
