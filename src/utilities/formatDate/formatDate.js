/**
 * Date Formatting Utility
 *
 * @description Formats a date with full month name, day, and year for the given locale.
 * Owned by the design system so components do not depend on consumer-side utilities.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

/**
 * Formats a date according to the given locale
 *
 * @param {string|Date} date - The date to format
 * @param {string} [locale='en-US'] - BCP 47 locale tag
 * @param {{ month?: 'long' | 'short' }} [options] - Month style; `short` gives "Dec 25, 2023"
 * @returns {string} The formatted date string, or an empty string for invalid input
 *
 * @example
 * formatDate('2023-12-25') // "December 25, 2023"
 * formatDate('2023-12-25', 'de-DE') // "25. Dezember 2023"
 * formatDate('2023-12-25', 'en-US', { month: 'short' }) // "Dec 25, 2023"
 */
const defaultLocale = 'en-US';
const dateOptions = {
  'day': 'numeric',
  'month': 'long',
  'year': 'numeric'
};

const formatDate = (date, locale = defaultLocale, { month = 'long' } = {}) => {
  if (date === null || typeof date === 'undefined' || date === '') return '';

  const parsed = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsed.getTime())) return '';

  // A calendar date has no timezone; keep its day in every server/browser locale.
  const options = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? { ...dateOptions, month, timeZone: 'UTC' }
    : { ...dateOptions, month };

  try {
    return new Intl.DateTimeFormat(locale || defaultLocale, options).format(parsed);
  } catch {
    return new Intl.DateTimeFormat(defaultLocale, options).format(parsed);
  }
};

export default formatDate;
