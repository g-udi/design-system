import { Badge } from '@gaudi/design-system/core/Pill';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  Item,
  ItemContent,
  ItemMedia
} from '@gaudi/design-system/core/Item';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  return (
    <Card className='mx-auto w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Agent run</CardTitle>
        <CardDescription>fix/rate-limit-window</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-3'>
          <Item size='xs'>
            <ItemMedia aria-hidden='true' className='size-4 [&_svg]:size-4'>
              <RegistryIcon lucide='CircleCheckIcon' />
            </ItemMedia>
            <ItemContent className='min-w-0 break-words'>Read content/posts/colour-notes.mdx</ItemContent>
          </Item>
          <Item size='xs'>
            <ItemMedia aria-hidden='true' className='size-4 [&_svg]:size-4'>
              <RegistryIcon lucide='CircleCheckIcon' />
            </ItemMedia>
            <ItemContent className='min-w-0 break-words'>Found 3 broken links in the preview</ItemContent>
          </Item>
          <Item size='xs'>
            <ItemMedia aria-hidden='true' className='size-4 [&_svg]:size-4'>
              <RegistryIcon lucide='CircleCheckIcon' />
            </ItemMedia>
            <ItemContent className='min-w-0 break-words'>Replaced the links with archive copies</ItemContent>
          </Item>
          <Item size='xs'>
            <ItemMedia aria-hidden='true' className='size-4 [&_svg]:size-4'>
              <RegistryIcon lucide='XIcon' />
            </ItemMedia>
            <ItemContent className='min-w-0 break-words'>Front matter check failed in colour-notes.mdx</ItemContent>
            <Badge variant='destructive-light'>failed</Badge>
          </Item>
          <Item size='xs' role='status'>
            <ItemMedia aria-hidden='true' className='size-4 [&_svg]:size-4'>
              <Loader className='size-full' />
            </ItemMedia>
            <ItemContent className='min-w-0 break-words'>
              <span className='sr-only'>In progress: </span>
              <span>Re-running the content checks</span>
            </ItemContent>
          </Item>
        </div>
      </CardContent>
    </Card>
  );
}
