import { WebThreads } from '@gaudi/design-system/animations/WebThreads';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function WebThreadsPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <WebThreads {...args} paused={paused}>{content}</WebThreads>}
    </BackgroundDemo>
  );
}
