import { ShapeWaves } from '@gaudi/design-system/animations/ShapeWaves';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function ShapeWavesPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused} hint="Move or click to ripple the shapes.">
      {({ paused, content }) => <ShapeWaves {...args} paused={paused}>{content}</ShapeWaves>}
    </BackgroundDemo>
  );
}
