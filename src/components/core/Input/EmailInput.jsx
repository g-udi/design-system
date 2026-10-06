'use client';

import Input from './Input.jsx';

// HTML's single-address grammar, escaped for the pattern attribute's Unicode v mode.
// https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
const localPart = "[a-zA-Z0-9.!#$%&'*+\\/=?^_`\\{\\|\\}~\\-]+";
const domainLabel = '[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?';
const emailPattern = `${localPart}@${domainLabel}(?:\\.${domainLabel})*`;

export function EmailInput({ pattern, ...props }) {
  let constraint = emailPattern;
  if (pattern != null) {
    try {
      // Like HTML, ignore an invalid author pattern; keep email validation active.
      new RegExp(`^(?:${pattern})$`, 'v');
      constraint = `(?=${emailPattern}$)(?:${pattern})`;
    } catch {
      // The base email grammar still applies.
    }
  }

  return (
    <Input
      autoComplete='email'
      autoCapitalize='none'
      spellCheck={false}
      {...props}
      type='text'
      inputMode='email'
      multiple={undefined}
      pattern={constraint}
    />
  );
}
