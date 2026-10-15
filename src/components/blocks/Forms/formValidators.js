// Server-safe form validation rules shared by useFormValidation and its callers.

export const blank = (value) => value == null || (typeof value === 'string' && value.trim() === '') || value === false || (Array.isArray(value) && value.length === 0);

// Each validator returns a message when the value fails, or an empty string.
export const validators = {
  required: (message = 'This field is required.') => (value) => (blank(value) ? message : ''),
  email: (message = 'Enter an email address like name@example.com.') => (value) =>
    !blank(value) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()) ? message : '',
  minLength: (length, message) => (value) =>
    !blank(value) && String(value).trim().length < length ? message || `Use at least ${length} characters.` : '',
  maxLength: (length, message) => (value) =>
    !blank(value) && String(value).length > length ? message || `Use ${length} characters or fewer.` : '',
  pattern: (expression, message = 'Check the format.') => (value) => {
    if (blank(value)) return '';
    const previousIndex = expression.lastIndex;
    expression.lastIndex = 0;
    const valid = expression.test(String(value));
    expression.lastIndex = previousIndex;
    return valid ? '' : message;
  },
  min: (limit, message) => (value) => (!blank(value) && (!Number.isFinite(Number(value)) || Number(value) < limit) ? message || `Enter ${limit} or more.` : ''),
  max: (limit, message) => (value) => (!blank(value) && (!Number.isFinite(Number(value)) || Number(value) > limit) ? message || `Enter ${limit} or less.` : '')
};
