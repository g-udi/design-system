import { cn } from '../../../utilities/cn';
import { Loader as LoaderRoot } from './LoaderPrimitives.jsx';

/** A named loading status. Use text-current to inherit the surrounding colour. */
export default function Loader({ className, label = 'Loading', size = 'md', ...props }) {
  return <LoaderRoot aria-label={label} size={size} className={cn('text-accent', className)} {...props} />;
}
