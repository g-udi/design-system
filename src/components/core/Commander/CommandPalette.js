'use client';

import { createContext, isValidElement, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import Button from '../Button';
import Dialog from '../Dialog';
import Icon from '../Icon';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './Command.jsx';
import { normalizeHref } from '../../../utilities/href.js';

const CommandPaletteContext = createContext(null);

const normalizeSearchValue = (value) => String(value || '').trim().toLowerCase();

const itemSearchFields = [ 'children', 'title', 'subtitle', 'category', 'display', 'name', 'id', 'type' ];

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

/** Substring search over item text; a list whose heading matches keeps all of its items when `filterOnListHeading` is set. */
export const filterItems = (lists = [], search = '') => {
  const query = normalizeSearchValue(search);

  if (!query) return lists.filter((list) => Array.isArray(list.items) && list.items.length);

  return lists.reduce((result, list) => {
    const items = Array.isArray(list.items) ? list.items : [];
    const headingMatches = list.options?.filterOnListHeading && normalizeSearchValue(list.heading).includes(query);
    const filteredItems = headingMatches ? items : items.filter((item) => getItemSearchText(item).includes(query));

    if (filteredItems.length) result.push({ ...list, 'items': filteredItems });

    return result;
  }, []);
};

/*
 * The launcher is the Command parts inside a bare Dialog. The Dialog owns the portal, focus trap, scroll lock and
 * Escape; cmdk owns the listbox, selection and keyboard navigation. Filtering stays here (shouldFilter={false}) so
 * list headings can match and sub-pages can filter their own collections.
 */
const CommandPalette = ({ children, footer, isOpen, onChangeOpen, onChangeSearch, page = 'root', restoreFocusRef, search = '' }) => {
  const inputRef = useRef(null);
  const escapeHandlerRef = useRef(null);

  const close = useCallback(() => onChangeOpen?.(false), [ onChangeOpen ]);

  const contextValue = useMemo(() => ({
    close,
    page,
    'setEscapeHandler': (handler) => {
      escapeHandlerRef.current = handler || null;
    }
  }), [ close, page ]);

  // A new page keeps the search field focused.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [ isOpen, page ]);

  if (!isOpen) return null;

  return (
    <CommandPaletteContext.Provider value={ contextValue }>
      <Dialog
        variant='bare'
        open
        onOpenChange={ (open) => !open && close() }
        initialFocusRef={ inputRef }
        restoreFocusRef={ restoreFocusRef }
        label='Command launcher'
        className='ds-command-launcher'
        contentProps={ {
          // Escape leaves a sub-page before it closes the launcher.
          'onEscapeKeyDown': (event) => {
            if (!escapeHandlerRef.current) return;
            event.preventDefault();
            escapeHandlerRef.current();
          }
        } }
      >
        {/* A fresh Command per page selects its first item, as the root does. */}
        <Command key={ page } shouldFilter={ false } loop label='Search commands' className='ds-command-launcher-panel h-auto w-full max-w-[36rem]'>
          <CommandInput
            ref={ inputRef }
            placeholder='Search posts, projects and pages…'
            spellCheck={ false }
            value={ search }
            onValueChange={ onChangeSearch }
          >
            <Button variant='ghost' tone='neutral' size='icon-sm' aria-label='Close command launcher' onClick={ close }>
              <Icon name='X' size='sm' decorative />
            </Button>
          </CommandInput>
          <CommandList className='ds-command-launcher-list'>{children}</CommandList>
          {footer}
        </Command>
      </Dialog>
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

  return isCurrentPage ? children : null;
};

const List = ({ children, heading }) => <CommandGroup heading={ heading }>{children}</CommandGroup>;

const ListItem = ({ children, closeOnSelect = true, disabled = false, href, onClick, value }) => {
  const context = useContext(CommandPaletteContext);

  // Pointer and Enter both select; links navigate the same way the address bar would.
  const handleSelect = () => {
    onClick?.();
    if (closeOnSelect) context?.close();
    const destination = normalizeHref(href);
    if (typeof destination === 'string' && destination) window.location.assign(destination);
  };

  return (
    <CommandItem value={ value } disabled={ disabled } onSelect={ handleSelect } data-close-on-select={ closeOnSelect ? 'true' : 'false' }>
      {children}
    </CommandItem>
  );
};

const Empty = ({ children = 'No matching commands.' }) => <CommandEmpty className='flex items-center justify-center gap-2'>{children}</CommandEmpty>;

CommandPalette.Page = Page;
CommandPalette.List = List;
CommandPalette.ListItem = ListItem;
CommandPalette.Empty = Empty;

export default CommandPalette;
