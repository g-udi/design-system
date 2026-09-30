/**
 * Details/FAQ Component
 *
 * @description An interactive disclosure component for displaying expandable FAQ sections or details.
 * Uses a native button with aria-expanded/aria-controls and a controlled panel. The title renders
 * once, as the disclosure button inside a heading at `headingLevel`.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

'use client';

import { useId, useState } from 'react';

import Icon from '../../core/Icon';

const Details = ({ title, children, headingLevel = 2, ...rest }) => {
  const [ open, setOpen ] = useState(false);
  const panelId = useId();
  const Heading = `h${headingLevel}`;

  return (
    <div className='my-8 border-y border-gray-900/10 py-2 dark:border-white/10'>
      <Heading className='m-0'>
        <button
          aria-controls={ panelId }
          aria-expanded={ open }
          className='flex min-h-11 w-full items-center justify-between text-left text-gray-900 dark:text-white'
          type='button'
          onClick={ () => setOpen((currentOpen) => !currentOpen) }
        >
          <span className='text-base font-semibold leading-7'>{title}</span>
          <span className='ml-6 flex h-7 items-center'>
            <Icon name={ open ? 'Minus' : 'Plus' } size='sm' decorative />
          </span>
        </button>
      </Heading>
      {open ? (
        <div id={ panelId } className='pb-2 text-base leading-7 text-gray-600 dark:text-gray-300' { ...rest }>
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default Details;
