'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../../utilities/cn';
import Button from '../../core/Button';
import { Alert, AlertDescription, AlertTitle } from '../../core/Banner/parts/alert-extended.jsx';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../core/Field/parts/field.jsx';
import Input from '../../core/Input';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

/*
 * Form building blocks with real behaviour: field validation with accessible errors,
 * an error summary that takes focus after a failed submit, and a row you edit in place.
 * Layout stays with the Core Field parts (FieldGroup, Field orientation='responsive').
 */

const blank = (value) => value == null || value === '' || value === false || (Array.isArray(value) && value.length === 0);

// Each validator returns a message when the value fails, or an empty string.
export const validators = {
  required: (message = 'This field is required.') => (value) => (blank(value) ? message : ''),
  email: (message = 'Enter an email address like name@example.com.') => (value) =>
    !blank(value) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()) ? message : '',
  minLength: (length, message) => (value) =>
    !blank(value) && String(value).trim().length < length ? message || `Use at least ${length} characters.` : '',
  maxLength: (length, message) => (value) =>
    !blank(value) && String(value).length > length ? message || `Use ${length} characters or fewer.` : '',
  pattern: (expression, message = 'Check the format.') => (value) => (!blank(value) && !expression.test(String(value)) ? message : ''),
  min: (limit, message) => (value) => (!blank(value) && Number(value) < limit ? message || `Enter ${limit} or more.` : ''),
  max: (limit, message) => (value) => (!blank(value) && Number(value) > limit ? message || `Enter ${limit} or less.` : '')
};

const runRules = (rule, value, values) => {
  for (const check of [].concat(rule || [])) {
    const message = check(value, values);
    if (message) return message;
  }
  return '';
};

const readEvent = (input) => {
  if (!input || typeof input !== 'object' || !('target' in input)) return input;
  const { target } = input;
  return target.type === 'checkbox' ? target.checked : target.value;
};

/**
 * Form state with validation. `rules` maps a field name to one validator or a list, run in order.
 * Errors appear on blur (once a field has been touched) or on submit with `validateOn='submit'`,
 * and re-check as the person types once shown. `handleSubmit(onValid)` blocks invalid submits and
 * bumps `submitCount`, which FormErrorSummary uses to take focus.
 */
