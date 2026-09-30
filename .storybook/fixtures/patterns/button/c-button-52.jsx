import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button
      variant='outline'
      className='group/button h-auto justify-start gap-3 px-4 py-3 text-left'
    >
      <div className='bg-ui-muted text-ui-accent-foreground group-hover/button:bg-ui-background rounded-md flex size-10 items-center justify-center'>
        <RegistryIcon
          lucide='CreditCardIcon'
          aria-hidden='true'
          className='size-5'
        />
      </div>
      <div className='flex flex-col gap-0.5'>
        <span>Credit Card</span>
        <span className='text-ui-muted-foreground text-xs font-normal'>
          Pay securely with your Visa or Mastercard
        </span>
      </div>
    </Button>
  );
}
