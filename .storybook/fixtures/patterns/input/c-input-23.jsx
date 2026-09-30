'use client';
import { useId, useState } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const requirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, text: 'At least 1 special character' }
];
// Score 0 to 5: bar colour, summary and hint icon.
const level = (score) => {
  if (score === 0) return { bar: 'bg-border', text: 'Enter a password', tone: 'text-text-muted', icon: 'InfoIcon' };
  if (score <= 2) return { bar: 'bg-danger', text: 'Weak security', tone: 'text-danger', icon: 'AlertTriangleIcon' };
  if (score <= 4) return { bar: 'bg-warning', text: 'Medium security', tone: 'text-warning', icon: 'AlertTriangleIcon' };
  return { bar: 'bg-success', text: 'Strong security', tone: 'text-success', icon: 'CircleCheckIcon' };
};

export function Pattern() {
  const id = useId();
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const checks = requirements.map((req) => ({ text: req.text, met: req.regex.test(password) }));
  const score = checks.filter((check) => check.met).length;
  const { bar, text, tone, icon } = level(score);
  return (
    <div className='mx-auto grid w-full max-w-xs gap-3'>
      <Field>
        <div className='flex items-center justify-between'>
          <FieldLabel htmlFor={id}>Password</FieldLabel>
          <a href='#' className='text-xs font-medium text-accent hover:underline'>Forgot password?</a>
        </div>
        <div className='relative'>
          <Input
            id={id}
            aria-describedby={`${id}-summary`}
            className='pe-9'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Create a strong password'
            type={visible ? 'text' : 'password'}
          />
          <button
            type='button'
            aria-controls={id}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
            className='absolute inset-y-0 end-0 flex w-9 items-center justify-center rounded-e-md text-text-muted outline-none hover:text-text focus-visible:ring-2 focus-visible:ring-accent'
          >
            <RegistryIcon lucide={visible ? 'EyeOffIcon' : 'EyeIcon'} aria-hidden='true' className='size-4' />
          </button>
        </div>
      </Field>
      <div
        role='progressbar'
        aria-label='Password strength'
        aria-valuemin={0}
        aria-valuemax={requirements.length}
        aria-valuenow={score}
        className='flex gap-1'
      >
        {requirements.map((req, i) => (
          <div key={req.text} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < score ? bar : 'bg-border'}`} />
        ))}
      </div>
      <div className='flex items-center justify-between gap-2'>
        <p id={`${id}-summary`} className={`flex items-center gap-1.5 text-sm font-medium ${tone}`}>
          <RegistryIcon lucide={icon} className='size-3.5 shrink-0' aria-hidden='true' />
          {text}
        </p>
        <span className='text-xs tabular-nums text-text-muted'>{score}/{requirements.length} met</span>
      </div>
      <ul aria-label='Password requirements' className='grid gap-1'>
        {checks.map((check) => (
          <li key={check.text} className={`flex items-center gap-1.5 text-xs ${check.met ? 'text-success' : 'text-text-muted'}`}>
            <RegistryIcon lucide={check.met ? 'CheckIcon' : 'XIcon'} className='size-3.5' aria-hidden='true' />
            {check.text}
            <span className='sr-only'>{check.met ? ' - Requirement met' : ' - Requirement not met'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
