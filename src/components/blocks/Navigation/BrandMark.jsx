import { GaudiLogo } from '../../../icons/brands/gaudi.jsx';
import { cn } from '../../../utilities/cn/index.js';

/** Official Gaudi mark; the enclosing home link supplies the accessible name. */
export default function BrandMark({ className }) {
  return <GaudiLogo aria-hidden='true' className={cn('block size-11', className)} />;
}
