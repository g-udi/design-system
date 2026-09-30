// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import * as React from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { OTPInput, OTPInputContext } from 'input-otp';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function InputOTP({ className, containerClassName, ...props }) {
  return (
    <OTPInput
      data-slot='input-otp'
      containerClassName={cn(
        'ds-part-input-otp flex items-center has-disabled:opacity-50',
        containerClassName
      )}
      spellCheck={false}
      className={cn(
        'ds-part-input-otp-input disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}
function InputOTPGroup({ className, ...props }) {
  return (
    <div
      data-slot='input-otp-group'
      className={cn('ds-part-input-otp-group flex items-center', className)}
      {...props}
    />
  );
}
function InputOTPSlot({ index, className, ...props }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  return (
    <div
      data-slot='input-otp-slot'
      data-active={isActive}
      className={cn(
        'ds-part-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className='ds-part-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='ds-part-input-otp-caret-line' />
        </div>
      )}
    </div>
  );
}
function InputOTPSeparator({ ...props }) {
  return (
    <div
      data-slot='input-otp-separator'
      className='ds-part-input-otp-separator flex items-center'
      role='separator'
      {...props}
    >
      <RegistryIcon lucide='MinusIcon' />
    </div>
  );
}
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
