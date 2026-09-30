// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [volume, setVolume] = useState([75]);
  return (
    <div className='flex min-h-[100px] items-center justify-center'>
      <Popover>
        <PopoverTrigger asChild>
          <Button aria-label='Settings' variant='outline' size='icon'>
            <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-72 gap-0 p-0' align='end'>
          <div className='border-b p-3'>
            <h4 className='m-0 font-medium'>Quick Settings</h4>
            <p className='text-ui-muted-foreground'>Adjust your preferences.</p>
          </div>
          <div className='space-y-3 p-3 pb-4'>
            <div className='flex items-center justify-between'>
              <label htmlFor='qs-dark'>Dark Mode</label>
              <Switch id='qs-dark' />
            </div>
            <div className='flex items-center justify-between'>
              <label htmlFor='qs-notif'>Notifications</label>
              <Switch id='qs-notif' defaultChecked />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label>Volume</label>
                <span className='text-ui-muted-foreground'>{volume[0]}%</span>
              </div>
              <Slider
                value={volume}
                onValueChange={(v) => setVolume(v)}
                max={100}
                step={1}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
