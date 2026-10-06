'use client';
import { createContext, useContext } from 'react';
import { DEFAULT_DATE_SELECTOR_I18N } from './dateSelectorLabels.js';
const DateSelectorContext = createContext({
  i18n: DEFAULT_DATE_SELECTOR_I18N,
  variant: 'outline',
  size: 'default'
});
export const useDateSelectorContext = () => useContext(DateSelectorContext);
export { DateSelectorContext };
