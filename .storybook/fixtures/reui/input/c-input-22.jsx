// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId, useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const id = useId();
  const [password, setPassword] = useState('');
  const getStrength = (pass) => {
    const requirements = [
      { met: pass.length >= 8, text: '8+ characters' },
      { met: /[0-9]/.test(pass), text: 'a number' },
      { met: /[!@#$%^&*]/.test(pass), text: 'a special character' }
    ];
    const metCount2 = requirements.filter((r) => r.met).length;
    return { requirements, metCount: metCount2 };
  };
  const { metCount } = getStrength(password);
  const getHint = () => {
    if (!password) {
      return 'Use 8+ characters with a number and a special character.';
    }
    if (metCount === 3) {
      return "Strong password. You're all set!";
    }
    if (metCount === 2) {
      return 'Almost there! Add the missing requirement.';
    }
    return 'Weak password. Include 8+ characters, a number, and a special character.';
  };
  const getStatus = () => {
    if (!password)
      return {
        color: 'text-ui-muted-foreground',
        icon: <RegistryIcon lucide='InfoIcon' className='size-3.5 shrink-0' />
      };
    if (metCount === 3)
      return {
        color: 'text-emerald-500',
        icon: (
          <RegistryIcon
            lucide='CircleCheckIcon'
            className='size-3.5 shrink-0'
          />
        )
      };
    if (metCount === 2)
      return {
        color: 'text-amber-500',
        icon: (
          <RegistryIcon
            lucide='AlertTriangleIcon'
            className='size-3.5 shrink-0'
          />
        )
      };
    return {
      color: 'text-ui-destructive',
      icon: (
        <RegistryIcon
          lucide='AlertTriangleIcon'
          className='size-3.5 shrink-0'
        />
      )
    };
  };
  const { color, icon: StatusIcon } = getStatus();
  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor={id}>Password</FieldLabel>
      <Input
        aria-label='Enter password'
        id={id}
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Enter password'
      />
      <div
        className={cn(
          'flex items-center gap-2 text-xs transition-colors duration-200',
          color
        )}
      >
        {StatusIcon}
        <p>{getHint()}</p>
      </div>
    </Field>
  );
}