export function useFormValidation({ initialValues = {}, rules = {}, validateOn = 'blur' } = {}) {
  const formId = useId();
  const [ values, setValuesState ] = useState(initialValues);
  const [ errors, setErrors ] = useState({});
  const [ touched, setTouched ] = useState({});
  const [ submitCount, setSubmitCount ] = useState(0);
  const [ submitting, setSubmitting ] = useState(false);
  // Refs keep handlers stable when callers pass inline rules, and let blur read the latest values.
  const rulesRef = useRef(rules);
  const valuesRef = useRef(values);
  const initialRef = useRef(initialValues);
  const live = useRef(new Set());
  rulesRef.current = rules;

  const id = useCallback((name) => `${formId}-${name}`, [ formId ]);
  const errorId = useCallback((name) => `${formId}-${name}-error`, [ formId ]);

  const check = useCallback((name, nextValues) => {
    const message = runRules(rulesRef.current[name], nextValues[name], nextValues);
    setErrors((current) => {
      if ((current[name] || '') === message) return current;
      const next = { ...current };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
    return message;
  }, []);

  const validate = useCallback((nextValues = valuesRef.current) => {
    const next = {};
    for (const [ name, rule ] of Object.entries(rulesRef.current)) {
      const message = runRules(rule, nextValues[name], nextValues);
      if (message) next[name] = message;
    }
    setErrors(next);
    return next;
  }, []);

  const setValues = useCallback((update) => {
    const next = typeof update === 'function' ? update(valuesRef.current) : update;
    valuesRef.current = next;
    setValuesState(next);
    // Fields that already show feedback re-check as they change, including fields that depend on others.
    live.current.forEach((name) => check(name, next));
  }, [ check ]);

  const setValue = useCallback((name, input) => {
    setValues((current) => ({ ...current, [name]: readEvent(input) }));
  }, [ setValues ]);

  const blur = useCallback((name) => {
    setTouched((current) => (current[name] ? current : { ...current, [name]: true }));
    if (validateOn === 'blur' && rulesRef.current[name]) {
      live.current.add(name);
      check(name, valuesRef.current);
    }
  }, [ check, validateOn ]);

  // Props for a text-like control: value, change and blur handlers plus the ARIA links to its error.
  const field = useCallback((name, { describedBy } = {}) => ({
    id: id(name),
    name,
    value: values[name] ?? '',
    onChange: (event) => setValue(name, event),
    onBlur: () => blur(name),
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': [ describedBy, errors[name] ? errorId(name) : null ].filter(Boolean).join(' ') || undefined
  }), [ blur, errorId, errors, id, setValue, values ]);

  const handleSubmit = useCallback((onValid) => async (event) => {
    event?.preventDefault?.();
    const next = validate(valuesRef.current);
    Object.keys(rulesRef.current).forEach((name) => live.current.add(name));
    setSubmitCount((count) => count + 1);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      await onValid?.(valuesRef.current);
    } finally {
      setSubmitting(false);
    }
  }, [ validate ]);

  const reset = useCallback((nextValues = initialRef.current) => {
    live.current = new Set();
    valuesRef.current = nextValues;
    setValuesState(nextValues);
    setErrors({});
    setTouched({});
    setSubmitCount(0);
  }, []);

  return {
    values,
    errors,
    touched,
    submitCount,
    submitting,
    isValid: Object.keys(errors).length === 0,
    id,
    errorId,
    field,
    setValue,
    setValues,
    setErrors,
    blur,
    validate,
    handleSubmit,
    reset
  };
}

const focusable = 'input:not([type=hidden]), select, textarea, button, [href], [tabindex="0"]';
// Groups such as a rating or a toggle row are not focusable themselves; focus their first control.
const focusControl = (target) => {
  if (!target) return;
  const control = target.matches(focusable) ? target : target.querySelector(focusable);
  (control || target).focus();
};

/**
 * Lists every invalid field after a failed submit and takes focus so screen readers announce it.
 * Each entry links to its control; activating it moves focus there.
 */
export function FormErrorSummary({ form, labels = {}, title, className }) {
  const ref = useRef(null);
  const entries = Object.entries(form?.errors || {});
  const shown = form?.submitCount > 0 && entries.length > 0;

  useEffect(() => {
    if (shown) ref.current?.focus();
    // Focus only after each submit, not as errors clear while typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ form?.submitCount ]);

  if (!shown) return null;
  const heading = title || (entries.length === 1 ? 'Fix 1 problem to continue' : `Fix ${entries.length} problems to continue`);
  return (
    <Alert ref={ref} tabIndex={-1} variant='destructive' data-slot='form-error-summary' aria-labelledby={`${form.id('summary')}-title`} className={cn('outline-none focus-visible:ring-2 focus-visible:ring-danger/40', className)}>
      <RegistryIcon lucide='CircleAlertIcon' aria-hidden='true' />
      <AlertTitle id={`${form.id('summary')}-title`}>{heading}</AlertTitle>
      <AlertDescription>
        <ul className='grid gap-1'>
          {entries.map(([ name, message ]) => (
            <li key={name}>
              <a
                href={`#${form.id(name)}`}
                className='underline underline-offset-2'
                onClick={(event) => {
                  event.preventDefault();
                  focusControl(document.getElementById(form.id(name)));
                }}
              >
                {labels[name] ? `${labels[name]}: ` : ''}{message}
              </a>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

/**
 * A label and value you edit in place. Edit swaps in a control with Save and Cancel; Enter saves,
 * Escape cancels and focus returns to the Edit button. `onSave` may return a promise; a thrown
 * error or a `validate` message keeps the row open with the message linked to the control.
 */
export function EditableField({
  label,
  value,
  onSave,
  validate,
  format = (current) => current,
  description,
  placeholder,
  type = 'text',
  emptyLabel = 'Not set',
  renderControl,
  className
}) {
  const id = useId();
  const [ editing, setEditing ] = useState(false);
  const [ draft, setDraft ] = useState(value ?? '');
  const [ error, setError ] = useState('');
  const [ saving, setSaving ] = useState(false);
  const editButton = useRef(null);
  const control = useRef(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (editing) control.current?.focus?.();
    else if (returnFocus.current) {
      returnFocus.current = false;
      editButton.current?.focus();
    }
  }, [ editing ]);

  const open = () => {
    setDraft(value ?? '');
    setError('');
    setEditing(true);
  };
  const close = () => {
    returnFocus.current = true;
    setEditing(false);
  };
  const save = async () => {
    const message = validate?.(draft) || '';
    if (message) {
      setError(message);
      control.current?.focus?.();
      return;
    }
    setSaving(true);
    try {
      await onSave?.(draft);
      close();
    } catch (failure) {
      setError(failure?.message || 'Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };
  const keys = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault();
      save();
    }
  };
  const shown = format(value);
  const controlProps = {
    id: `${id}-control`,
    ref: control,
    value: draft,
    onChange: (event) => setDraft(readEvent(event)),
    onKeyDown: keys,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': [ description ? `${id}-description` : null, error ? `${id}-error` : null ].filter(Boolean).join(' ') || undefined
  };

  return (
    <div data-slot='editable-field' data-editing={editing || undefined} className={cn('grid gap-2 py-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-4', className)}>
      {editing ? (
        <Field className='sm:col-span-2'>
          <FieldLabel htmlFor={`${id}-control`}>{label}</FieldLabel>
          {renderControl ? renderControl(controlProps) : <Input {...controlProps} type={type} placeholder={placeholder} />}
          {description ? <FieldDescription id={`${id}-description`}>{description}</FieldDescription> : null}
          {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
          <div className='flex gap-2'>
            <Button size='sm' onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            <Button size='sm' variant='ghost' tone='neutral' onClick={close} disabled={saving}>Cancel</Button>
          </div>
        </Field>
      ) : (
        <>
          <span id={`${id}-label`} className='text-text-muted text-sm'>{label}</span>
          <div className='flex min-w-0 items-start justify-between gap-3'>
            <span aria-labelledby={`${id}-label`} className={cn('min-w-0 text-sm break-words', blank(shown) && 'text-text-muted')}>{blank(shown) ? emptyLabel : shown}</span>
            <Button ref={editButton} size='xs' variant='ghost' tone='neutral' aria-label={`Edit ${label}`} onClick={open} className='-my-1 shrink-0'>
              <RegistryIcon lucide='PencilIcon' aria-hidden='true' />
              Edit
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

/** Live character count for a text field, announced politely as it nears the limit. */
export function CharacterCount({ value = '', max, id, className }) {
  const length = String(value).length;
  const left = max - length;
  const near = left <= Math.max(10, Math.round(max * 0.1));
  return (
    <span id={id} aria-live={near ? 'polite' : 'off'} className={cn('text-xs tabular-nums', left < 0 ? 'text-danger' : 'text-text-muted', className)}>
      {left < 0 ? `${-left} over the limit` : `${left} characters left`}
    </span>
  );
}


export default FormErrorSummary;
