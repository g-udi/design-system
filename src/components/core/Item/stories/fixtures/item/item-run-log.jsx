import { Fragment } from 'react';
import { Separator } from '@gaudi/design-system/core/Separator';
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
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const PHASES = [
  // Phases nest their steps instead of every step naming its own phase. The
  // separator row is the group boundary itself, so a flat list would need a
  // lookbehind on every row to work out where one phase ends and the next
  // one starts.
  {
    name: 'Plan',
    steps: [
      {
        id: 'scan',
        label: 'Searched 214 posts for broken image links',
        icon: <RegistryIcon lucide='SearchIcon' />
      },
      {
        id: 'read',
        label: 'Read content/posts/colour-notes.mdx',
        icon: <RegistryIcon lucide='FileTextIcon' />
      },
      {
        id: 'outline',
        label: 'Drafted a three-step fix',
        icon: <RegistryIcon lucide='ListChecksIcon' />
      }
    ]
  },
  {
    name: 'Edit',
    steps: [
      {
        id: 'window',
        label: 'Pointed the images at the media library',
        icon: <RegistryIcon lucide='PencilIcon' />
      },
      {
        id: 'route',
        label: 'Added alt text to the replaced images',
        icon: <RegistryIcon lucide='CodeIcon' />
      },
      {
        id: 'commit',
        label: 'Committed to fix/colour-notes-images',
        icon: <RegistryIcon lucide='GitBranchIcon' />
      }
    ]
  },
  {
    name: 'Verify',
    // Verify is two steps where the others are three. A run log is whatever
    // the run actually did, and padding every phase to the same length turns
    // the example into a template no real run would produce.
    steps: [
      {
        id: 'tests',
        label: 'Ran pnpm check:content',
        icon: <RegistryIcon lucide='TerminalIcon' />
      },
      {
        id: 'probe',
        label: 'Confirmed every image loads in the preview',
        icon: <RegistryIcon lucide='FlaskConicalIcon' />
      }
    ]
  }
];
export function Pattern() {
  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader>
        <CardTitle>Agent run</CardTitle>
        <CardDescription>auth-rate-limit, 1m 48s</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-2'>
          {PHASES.map((phase) => (
            <Fragment key={phase.name}>
              <div className='flex items-center gap-2 text-xs text-text-muted'>
                <Separator className='min-w-0 flex-1' />
                <span>{phase.name}</span>
                <Separator className='min-w-0 flex-1' />
              </div>
              {phase.steps.map((step) => (
                <Item size='xs' key={step.id}>
                  <ItemMedia aria-hidden='true' className='size-4 [&_svg]:size-4'>{step.icon}</ItemMedia>
                  <ItemContent className='min-w-0 break-words'>{step.label}</ItemContent>
                </Item>
              ))}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
