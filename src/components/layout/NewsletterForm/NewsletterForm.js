'use client';

/**
 * Newsletter Form Component
 *
 * @description Newsletter subscription form component that submits to an explicitly configured host endpoint.
 * Provides email validation, submission handling, and success/error feedback states.
 * Features responsive design with inline form layout and disabled state after subscription.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useId, useRef, useState } from 'react';

import Button from '../../core/Button';

import { cn } from '../../../utilities/cn';
import { EmailInput } from '../../core/Input/index.js';

/**
 * Newsletter subscription form component
 *
 * @description Renders a newsletter subscription form with email input and submit button.
 * Handles form submission to the host endpoint, manages subscription state, and provides
 * user feedback for success and error cases.
 *
 * @param {Object} props - Component props
 * @param {string} [props.endpoint] - Explicit subscription API endpoint to POST the email to; missing endpoints disable signup
 * @param {string} [props.title='Subscribe to the newsletter'] - Form heading
 * @param {string} [props.className] - Root classes
 * @param {Object} [props.classNames] - Part classes (root, title, description, form, input, action, button, message)
 *
 * @returns {JSX.Element} Newsletter subscription form
 *
 * @example
 * <NewsletterForm endpoint="/api/newsletter" title="Join our newsletter" />
 */
const NewsletterForm = ({ className, classNames = {}, endpoint, title = 'Subscribe to the newsletter' }) => {
  const abortControllerRef = useRef(null);
  const inputEl = useRef(null);
  const mountedRef = useRef(false);
  const inputId = useId();
  const messageId = useId();
  const [ error, setError ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ submitting, setSubmitting ] = useState(false);
  const [ subscribed, setSubscribed ] = useState(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  /**
   * Handles newsletter subscription form submission
   *
   * @param {Event} event - Form submission event
   */
  const subscribe = async(event) => {
    event.preventDefault();

    if (!endpoint || subscribed || submitting || abortControllerRef.current) return;

    const email = inputEl.current?.value?.trim();

    if (!email) {
      setError(true);
      setMessage('Enter a valid e-mail address.');

      return;
    }

    abortControllerRef.current?.abort();

    const controller = new AbortController();

    abortControllerRef.current = controller;
    setSubmitting(true);

    try {
      const res = await fetch(endpoint, {
        'body': JSON.stringify({
          email
        }),
        'headers': {
          'Content-Type': 'application/json'
        },
        'method': 'POST',
        'signal': controller.signal
      });

      let responseError = null;

      try {
        ({ 'error': responseError } = await res.json());
      } catch {
        // Guard against non-JSON responses (e.g. HTML error pages from the server).
        responseError = res.ok ? null : 'Unexpected response';
      }

      if (controller.signal.aborted || !mountedRef.current) return;

      if (responseError || !res.ok) {
        setError(true);
        setMessage('Your e-mail address is invalid or you are already subscribed!');

        return;
      }

      if (inputEl.current) inputEl.current.value = '';
      setError(false);
      setSubscribed(true);
      setMessage('You are now subscribed.');
    } catch (err) {
      if (err?.name === 'AbortError' || !mountedRef.current) return;

      setError(true);
      setMessage('Something went wrong. Please check your connection and try again.');
    } finally {
      if (abortControllerRef.current === controller) abortControllerRef.current = null;
      if (!controller.signal.aborted && mountedRef.current) setSubmitting(false);
    }
  };

  return (
    <div className={ cn('@container/newsletter mt-8 min-w-0', className, classNames.root) }>
      <h3 className={ cn('text-base font-medium text-text', classNames.title) }>{title}</h3>
      <p className={ cn('mt-4 text-base text-text-muted md:text-sm', classNames.description) }>
        Get new articles and resources in your inbox.
      </p>
      <form className={ cn('mt-4 flex max-w-md flex-col gap-3 @[24rem]/newsletter:flex-row', classNames.form) } onSubmit={ subscribe }>
        <label htmlFor={ inputId } className='sr-only'>
          Email address
        </label>
        <EmailInput
          autoComplete='email'
          id={ inputId }
          name='email'
          placeholder={ subscribed ? 'You are subscribed' : 'Enter your email' }
          ref={ inputEl }
          required

          disabled={ subscribed }
          invalid={ error }
          aria-describedby={ message ? messageId : undefined }
          inputClassName={ cn('min-h-11 px-4 py-2', classNames.input) }
          className='h-auto min-w-0 flex-1'
        />
        <div className={ cn('shrink-0', classNames.action) }>
          <Button
            type='submit'
            disabled={ !endpoint || subscribed || submitting }
            aria-busy={ submitting || undefined }
            className={ cn('min-h-11 w-full', classNames.button) }
            size='sm'
            variant='solid'
          >
            {subscribed ? 'Thank you!' : submitting ? 'Signing up…' : 'Sign up'}
          </Button>
        </div>
      </form>
      {!endpoint ? <p className='mt-3 text-sm text-text-muted'>Newsletter sign-up is currently unavailable.</p> : null}
      {message ? <p id={ messageId } role={ error ? 'alert' : 'status' } className={ cn('mt-3 text-sm', error ? 'text-danger' : 'text-success', classNames.message) }>{message}</p> : null}
    </div>
  );
};

export default NewsletterForm;
