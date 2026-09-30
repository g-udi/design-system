'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { default as ToastProvider, toast } from '../../../../src/components/core/Toast/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const toasterId = 'toast-types';
// Each type keeps its own message, a tinted status icon (the spinner needs its own box) and a glyph for the icon switch.
const types = [
  { type: 'default', label: 'Default', title: 'Event created', description: 'Monday, January 3rd at 6:00pm', icon: 'CalendarIcon' },
  { type: 'success', label: 'Success', title: 'Changes saved', description: 'Your profile is up to date.', icon: 'SaveIcon', iconClass: 'text-success' },
  { type: 'error', label: 'Error', title: 'Upload failed', description: 'report-2025.pdf is over 10 MB.', icon: 'UploadIcon', iconClass: 'text-danger' },
  { type: 'warning', label: 'Warning', title: 'Storage almost full', description: 'You have used 92% of 10 GB.', icon: 'HardDriveIcon', iconClass: 'text-warning' },
  { type: 'info', label: 'Info', title: 'Update available', description: 'Version 2.4 is ready to install.', icon: 'DownloadIcon', iconClass: 'text-info' },
  { type: 'loading', label: 'Loading', title: 'Syncing files', description: '12 of 48 uploaded.', icon: 'RefreshCwIcon', iconClass: 'relative size-4 shrink-0' }
];
const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
const durations = [
  { value: '2000', label: '2s' },
  { value: '5000', label: '5s' },
  { value: '10000', label: '10s' },
  { value: 'Infinity', label: 'Until closed' }
];
const switches = [
  { key: 'description', label: 'Description' },
  { key: 'closeButton', label: 'Close button' },
  { key: 'customIcon', label: 'Custom icon' }
];
export function Pattern() {
  const [position, setPosition] = useState('bottom-right');
  const [duration, setDuration] = useState('5000');
  const [options, setOptions] = useState({ description: true, closeButton: false, customIcon: false });
  const show = ({ type, title, description, icon, iconClass }) => {
    const notify = type === 'default' ? toast : toast[type];
    notify(title, {
      toasterId,
      position,
      duration: Number(duration),
      closeButton: options.closeButton,
      description: options.description ? description : undefined,
      icon: options.customIcon ? <RegistryIcon lucide={icon} className='size-4' /> : undefined,
      classNames: iconClass ? { icon: iconClass } : undefined
    });
  };
  return (
    <div className='mx-auto grid w-full max-w-md gap-3'>
      <div role='group' aria-label='Toast types' className='grid grid-cols-3 gap-2'>
        {types.map((item) => (
          <Button key={item.type} size='sm' variant='outline' tone='neutral' onClick={() => show(item)}>
            {item.label}
          </Button>
        ))}
      </div>
      <div role='group' aria-label='Toast options' className='border-border grid gap-2 rounded-lg border p-3'>
        <div className='flex items-center justify-between gap-2'>
          <Label htmlFor='toast-position' className='text-sm font-normal'>Position</Label>
          <NativeSelect id='toast-position' size='sm' value={position} onChange={(event) => setPosition(event.target.value)}>
            {positions.map((value) => (
              <NativeSelectOption key={value} value={value}>
                {value.replace('-', ' ')}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className='flex items-center justify-between gap-2'>
          <span className='text-sm'>Duration</span>
          <ToggleGroup
            type='single'
            variant='outline'
            size='sm'
            spacing={0}
            value={duration}
            onValueChange={(value) => value && setDuration(value)}
            aria-label='Duration'
          >
            {durations.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value}>
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className='flex flex-wrap gap-x-4 gap-y-2 pt-1'>
          {switches.map((item) => (
            <Label key={item.key} className='gap-2 text-sm font-normal'>
              <Switch
                size='sm'
                checked={options[item.key]}
                onCheckedChange={(checked) => setOptions((current) => ({ ...current, [item.key]: checked }))}
              />
              {item.label}
            </Label>
          ))}
        </div>
      </div>
      <ToastProvider id={toasterId} />
    </div>
  );
}
