import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@gaudi/design-system/core/Item';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Every variant at every size, side by side: variant sets the surface, size sets the padding.
const variants = [
  { variant: 'default', title: 'Default', description: 'No frame, for rows inside a card or list.' },
  { variant: 'outline', title: 'Outline', description: 'A visible border for standalone rows.' },
  { variant: 'muted', title: 'Muted', description: 'A subtle fill that sets a row apart.' }
];
const sizes = ['default', 'sm', 'xs'];

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-3xl gap-3 sm:grid-cols-3'>
      {sizes.map((size) => (
        <section key={size} className='grid content-start gap-2'>
          <h3 className='text-xs font-medium text-ui-muted-foreground'>size=&quot;{size}&quot;</h3>
          {variants.map(({ variant, title, description }) => (
            <Item key={variant} variant={variant} size={size}>
              <ItemMedia variant='icon'>
                <RegistryIcon lucide='LayersIcon' />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription>{description}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </section>
      ))}
    </div>
  );
}
