'use client';

/**
 * Newsletter Form Component
 *
 * @description Newsletter subscription form component that integrates with Buttondown API.
 * Provides email validation, submission handling, and success/error feedback states.
 * Features responsive design with inline form layout and disabled state after subscription.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useId, useRef, useState } from 'react';

import Button from '../../core/Button';
import { FieldInput } from '../../core/Field';
import { cn } from '../../../utilities/cn';

/**
 * Newsletter subscription form component
 *
 * @description Renders a newsletter subscription form with email input and submit button.
 * Handles form submission to Buttondown API, manages subscription state, and provides
 * user feedback for success and error cases.
 *
 * @param {Object} props - Component props
 * @param {string} [props.endpoint='/api/buttondown'] - Subscription API endpoint to POST the email to
 * @param {string} [props.title='Subscribe to the newsletter'] - Form heading
 * @param {string} [props.className] - Root classes
 * @param {Object} [props.classNames] - Part classes (root, title, description, form, input, action, button, message)
 *
 * @returns {JSX.Element} Newsletter subscription form
 *
 * @example
 * <NewsletterForm title="Join our newsletter" />
 */
const NewsletterForm = ({ className, classNames = {}, endpoint = '/api/buttondown', title = 'Subscribe to the newsletter' }) => {
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

    if (submitting) return;

    const email = inputEl.current?.value?.trim();

    if (!email) {
      setError(true);
      setMessage('Enter a valid e-mail address.');

      return;
    }

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    const subscriptionEndpoint = endpoint || '/api/buttondown';

    abortControllerRef.current = controller;
    setSubmitting(true);

    try {
      const res = await fetch(subscriptionEndpoint, {
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
    <div className={ cn('mt-8 xl:col-span-2 xl:mt-0', className, classNames.root) }>
      <h3 className={ cn('text-base font-medium text-text', classNames.title) }>{title}</h3>
      <p className={ cn('mt-4 text-base text-text-muted md:text-sm', classNames.description) }>
        The latest articles, readings, and resources, sent to your inbox monthly.
      </p>
      <form className={ cn('mt-4 sm:flex sm:max-w-md', classNames.form) } onSubmit={ subscribe }>
        <label htmlFor={ inputId } className='sr-only'>
          Email address
        </label>
        <FieldInput
          autoComplete='email'
          id={ inputId }
          name='email'
          placeholder={ subscribed ? 'You are subscribed' : 'Enter your email' }
          ref={ inputEl }
          required
          type='email'
          disabled={ subscribed }
          invalid={ error }
          aria-describedby={ message ? messageId : undefined }
          className={ cn('min-h-11 px-4 py-2', classNames.input) }
        />
        <div className={ cn('mt-3 sm:ml-3 sm:mt-0 sm:shrink-0', classNames.action) }>
          <Button
            type='submit'
            disabled={ subscribed || submitting }
            aria-busy={ submitting || undefined }
            className={ cn('w-full', classNames.button) }
            size='sm'
            variant='solid'
          >
            {subscribed ? 'Thank you!' : submitting ? 'Signing up…' : 'Sign up'}
          </Button>
        </div>
      </form>
      {message ? <p id={ messageId } role={ error ? 'alert' : 'status' } className={ cn('mt-3 text-sm', error ? 'text-danger' : 'text-success', classNames.message) }>{message}</p> : null}
    </div>
  );
};

export default NewsletterForm;

/**
 * Blog-specific newsletter form with styled wrapper
 *
 * @description Newsletter form variant with additional styling and background for use within blog content.
 * Wraps the main NewsletterForm component with centered layout and background styling.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Form title to pass to NewsletterForm
 *
 * @returns {JSX.Element} Styled newsletter form for blog context
 *
 * @example
 * <BlogNewsletterForm title="Subscribe for updates" />
 */
export const BlogNewsletterForm = ({ classNames = {}, title }) => (
  <div className={ cn('flex items-center justify-center', classNames.root) }>
    <div className={ cn('rounded-card bg-surface-muted p-6 sm:px-14 sm:py-8', classNames.frame) }>
      <NewsletterForm title={ title } classNames={ classNames.form } />
    </div>
  </div>
);
