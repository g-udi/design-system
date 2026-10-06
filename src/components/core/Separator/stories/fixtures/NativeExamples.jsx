import { Separator } from '@gaudi/design-system/core/Separator';
import { Fragment } from 'react';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const stats = [
  { icon: 'LayersIcon', label: 'Components', value: '64' },
  { icon: 'LayoutTemplateIcon', label: 'Patterns', value: '180' },
  { icon: 'PaletteIcon', label: 'Tokens', value: '420' }
];

const layouts = {
  horizontal: 'grid gap-3',
  vertical: 'flex items-stretch justify-between gap-4'
};

export const exampleDefaults = { orientation: 'vertical' };

export function PlaygroundDemo(props) {
  const { orientation } = { ...exampleDefaults, ...props };
  return <div className='mx-auto grid w-full max-w-sm gap-4 text-sm'>
      <div className='grid gap-1'>
        <h3 className='text-base font-semibold'>Gaudi Design System</h3>
        <p className='text-ui-muted-foreground'>Tokens, components, and patterns behind the blog.</p>
      </div>
      <Separator decorative={false} />
      <div className={layouts[orientation]}>
        {stats.map((stat, index) => (
          <Fragment key={stat.label}>
            {index > 0 && <Separator orientation={orientation} data-stat='' />}
            <div className={orientation === 'vertical' ? 'grid flex-1 justify-items-center gap-1 text-center' : 'flex items-center gap-2'}>
              <RegistryIcon lucide={stat.icon} aria-hidden='true' className='size-4 text-ui-muted-foreground' />
              <span className='text-ui-muted-foreground'>{stat.label}</span>
              <span className={orientation === 'vertical' ? 'text-lg font-semibold tabular-nums' : 'ms-auto font-semibold tabular-nums'}>{stat.value}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>;
}

export { stats };
