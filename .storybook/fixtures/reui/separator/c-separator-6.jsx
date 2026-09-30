// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-2 text-sm'>
      <p className='font-medium'>Order Summary</p>
      <Separator />
      <dl className='flex items-center justify-between'>
        <dt className='text-ui-muted-foreground'>Subtotal</dt>
        <dd>$49.00</dd>
      </dl>
      <dl className='flex items-center justify-between'>
        <dt className='text-ui-muted-foreground'>Discount</dt>
        <dd className='text-success'>-$5.00</dd>
      </dl>
      <dl className='flex items-center justify-between'>
        <dt className='text-ui-muted-foreground'>Tax</dt>
        <dd>$3.52</dd>
      </dl>
      <Separator />
      <dl className='flex items-center justify-between font-medium'>
        <dt>Total</dt>
        <dd>$47.52</dd>
      </dl>
    </div>
  );
}
