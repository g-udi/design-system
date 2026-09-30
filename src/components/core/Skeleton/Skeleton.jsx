import { cn } from '../../../utilities/cn';

const Skeleton = ({ className, ...props }) => (
  <div className={ cn('animate-pulse rounded-md bg-border', className) } aria-hidden='true' { ...props } />
);

export default Skeleton;
