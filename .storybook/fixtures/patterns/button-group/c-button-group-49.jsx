'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const Icon = ({ name }) => <RegistryIcon lucide={name} aria-hidden='true' />;
const nav = [['Dashboard', 'LayoutDashboardIcon'], ['Analytics', 'BarChart2Icon'], ['Settings', 'SettingsIcon'], ['Help', 'CircleHelpIcon']];
const tools = [['Search', 'SearchIcon'], ['Copy', 'CopyIcon'], ['Share', 'UploadIcon']];
export function Pattern() {
  const [active, setActive] = useState('Dashboard');
  return (
    <div className='mx-auto flex w-full max-w-lg flex-wrap items-start justify-center gap-3'>
      <ButtonGroup orientation='vertical' aria-label='Sections' className='w-40'>
        {nav.map(([label, icon]) => (
          <Button
            key={label}
            variant='outline'
            aria-current={active === label ? 'page' : undefined}
            className={cn('justify-start', active === label && 'bg-surface-muted')}
            onClick={() => setActive(label)}
          >
            <Icon name={icon} />
            {label}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup orientation='vertical' aria-label='Quantity'>
        <Button variant='outline' size='icon' aria-label='Add'><Icon name='PlusIcon' /></Button>
        <Button variant='outline' size='icon' aria-label='Subtract'><Icon name='MinusIcon' /></Button>
      </ButtonGroup>
      <ButtonGroup orientation='vertical' aria-label='Tool palette'>
        <ButtonGroup orientation='vertical'>
          {tools.map(([label, icon]) => (
            <Button key={label} variant='outline' size='icon' aria-label={label}><Icon name={icon} /></Button>
          ))}
        </ButtonGroup>
        <ButtonGroup orientation='vertical'>
          <Button variant='outline' size='icon' aria-label='Delete'><Icon name='Trash2Icon' /></Button>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  );
}
