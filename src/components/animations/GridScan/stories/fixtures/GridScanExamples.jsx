import { GridScan } from '@gaudi/design-system/animations/GridScan';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function GridScanPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <GridScan {...args} paused={paused}>{content}</GridScan>}
    </BackgroundDemo>
  );
}
