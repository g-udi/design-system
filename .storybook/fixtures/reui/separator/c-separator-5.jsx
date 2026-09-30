// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-6'>
      <div className='relative'>
        <Separator />
        <span className='bg-ui-background text-ui-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs'>
          or continue with
        </span>
      </div>
    </div>
  );
}
