import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Icon from '../../components/core/Icon';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useArrowKeyNav } from './use-arrow-key-nav.js';

export default {
  title: 'Hooks/A11y/useArrowKeyNav',
  id: 'hooks-a11y-usearrowkeynav',
  tags: ['autodocs'],
  ...hookMeta('useArrowKeyNav')
};

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

export const Toolbar = {
  name: 'Toolbar',
  parameters: example('A formatting toolbar is one Tab stop; Left and Right move between tools, Home and End jump to the ends, and `wrap` loops around. `role: \'toolbar\'` adds `aria-orientation`.', `
import { Button, Icon } from '@gaudi/design-system';
import { useArrowKeyNav } from '@gaudi/design-system/hooks';

const tools = ['Bold', 'Italic', 'Underline', 'Link'];

export function FormattingToolbar() {
  const { getItemProps, containerProps } = useArrowKeyNav(tools.length, { orientation: 'horizontal', role: 'toolbar', wrap: true });
  return (
    <div {...containerProps} aria-label='Text formatting' className='flex gap-1'>
      {tools.map((tool, index) => (
        <Button key={tool} variant='ghost' tone='neutral' size='icon-sm' aria-label={tool} {...getItemProps(index)}>
          <Icon name={tool} decorative size='sm' />
        </Button>
      ))}
    </div>
  );
}`),
  render: () => <FormattingToolbar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bold = canvas.getByRole('button', { name: 'Bold' });
    await expect(bold).toHaveAttribute('tabindex', '0');
    bold.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Italic' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('button', { name: 'Link' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(bold).toHaveFocus();
    await expect(canvas.getByRole('button', { name: 'Italic' })).toHaveAttribute('tabindex', '-1');
  }
};

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

export const VerticalList = {
  name: 'Vertical section list',
  parameters: example('A settings menu moves with Up and Down. Without `wrap`, the ends stop. Enter or Space still clicks the focused button.', `
import { Button } from '@gaudi/design-system';
import { useArrowKeyNav } from '@gaudi/design-system/hooks';

const sections = ['Profile', 'Notifications', 'Billing', 'Security'];

export function SettingsNav({ current, onSelect }) {
  const { getItemProps, containerProps } = useArrowKeyNav(sections.length);
  return (
    <div {...containerProps} aria-label='Settings sections' className='grid gap-1'>
      {sections.map((section, index) => (
        <Button key={section} variant={current === section ? 'soft' : 'ghost'} tone='neutral'
          aria-current={current === section ? 'page' : undefined} onClick={() => onSelect(section)} {...getItemProps(index)}>
          {section}
        </Button>
      ))}
    </div>
  );
}`),
  render: () => <SettingsNav />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Profile' }).focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('button', { name: 'Profile' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(canvas.getByRole('button', { name: 'Billing' })).toHaveAttribute('aria-current', 'page');
  }
};
