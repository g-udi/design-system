import { IconTile } from '@gaudi/design-system/core/Icon';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const variants = ['outline', 'elevated', 'soft', 'solid', 'frame'];
const sizes = ['xs', 'sm', 'default', 'lg', 'xl'];
function Row({ label, align = 'items-center', children }) {
  return (
    <div className='grid grid-cols-[4.5rem_1fr] items-center gap-3'>
      <span className='text-text-muted text-xs'>{label}</span>
      <div className={`flex flex-wrap gap-2 ${align}`}>{children}</div>
    </div>
  );
}
function Captioned({ caption, children }) {
  return (
    <figure className='m-0 flex w-14 flex-col items-center gap-1'>
      {children}
      <figcaption className='text-text-muted text-xs'>{caption}</figcaption>
    </figure>
  );
}
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-3'>
      <Row label='Variant' align='items-start'>
        {variants.map((variant) => (
          <Captioned key={variant} caption={variant}>
            <IconTile variant={variant} aria-hidden='true'>
              <RegistryIcon lucide='PackageIcon' />
            </IconTile>
          </Captioned>
        ))}
      </Row>
      <Row label='Size' align='items-end'>
        {sizes.map((size) => (
          <Captioned key={size} caption={size}>
            <IconTile variant='elevated' size={size} aria-hidden='true'>
              <RegistryIcon lucide='PackageIcon' />
            </IconTile>
          </Captioned>
        ))}
      </Row>
      <Row label='Circular'>
        {variants.map((variant) => (
          <span key={variant} className='flex w-14 justify-center'>
            <IconTile variant={variant} radius='full' aria-hidden='true'>
              <RegistryIcon lucide='GlobeIcon' />
            </IconTile>
          </span>
        ))}
      </Row>
      <Row label='Custom' align='items-start'>
        <Captioned caption='class'>
          <IconTile variant='elevated' className='size-14' aria-hidden='true'>
            <RegistryIcon lucide='ImageIcon' className='size-7' />
          </IconTile>
        </Captioned>
        <Captioned caption='variables'>
          <IconTile
            variant='elevated'
            className='[--icon-tile-icon-size:--spacing(7)] [--icon-tile-size:--spacing(14)]'
            aria-hidden='true'
          >
            <RegistryIcon lucide='Settings2Icon' />
          </IconTile>
        </Captioned>
        <Captioned caption='initials'>
          <IconTile variant='elevated' className='text-xs font-medium'>
            AK
          </IconTile>
        </Captioned>
        <Captioned caption='count'>
          <IconTile variant='outline' radius='full' className='text-text-muted text-xs font-medium'>
            12
          </IconTile>
        </Captioned>
        <Captioned caption='status'>
          <span className='relative inline-flex' aria-hidden='true'>
            <IconTile variant='elevated'>
              <RegistryIcon lucide='GlobeIcon' />
            </IconTile>
            <span className='border-ui-background bg-success absolute -end-0.5 -top-0.5 size-3 rounded-full border-2' />
          </span>
        </Captioned>
      </Row>
    </div>
  );
}
