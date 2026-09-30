'use client';

import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';

import DialogPortal from '../DialogPortal';
import Icon from '../Icon';

const CommandPaletteContext = createContext(null);

const normalizeSearchValue = (value) => String(value || '').trim().toLowerCase();

const itemSearchFields = [
  'children',
  'title',
  'subtitle',
  'category',
  'display',
  'name',
  'id',
  'type'
];

const getTextFromNode = (node) => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node || typeof node === 'boolean') return '';
  if (Array.isArray(node)) return node.map(getTextFromNode).filter(Boolean).join(' ');
  if (isValidElement(node)) return getTextFromNode(node.props.children);

  return '';
};

const getItemSearchText = (item) => {
  const values = itemSearchFields.map((field) => {
    const value = item[field];

    return isValidElement(value) ? getTextFromNode(value) : value;
  });

  if (Array.isArray(item.keywords)) values.push(...item.keywords);

  return values
    .filter((value) => typeof value !== 'undefined' && value !== null)
    .map((value) => String(value))
    .join(' ')
    .toLowerCase();
};

export const filterItems = (lists = [], search = '') => {
  const query = normalizeSearchValue(search);

  if (!query) return lists.filter((list) => Array.isArray(list.items) && list.items.length);

  return lists.reduce((result, list) => {
    const items = Array.isArray(list.items) ? list.items : [];
    const headingMatches = list.options?.filterOnListHeading && normalizeSearchValue(list.heading).includes(query);
    const filteredItems = headingMatches
      ? items
      : items.filter((item) => getItemSearchText(item).includes(query));

    if (filteredItems.length) result.push({ ...list, 'items': filteredItems });

    return result;
  }, []);
};

export const getItemIndexMap = (lists = [], startIndex = 0) => {
  const indexById = new Map();
  let index = startIndex;

  for (const list of lists)
    for (const item of list.items || []) {
      if (!indexById.has(item.id)) indexById.set(item.id, index);

      index += 1;
    }

  return indexById;
};

const isHidden = (element) => {
  if (!element || element.hidden || element.getAttribute('aria-hidden') === 'true') return true;

  if (typeof window === 'undefined') return false;

  let current = element;

  while (current && current !== document.body) {
    if (current.hidden || current.getAttribute('aria-hidden') === 'true') return true;

    const style = window.getComputedStyle(current);

    if (style.display === 'none' || style.visibility === 'hidden') return true;

    current = current.parentElement;
  }

  return false;
};

