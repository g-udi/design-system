import { LightPillar } from '@gaudi/design-system/animations/LightPillar';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function LightPillarPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <LightPillar {...args} paused={paused}>{content}</LightPillar>}
    </BackgroundDemo>
  );
}
