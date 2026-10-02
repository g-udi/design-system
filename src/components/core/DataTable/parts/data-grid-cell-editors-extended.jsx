'use client';
// Built-in cell editors. The spreadsheet overlay opens one of these flush over
// the focused cell (`DataGridCellEditorControl`); per-row edit mode renders
// the inline variants in every editable cell (`DataGridCellInlineEditor`).
// Both reuse the Gaudi Select, Combobox, Calendar, Popover, Checkbox and
// Switch, so the editors look and behave like every other form control.
import { useRef, useState } from 'react';
import { format as formatDate, parseISO, isValid } from 'date-fns';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { FieldInput } from '../../Field/index.js';
import { Calendar } from '../../Calendar/parts/calendar.jsx';
import { Checkbox } from '../../Checkbox/parts/checkbox.jsx';
import { Switch } from '../../Switch/parts/switch.jsx';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger
} from '../../Popover/parts/popover.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../Select/parts/select.jsx';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '../../Select/parts/combobox.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import {
  formatDataGridCellEditValue,
  getDataGridCellEditOptions,
  resolveDataGridCellEdit
} from './data-grid-cell-edit.js';

/** Controls the spreadsheet overlay delegates to this module; text and textarea stay in the overlay itself. */
export const DATA_GRID_BUILT_IN_OVERLAY_CONTROLS = new Set([
  'number',
  'select',
  'combobox',
  'date'
]);

const overlayClassName =
  // The global focus reset removes outlines from focused fields, so the
  // editor frame is an inset shadow: one 1px line exactly on the cell edge.
  'text-ui-foreground bg-ui-background absolute z-[35] box-border shadow-[inset_0_0_0_1px_var(--primary)] aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)]';

function toDataGridDate(value) {
  if (!value) return void 0;
  const date = value instanceof Date ? value : parseISO(String(value));
  return isValid(date) ? date : void 0;
}

function focusDataGridCalendarDay(content) {
  const day =
    content?.querySelector('[data-selected=true] button') ??
    content?.querySelector('[data-today=true] button, [data-today] button') ??
    content?.querySelector('button[data-day]');
  day?.focus();
}

/** One editing session's control in the overlay. `onCommit(raw, advance, refocus, typed)` takes a `{ value }` when the control produced a typed value. */
export function DataGridCellEditorControl({
  session,
  style,
  enterAdvance,
  onCommit,
  onCancel
}) {
  const finishedRef = useRef(false);
  const cellEdit = resolveDataGridCellEdit(session.cellEdit);
  const commit = (raw, advance = null, refocus = true, typed) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onCommit(raw, advance, refocus, typed);
  };
  const cancel = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onCancel();
  };
  // The cell's own error message (rendered by the cell) describes the editor.
  const shared = {
    'aria-label': session.label,
    'aria-invalid': session.error ? true : void 0,
    'aria-describedby': session.error ? session.errorId : void 0
  };
  const textKeys = (event, element) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      cancel();
      return true;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      commit(element.value, event.shiftKey ? 'left' : 'right');
      return true;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      commit(element.value, enterAdvance ? (event.shiftKey ? 'up' : 'down') : null);
      return true;
    }
    return false;
  };
  if (session.control === 'number') {
    const step = cellEdit.step ?? 1;
    return (
      <>
        <input
          data-slot='data-grid-cell-editor'
          ref={(element) => {
            const end = element?.value.length ?? 0;
            element?.setSelectionRange?.(end, end);
          }}
          autoFocus
          inputMode='decimal'
          {...shared}
          defaultValue={session.initialValue}
          style={style}
          className={cn(overlayClassName, 'tabular-nums')}
          onKeyDown={(event) => {
            if (textKeys(event, event.currentTarget)) return;
            if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
            event.preventDefault();
            const element = event.currentTarget;
            const current = cellEdit.parse?.(element.value, session.row);
            const base = typeof current === 'number' ? current : 0;
            const delta = (event.key === 'ArrowUp' ? 1 : -1) * step * (event.shiftKey ? 10 : 1);
            let next = Number((base + delta).toFixed(10));
            if (typeof cellEdit.min === 'number') next = Math.max(cellEdit.min, next);
            if (typeof cellEdit.max === 'number') next = Math.min(cellEdit.max, next);
            element.value = String(next);
          }}
          onBlur={(event) => commit(event.currentTarget.value, null, false)}
        />
      </>
    );
  }
  if (session.control === 'select') {
    return (
      <DataGridCellSelectEditor
        session={session}
        cellEdit={cellEdit}
        style={style}
        shared={shared}
        commit={commit}
        cancel={cancel}
      />
    );
  }
  if (session.control === 'combobox') {
    return (
      <DataGridCellComboboxEditor
        session={session}
        cellEdit={cellEdit}
        style={style}
        shared={shared}
        commit={commit}
        textKeys={textKeys}
      />
    );
  }
  return (
    <DataGridCellDateEditor
      session={session}
      style={style}
      shared={shared}
      commit={commit}
      cancel={cancel}
      textKeys={textKeys}
    />
  );
}

