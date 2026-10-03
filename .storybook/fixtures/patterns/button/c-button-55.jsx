import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const accounts = [
  { size: 'sm', variant: 'default' },
  { size: 'sm', variant: 'outline' },
  { size: 'md', variant: 'default' },
  { size: 'md', variant: 'outline' }
];
const methods = [
  { icon: 'CreditCardIcon', title: 'Credit card', description: 'Visa, Mastercard or Amex' },
  { icon: 'BanknoteIcon', title: 'Bank transfer', description: 'Settles in 1–2 days' }
];

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xl flex-col gap-3'>
      <div className='flex flex-wrap items-center gap-2'>
        {accounts.map(({ size, variant }) => (
          <Button key={`${size}-${variant}`} size={size} variant={variant}>
            <Avatar className='size-5'>
              <AvatarImage src='/avatars/men/32.jpg' alt='' />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            @alexjohnson
          </Button>
        ))}
      </div>
      <div className='grid gap-2 sm:grid-cols-2'>
        {methods.map(({ icon, title, description }) => (
          <Button key={title} variant='outline' tone='neutral' className='group/method h-auto justify-start gap-3 whitespace-normal px-3 py-2 text-left'>
            <span className='flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-muted text-text-muted group-hover/method:bg-surface'>
              <RegistryIcon lucide={icon} aria-hidden='true' />
            </span>
            <span className='flex flex-col gap-0.5'>
              <span>{title}</span>
              <span className='text-xs font-normal text-text-muted'>{description}</span>
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
