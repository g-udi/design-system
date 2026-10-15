'use client';
import { useState } from 'react';
import { default as Button } from '../../Button/index.js';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderTrigger
} from '../../Cascader/Cascader.jsx';
import { CascaderItems } from '../../Cascader/components/CascaderItem.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav
} from '../../Cascader/components/CascaderNav.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { resolveDataGridViewLabels } from '../dataGridViewModel.js';
/**
 * "Add column": a searchable Cascader over a column registry. Columns already
 * in the grid (`value`) are disabled; picking a leaf calls `onAdd(id, column)`
 * and the picker resets, ready for the next one.
 */
function DataGridColumnPicker({
  registry,
  value = [],
  onAdd,
  labels: labelsProp,
  trigger,
  align = 'end',
  disabled
}) {
  const labels = resolveDataGridViewLabels(labelsProp);
  const [message, setMessage] = useState('');
  return (
    <>
      <Cascader
        items={registry.itemsExcept(value)}
        value=''
        searchScope='deep'
        disabled={disabled}
        onValueChange={(next) => {
          if (!next || !registry.has(next)) return;
          const entry = registry.get(next);
          onAdd?.(next, entry.column);
          setMessage(labels.columnAdded(entry.label));
        }}
      >
        <CascaderTrigger
          aria-label={labels.addColumn}
          showIcon={false}
          render={
            trigger ?? (
              <Button variant='outline' size='sm' className='font-normal' />
            )
          }
        >
          <RegistryIcon lucide='PlusIcon' />
          <span className='max-sm:sr-only'>{labels.addColumn}</span>
        </CascaderTrigger>
        <CascaderContent align={align} className='w-72 max-w-[calc(100vw-1rem)]'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput placeholder={labels.addColumnSearch} />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
      <span role='status' className='sr-only'>
        {message}
      </span>
    </>
  );
}
export { DataGridColumnPicker };
