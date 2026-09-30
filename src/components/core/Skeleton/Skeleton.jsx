import { Skeleton as SkeletonRoot } from './parts/skeleton.jsx';

/** A decorative loading placeholder; the surrounding region announces what is loading. */
const Skeleton = (props) => <SkeletonRoot aria-hidden='true' { ...props } />;

export default Skeleton;
