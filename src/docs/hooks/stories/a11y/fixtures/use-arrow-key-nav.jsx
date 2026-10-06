import { useState } from 'react';
import Button from '../../../../../components/core/Button';
import Icon from '../../../../../components/core/Icon';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useArrowKeyNav } from '../../../../../hooks/a11y/use-arrow-key-nav.js';

const tools = [ [ 'Bold', 'Bold' ], [ 'Italic', 'Italic' ], [ 'Underline', 'Underline' ], [ 'Link', 'Link' ] ];

function FormattingToolbar() {
  const { activeIndex, getItemProps, containerProps } = useArrowKeyNav(tools.length, { orientation: 'horizontal', role: 'toolbar', wrap: true });
  return (
    <div className='grid gap-3'>
      <div {...containerProps} aria-label='Text formatting' className='flex w-fit gap-1 rounded-(--ds-radius-control) border border-border p-1'>
        {tools.map(([ label, icon ], index) => (
          <Button key={label} variant='ghost' tone='neutral' size='icon-sm' aria-label={label} {...getItemProps(index)}>
            <Icon name={icon} decorative size='sm' />
          </Button>
        ))}
      </div>
      <Readout label='Active tool'>{tools[activeIndex][0]}</Readout>
    </div>
  );
}

const sections = [ 'Profile', 'Notifications', 'Billing', 'Security' ];

function SettingsNav() {
  const [ current, setCurrent ] = useState('Profile');
  const { getItemProps, containerProps } = useArrowKeyNav(sections.length, { orientation: 'vertical' });
  return (
    <div className='grid gap-3 sm:grid-cols-[12rem_1fr]'>
      <div {...containerProps} aria-label='Settings sections' className='grid gap-1'>
        {sections.map((section, index) => (
          <Button
            key={section}
            variant={current === section ? 'soft' : 'ghost'}
            tone='neutral'
            className='justify-start'
            aria-current={current === section ? 'page' : undefined}
            onClick={() => setCurrent(section)}
            {...getItemProps(index)}
          >
            {section}
          </Button>
        ))}
      </div>
      <Readout label='Showing'>{current}</Readout>
    </div>
  );
}

export { tools, FormattingToolbar, sections, SettingsNav };
