import { AeroShards } from '@gaudi/design-system/animations/AeroShards';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function AeroShardsPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused} hint="Press and hold to gather the shards.">
      {({ paused, content }) => <AeroShards {...args} paused={paused}>{content}</AeroShards>}
    </BackgroundDemo>
  );
}
