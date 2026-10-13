'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { useIsMounted } from '../../../hooks/environment/use-is-mounted.js';

import Button from '../../core/Button';
import Typography from '../../../foundations/Typography';

import { cn } from '../../../utilities/cn';
import { EmailInput } from '../../core/Input/index.js';

const NewsletterForm = ({
  className, classNames = {}, endpoint, title = 'Subscribe to the newsletter',
  description = 'Get new articles and resources in your inbox.', headingAs = 'h3', titleVariant,
  children, ...props
}) => {
  const abortControllerRef = useRef(null);
  const inputEl = useRef(null);
  const isMounted = useIsMounted();
  const inputId = useId();
  const messageId = useId();
  const [ error, setError ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ submitting, setSubmitting ] = useState(false);
  const [ subscribed, setSubscribed ] = useState(false);

  useEffect(() => {
    setError(false);
    setMessage('');
    setSubmitting(false);
    setSubscribed(false);

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, [endpoint]);

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
    setError(false);
    setMessage('');

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

      if (controller.signal.aborted || !isMounted()) return;

      if (responseError || !res.ok) {
        setError(true);
        setMessage('We could not subscribe you. Please try again.');

        return;
      }

      if (inputEl.current) inputEl.current.value = '';
      setError(false);
      setSubscribed(true);
      setMessage('You are now subscribed.');
    } catch (err) {
      if (controller.signal.aborted || err?.name === 'AbortError' || !isMounted()) return;

      setError(true);
      setMessage('Something went wrong. Please check your connection and try again.');
    } finally {
      if (abortControllerRef.current === controller) abortControllerRef.current = null;
      if (!controller.signal.aborted && isMounted()) setSubmitting(false);
    }
  };

  return (
    <div {...props} data-slot='newsletter-form' className={ cn('mt-8 min-w-0', className, classNames.root) }>
      {(title || description) && <div className={classNames.header}>
        {title && <Typography as={headingAs} variant={titleVariant || 'paragraph-md'} className={cn(!titleVariant && 'text-base md:text-base font-medium leading-normal text-text', classNames.title)}>{title}</Typography>}
        {description && <Typography variant='paragraph-md' className={cn(title && 'mt-4', 'text-base leading-normal md:text-sm', classNames.description)}>{description}</Typography>}
      </div>}
      <div className={cn('@container/newsletter min-w-0', classNames.body)}>
        <form aria-label='Newsletter signup' className={ cn('mt-4 flex max-w-md flex-col gap-3 @[24rem]/newsletter:flex-row', classNames.form) } onSubmit={ subscribe }>
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

            disabled={ subscribed || submitting }
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
        {children}
      </div>
    </div>
  );
};

export default NewsletterForm;
