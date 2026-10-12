import { Typewriter } from '@gaudi/design-system/animations/Typewriter';
import { TextAnimationDemo } from '../../../../../docs/fixtures/animations/TextAnimationDemo.jsx';

export function TypewriterPlayground(args) {
  return <TextAnimationDemo paused={args.paused}>
    {({ paused, replay }) => <Typewriter key={replay} {...args} paused={paused} />}
  </TextAnimationDemo>;
}
