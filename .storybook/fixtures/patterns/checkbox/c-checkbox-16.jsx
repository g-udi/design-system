'use client';
import { useCallback, useState } from 'react';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
const data = [
  {
    id: 'admin',
    label: 'Administration',
    children: [
      {
        id: 'user-management',
        label: 'User Management',
        children: [
          { id: 'view-users', label: 'View Users' },
          { id: 'create-users', label: 'Create Users' },
          { id: 'edit-users', label: 'Edit Users' }
        ]
      },
      {
        id: 'role-management',
        label: 'Role Management',
        children: [
          { id: 'view-roles', label: 'View Roles' },
          { id: 'assign-roles', label: 'Assign Roles' }
        ]
      }
    ]
  }
];
export function Pattern() {
  const [checked, setChecked] = useState({
    'view-users': true,
    'create-users': true,
    'view-roles': true
  });
  const getLeafIds = useCallback((item) => {
    if (!item.children) return [item.id];
    return item.children.flatMap(getLeafIds);
  }, []);
  const isChecked = useCallback(
    (item) => {
      const leafIds = getLeafIds(item);
      return leafIds.every((id) => checked[id]);
    },
    [checked, getLeafIds]
  );
  const isIndeterminate = useCallback(
    (item) => {
      const leafIds = getLeafIds(item);
      const checkedCount = leafIds.filter((id) => checked[id]).length;
      return checkedCount > 0 && checkedCount < leafIds.length;
    },
    [checked, getLeafIds]
  );
  const toggle = (item) => {
    const leafIds = getLeafIds(item);
    const shouldCheck = !isChecked(item);
    const nextChecked = { ...checked };
    leafIds.forEach((id) => {
      nextChecked[id] = shouldCheck;
    });
    setChecked(nextChecked);
  };
  const renderItem = (item, level = 0) => {
    return (
      <div key={item.id} className='flex flex-col gap-3'>
        <Field orientation='horizontal'>
          <Checkbox
            id={item.id}
            checked={isIndeterminate(item) ? 'indeterminate' : isChecked(item)}
            onCheckedChange={() => toggle(item)}
          />
          <FieldLabel
            htmlFor={item.id}
            className={level === 0 ? 'font-semibold' : 'text-sm'}
          >
            {item.label}
          </FieldLabel>
        </Field>

        {item.children && (
          <div className='ml-7 flex flex-col gap-3'>
            {item.children.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className='mx-auto flex flex-col gap-3'>
      {data.map((item) => renderItem(item))}
    </div>
  );
}
