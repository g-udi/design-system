// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId, useMemo, useState } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const id = useId();
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const checkStrength = (pass) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[0-9]/, text: 'At least 1 number' },
      { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
      { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: 'At least 1 special character'
      }
    ];
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text
    }));
  };
  const strength = checkStrength(password);
  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);
  const getStrengthColor = (score) => {
    if (score === 0) return 'bg-ui-border';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-amber-500';
    if (score <= 4) return 'bg-green-500';
    return 'bg-emerald-500';
  };
  const getStrengthText = (score) => {
    if (score === 0) return 'Enter a password';
    if (score <= 2) return 'Weak security';
    if (score <= 4) return 'Medium security';
    return 'Strong security';
  };
  return (
    <div className='w-full max-w-xs'>
      <Field>
        <FieldLabel htmlFor={id}>Secure Password</FieldLabel>
        <div className='relative'>
          <Input
            aria-label='Create a strong password'
            aria-describedby={`${id}-description`}
            className='pe-9'
            id={id}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Create a strong password'
            type={isVisible ? 'text' : 'password'}
            value={password}
          />
          <button
            aria-controls={id}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isVisible}
            className='text-ui-muted-foreground hover:text-ui-foreground focus-visible:border-ui-ring focus-visible:ring-ui-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
            onClick={toggleVisibility}
            type='button'
          >
            {isVisible ? (
              <RegistryIcon lucide='EyeOffIcon' aria-hidden='true' />
            ) : (
              <RegistryIcon lucide='EyeIcon' aria-hidden='true' />
            )}
          </button>
        </div>
      </Field>

      {/* Segmented Progress Bar */}
      <div
        aria-label='Password strength'
        aria-valuemax={5}
        aria-valuemin={0}
        aria-valuenow={strengthScore}
        className='mt-3 mb-4 flex gap-1'
        role='progressbar'
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < strengthScore ? getStrengthColor(strengthScore) : 'bg-ui-border'}`}
          />
        ))}
      </div>

      <div className='mb-3 flex items-center justify-between'>
        <p
          className='text-ui-foreground text-sm font-medium'
          id={`${id}-description`}
        >
          {getStrengthText(strengthScore)}
        </p>
        <span className='text-ui-muted-foreground text-xs'>
          {strengthScore}/5 requirements met
        </span>
      </div>

      <ul aria-label='Password requirements' className='space-y-1.5'>
        {strength.map((req) => (
          <li className='flex items-center gap-1' key={req.text}>
            {req.met ? (
              <RegistryIcon
                lucide='CheckIcon'
                className='size-3.5 text-emerald-500'
                aria-hidden='true'
              />
            ) : (
              <RegistryIcon
                lucide='XIcon'
                className='text-ui-muted-foreground size-3.5'
                aria-hidden='true'
              />
            )}
            <span
              className={`text-xs transition-colors ${req.met ? 'text-emerald-600' : 'text-ui-muted-foreground'}`}
            >
              {req.text}
              <span className='sr-only'>
                {req.met ? ' - Requirement met' : ' - Requirement not met'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