const getFocusableElements = (root) => {
  if (!root) return [];

  return Array.from(root.querySelectorAll([
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(','))).filter((element) => !isHidden(element));
};

const CommandPalette = ({
  children,
  className = 'gaudi-command-launcher',
  footer,
  isOpen,
  onChangeOpen,
  onChangeSearch,
  onChangeSelected,
  page = 'root',
  restoreFocusRef,
  search = '',
  selected = 0
}) => {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const escapeHandlerRef = useRef(null);

  const close = useCallback(() => {
    onChangeOpen?.(false);
  }, [ onChangeOpen ]);

  const getSelectableItems = useCallback(() => {
    if (!dialogRef.current) return [];

    return Array.from(dialogRef.current.querySelectorAll('.command-palette-list-item'))
      .filter((element) => {
        return !element.hasAttribute('disabled') &&
          element.getAttribute('aria-disabled') !== 'true' &&
          !isHidden(element);
      });
  }, []);

  const setSelectedIndex = useCallback((nextIndex) => {
    const items = getSelectableItems();

    if (!items.length) {
      onChangeSelected?.(0);

      return;
    }

    const normalizedIndex = ((nextIndex % items.length) + items.length) % items.length;

    onChangeSelected?.(normalizedIndex);
    items[normalizedIndex]?.scrollIntoView({ 'block': 'nearest' });
  }, [ getSelectableItems, onChangeSelected ]);

  const contextValue = useMemo(() => {
    return {
      close,
      onChangeSelected,
      page,
      selected,
      setEscapeHandler: (handler) => {
        escapeHandlerRef.current = handler || null;
      }
    };
  }, [ close, onChangeSelected, page, selected ]);

  useEffect(() => {
    if (!isOpen) return;

    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [ isOpen, page ]);

  useEffect(() => {
    if (!isOpen) return;

    onChangeSelected?.(0);
  }, [ isOpen, onChangeSelected, page, search ]);

  useEffect(() => {
    if (!isOpen) return;

    const items = getSelectableItems();

    if (!items.length) return;

    const normalizedSelected = Math.min(Math.max(selected, 0), items.length - 1);
    const list = dialogRef.current?.querySelector('[data-cmdk-list]');

    if (normalizedSelected === 0 && list) {
      list.scrollTop = 0;

      return;
    }

    items[normalizedSelected]?.scrollIntoView({ 'block': 'nearest' });
  }, [ getSelectableItems, isOpen, selected, page, search ]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();

      if (escapeHandlerRef.current) {
        escapeHandlerRef.current();
      } else {
        close();
      }

      return;
    }

    if (event.key === 'ArrowDown' || ((event.ctrlKey || event.metaKey) && (event.key === 'j' || event.key === 'n'))) {
      event.preventDefault();
      setSelectedIndex(selected + 1);

      return;
    }

    if (event.key === 'ArrowUp' || ((event.ctrlKey || event.metaKey) && (event.key === 'k' || event.key === 'p'))) {
      event.preventDefault();
      setSelectedIndex(selected - 1);

      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setSelectedIndex(0);

      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setSelectedIndex(getSelectableItems().length - 1);

      return;
    }

    if (event.key === 'Enter' && event.target === inputRef.current && !event.isComposing) {
      const items = getSelectableItems();
      const item = items[selected] || items[0];

      if (item) {
        event.preventDefault();
        item.click();
      }

      return;
    }

    if (event.key === 'Tab') {
      const focusable = getFocusableElements(dialogRef.current);

      if (!focusable.length) return;

      const activeIndex = focusable.indexOf(document.activeElement);
      const isFirst = activeIndex <= 0;
      const isLast = activeIndex === focusable.length - 1;

      if (event.shiftKey && isFirst) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!event.shiftKey && isLast) {
        event.preventDefault();
        focusable[0].focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <CommandPaletteContext.Provider value={ contextValue }>
      <DialogPortal initialFocusRef={ inputRef } restoreFocusRef={ restoreFocusRef }>
        <div className={ className }>
          <div className='command-palette'>
            <div aria-hidden='true' className='command-palette__overlay' />
            <div
              className='command-palette__viewport'
              onClick={ (event) => {
                if (event.target === event.currentTarget) close();
              } }
            >
              <div
                ref={ dialogRef }
                aria-label='Command launcher'
                aria-modal='true'
                data-cmdk-root
                role='dialog'
                onKeyDown={ handleKeyDown }
              >
                <div className='command-palette__search'>
                  <Icon name='Search' size='sm' decorative className='command-palette__search-icon' />
                  <input
                    ref={ inputRef }
                    aria-label='Search commands'
                    autoComplete='off'
                    data-cmdk-input
                    placeholder='Search'
                    spellCheck={ false }
                    type='text'
                    value={ search }
                    onChange={ (event) => onChangeSearch?.(event.target.value) }
                  />
                  <button
                    type='button'
                    className='command-palette__close'
                    aria-label='Close command launcher'
                    onClick={ close }
                  >
                    <Icon name='X' size='sm' decorative />
                  </button>
                </div>
                <div data-cmdk-list>
                  {children}
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </DialogPortal>
    </CommandPaletteContext.Provider>
  );
};

const Page = ({ children, id, onEscape }) => {
  const context = useContext(CommandPaletteContext);
  const isCurrentPage = context?.page === id;

  useEffect(() => {
    if (!isCurrentPage) return undefined;

    context?.setEscapeHandler(onEscape);

    return () => context?.setEscapeHandler(null);
  }, [ context, isCurrentPage, onEscape ]);

  if (!isCurrentPage) return null;

  return <>{children}</>;
};

const List = ({ children, heading }) => {
  const items = Children.toArray(children).filter(Boolean);

  if (!items.length) return null;

  return (
    <section data-cmdk-group>
      {heading ? <h3 data-cmdk-group-heading>{heading}</h3> : null}
      <div>{items}</div>
    </section>
  );
};

const ListItem = ({
  children,
  className,
  closeOnSelect = true,
  disabled = false,
  href,
  index = 0,
  onClick,
  ...props
}) => {
  const context = useContext(CommandPaletteContext);
  const isSelected = context?.selected === index;
  const Component = href ? 'a' : 'button';
  const { 'showType': ignoredShowType, ...domProps } = props;

  void ignoredShowType;

  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();

      return;
    }

    onClick?.(event);

    if (!event.defaultPrevented && closeOnSelect) context?.close();
  };

  const itemProps = {
    ...domProps,
    'aria-disabled': disabled || undefined,
    'aria-selected': isSelected ? 'true' : 'false',
    'className': [ 'command-palette-list-item', className ].filter(Boolean).join(' '),
    'data-close-on-select': closeOnSelect ? 'true' : 'false',
    'data-cmdk-item': '',
    'href': href || undefined,
    'onClick': handleClick,
    'onMouseMove': () => context?.onChangeSelected?.(index)
  };

  if (!href) itemProps.type = 'button';
  if (disabled) itemProps.disabled = true;

  return <Component { ...itemProps }>{children}</Component>;
};

const FreeSearchAction = () => (
  <div data-cmdk-empty className='px-3 py-3 text-sm'>
    No matching commands.
  </div>
);

CommandPalette.Page = Page;
CommandPalette.List = List;
CommandPalette.ListItem = ListItem;
CommandPalette.FreeSearchAction = FreeSearchAction;

export default CommandPalette;
