import { DarkVeil } from '@gaudi/design-system/animations/DarkVeil';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function DarkVeilPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused} darkContent>
      {({ paused, content }) => <DarkVeil {...args} paused={paused}>{content}</DarkVeil>}
    </BackgroundDemo>
  );
}
