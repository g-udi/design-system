import { PhraseCycle } from '@gaudi/design-system/animations/PhraseCycle';
import { TextAnimationDemo } from '../../../../../docs/fixtures/animations/TextAnimationDemo.jsx';

export function PhraseCyclePlayground(args) {
  return <TextAnimationDemo paused={args.paused}>
    {({ paused, replay }) => <PhraseCycle key={replay} {...args} paused={paused} />}
  </TextAnimationDemo>;
}