function DataGridCellSelectEditor({ session, cellEdit, style, shared, commit, cancel }) {
  const options = getDataGridCellEditOptions(cellEdit, session.row);
  const selectedIndex = options.findIndex((option) => option.value === session.value);
  return (
    <>
      <Select
        defaultOpen
        value={selectedIndex === -1 ? void 0 : String(selectedIndex)}
        onValueChange={(key) => {
          const option = options[Number(key)];
          if (option) commit(option.label, null, true, { value: option.value });
        }}
        onOpenChange={(open) => {
          if (!open) cancel();
        }}
      >
        <SelectTrigger
          data-slot='data-grid-cell-editor'
          {...shared}
          style={style}
          className={cn(overlayClassName, 'h-auto! rounded-none border-0 ring-0!')}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position='popper' align='start' sideOffset={2}>
          {options.map((option, index) => (
            <SelectItem key={String(option.value)} value={String(index)} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

function DataGridCellComboboxEditor({ session, cellEdit, style, shared, commit, textKeys }) {
  const options = getDataGridCellEditOptions(cellEdit, session.row);
  const pointerInPopup = useRef(false);
  // The frame sits on the cell; the input inside keeps the cell's font and
  // padding so the text does not jump when the editor opens.
  const { left, top, width, minHeight, ...text } = style;
  return (
    <>
      <Combobox
        items={options}
        defaultOpen
        autoHighlight
        defaultInputValue={session.initialValue}
        value={options.find((option) => option.value === session.value) ?? null}
        itemToStringLabel={(option) => option?.label ?? ''}
        isItemEqualToValue={(item, value) => item?.value === value?.value}
        onValueChange={(option) => {
          if (option) commit(option.label, null, true, { value: option.value });
        }}
      >
        <div
          data-slot='data-grid-cell-editor'
          style={{ left, top, width, minHeight }}
          className={cn(overlayClassName, 'has-aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)] flex')}
        >
          <ComboboxInput
            showTrigger={false}
            autoFocus
            {...shared}
            style={text}
            className='h-auto! min-h-full w-full rounded-none! border-0! bg-transparent! shadow-none! ring-0!'
            onKeyDown={(event) => {
              // With an option highlighted, Enter picks it through onValueChange.
              if (event.key === 'Enter' && event.currentTarget.getAttribute('aria-activedescendant')) return;
              textKeys(event, event.currentTarget);
            }}
            onBlur={(event) => {
              if (pointerInPopup.current) return;
              commit(event.currentTarget.value, null, false);
            }}
          />
        </div>
        <ComboboxContent
          className='w-auto min-w-48'
          onPointerDown={() => {
            pointerInPopup.current = true;
          }}
          onPointerUp={() => {
            setTimeout(() => {
              pointerInPopup.current = false;
            }, 0);
          }}
        >
          <ComboboxEmpty>{cellEdit.emptyMessage ?? 'No matches'}</ComboboxEmpty>
          <ComboboxList>
            {(option) => (
              <ComboboxItem key={String(option.value)} value={option} disabled={option.disabled}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </>
  );
}

function DataGridCellDateEditor({ session, style, shared, commit, cancel, textKeys }) {
  const contentRef = useRef(null);
  const inputRef = useRef(null);
  const selected = toDataGridDate(session.value);
  return (
    <Popover open>
      <PopoverAnchor asChild>
        <input
          ref={(element) => {
            inputRef.current = element;
            const end = element?.value.length ?? 0;
            element?.setSelectionRange?.(end, end);
          }}
          data-slot='data-grid-cell-editor'
          autoFocus
          {...shared}
          aria-haspopup='dialog'
          defaultValue={session.initialValue}
          style={style}
          className={overlayClassName}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && !event.altKey) {
              event.preventDefault();
              focusDataGridCalendarDay(contentRef.current);
              return;
            }
            textKeys(event, event.currentTarget);
          }}
          onBlur={(event) => {
            if (contentRef.current?.contains(event.relatedTarget)) return;
            commit(event.currentTarget.value, null, false);
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        ref={contentRef}
        align='start'
        sideOffset={2}
        className='w-auto p-0'
        aria-label={session.label}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onInteractOutside={(event) => {
          if (event.target === inputRef.current) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          cancel();
        }}
        onFocusOutside={(event) => {
          if (event.target === inputRef.current) event.preventDefault();
        }}
      >
        <Calendar
          mode='single'
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            const value = date ? formatDate(date, 'yyyy-MM-dd') : session.cellEdit.clearValue ?? '';
            commit(date ? formatDate(date, 'MMM d, yyyy') : '', null, true, { value });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * An always-visible control for one editable cell in per-row edit mode.
 * `value` is the draft value; `onChange(value)` writes the draft.
 */
export function DataGridCellInlineEditor({
  cellEdit: rawCellEdit,
  value,
  row,
  onChange,
  label,
  invalid,
  describedBy,
  autoFocus,
  dense
}) {
  const cellEdit = resolveDataGridCellEdit(rawCellEdit);
  const control = cellEdit.control ?? 'text';
  const a11y = {
    'aria-label': label,
    'aria-invalid': invalid ? true : void 0,
    'aria-describedby': describedBy
  };
  const height = dense ? 'min-h-7 h-7' : 'min-h-8 h-8';
  if (control === 'checkbox') {
    return (
      <Checkbox
        {...a11y}
        autoFocus={autoFocus}
        checked={!!value}
        onCheckedChange={(checked) => onChange(checked === true)}
      />
    );
  }
  if (control === 'switch') {
    return (
      <Switch
        {...a11y}
        size='sm'
        autoFocus={autoFocus}
        checked={!!value}
        onCheckedChange={(checked) => onChange(checked === true)}
      />
    );
  }
  if (control === 'select') {
    const options = getDataGridCellEditOptions(cellEdit, row);
    const index = options.findIndex((option) => option.value === value);
    return (
      <Select
        value={index === -1 ? void 0 : String(index)}
        onValueChange={(key) => onChange(options[Number(key)]?.value)}
      >
        <SelectTrigger {...a11y} autoFocus={autoFocus} size='sm' className={cn('w-full', height)}>
          <SelectValue placeholder={cellEdit.placeholder ?? 'Choose'} />
        </SelectTrigger>
        <SelectContent position='popper' align='start'>
          {options.map((option, optionIndex) => (
            <SelectItem key={String(option.value)} value={String(optionIndex)} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (control === 'combobox') {
    const options = getDataGridCellEditOptions(cellEdit, row);
    return (
      <Combobox
        items={options}
        value={options.find((option) => option.value === value) ?? null}
        itemToStringLabel={(option) => option?.label ?? ''}
        isItemEqualToValue={(item, selectedOption) => item?.value === selectedOption?.value}
        onValueChange={(option) => onChange(option ? option.value : cellEdit.clearValue ?? null)}
      >
        <ComboboxInput {...a11y} autoFocus={autoFocus} placeholder={cellEdit.placeholder} className={cn('w-full', height)} />
        <ComboboxContent>
          <ComboboxEmpty>{cellEdit.emptyMessage ?? 'No matches'}</ComboboxEmpty>
          <ComboboxList>
            {(option) => (
              <ComboboxItem key={String(option.value)} value={option} disabled={option.disabled}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  }
  if (control === 'date') {
    return (
      <DataGridCellInlineDate
        cellEdit={cellEdit}
        value={value}
        row={row}
        onChange={onChange}
        a11y={a11y}
        autoFocus={autoFocus}
        height={height}
      />
    );
  }
  if (control === 'number') {
    return (
      <DataGridCellInlineNumber
        cellEdit={cellEdit}
        value={value}
        row={row}
        onChange={onChange}
        a11y={a11y}
        autoFocus={autoFocus}
        height={height}
      />
    );
  }
  return (
    <FieldInput
      {...a11y}
      as={control === 'textarea' ? 'textarea' : 'input'}
      rows={control === 'textarea' ? 1 : void 0}
      invalid={invalid}
      autoFocus={autoFocus}
      placeholder={cellEdit.placeholder}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      className={cn(height, 'px-2 text-sm', control === 'textarea' && 'field-sizing-content h-auto resize-none')}
    />
  );
}

function DataGridCellInlineNumber({ cellEdit, value, row, onChange, a11y, autoFocus, height }) {
  // The text is local so a half-typed "1." or a stray letter stays visible;
  // the draft receives the parsed number, or the raw text to flag it invalid.
  const [text, setText] = useState(() => formatDataGridCellEditValue(cellEdit, value, row));
  return (
    <FieldInput
      {...a11y}
      invalid={a11y['aria-invalid']}
      autoFocus={autoFocus}
      inputMode='decimal'
      value={text}
      placeholder={cellEdit.placeholder}
      onChange={(event) => {
        const raw = event.target.value;
        setText(raw);
        const parsed = cellEdit.parse?.(raw, row);
        onChange(parsed === void 0 ? raw : parsed);
      }}
      className={cn(height, 'px-2 text-end text-sm tabular-nums')}
    />
  );
}

function DataGridCellInlineDate({ cellEdit, value, onChange, a11y, autoFocus, height }) {
  const [open, setOpen] = useState(false);
  const selected = toDataGridDate(value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...a11y}
          autoFocus={autoFocus}
          variant='outline'
          size='sm'
          className={cn('w-full justify-between text-sm font-normal', height, a11y['aria-invalid'] && 'border-ui-destructive')}
        >
          <span className={cn('truncate', !selected && 'text-ui-muted-foreground')}>
            {selected ? formatDate(selected, cellEdit.displayFormat ?? 'MMM d, yyyy') : cellEdit.placeholder ?? 'Pick a date'}
          </span>
          <RegistryIcon lucide='CalendarDays' className='text-ui-muted-foreground size-3.5' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto p-0'>
        <Calendar
          mode='single'
          autoFocus
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onChange(date ? formatDate(date, 'yyyy-MM-dd') : cellEdit.clearValue ?? '');
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
