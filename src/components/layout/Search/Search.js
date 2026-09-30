'use client';

import { useId, useState } from 'react';

import Icon from '../../core/Icon';
import Input, { InputGroupButton } from '../../core/Input';

/**
 * Search Component
 *
 * @description Article filter built on the Gaudi Input: a search icon, a clear
 * button once there is a query, and a callback on every change.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

/**
 * Subtle search input component for article filtering
 *
 * @param {Object} props - Component props
 * @param {string} [props.label='Filter articles'] - Accessible input label
 * @param {string} [props.resultsId] - ID of the filtered results region
 * @param {Function} props.setSearchValue - Callback function to handle search value changes
 * @param {string} [props.value] - Controlled search value
 * @returns {JSX.Element} Search landmark with a labelled search input
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * <Search setSearchValue={setSearchTerm} />
 */
const Search = ({ label = 'Filter articles', resultsId, setSearchValue, value }) => {
  const generatedId = useId();
  const inputId = `article-filter-${generatedId}`;
  const [ internalValue, setInternalValue ] = useState('');
  const currentValue = value ?? internalValue;
  const handleChange = (nextValue) => {
    if (value === undefined) setInternalValue(nextValue);
    setSearchValue?.(nextValue);
  };

  return (
    <div role='search'>
      <label htmlFor={ inputId } className='sr-only'>{label}</label>
      <Input
        id={ inputId }
        aria-controls={ resultsId }
        type='search'
        value={ currentValue }
        onChange={ (event) => handleChange(event.target.value) }
        placeholder={ label }
        className='h-11 bg-surface'
        inputClassName='text-base [&::-webkit-search-cancel-button]:appearance-none'
        prefix={ <Icon name='Search' decorative size='sm' /> }
        suffix={ currentValue ? (
          <InputGroupButton size='icon-sm' tone='neutral' aria-label='Clear article filter' onClick={ () => handleChange('') }>
            <Icon name='X' decorative size='sm' />
          </InputGroupButton>
        ) : null }
      />
    </div>
  );
};

export default Search;
