import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Frame,
  FrameHeader,
  FramePanel
} from '@gaudi/design-system/core/Card';
import {
  TimelineRoot as Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '@gaudi/design-system/core/Timeline';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@gaudi/design-system/core/Accordion';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const pipelineSteps = [
  {
    id: 1,
    title: 'Fetch content',
    duration: '12s',
    status: 'completed',
    description: 'Pulled the latest posts and drafts from the content repository.',
    user: {
      name: 'Anouk Varga',
      avatar:
        '/avatars/person-41.svg'
    }
  },
  {
    id: 2,
    title: 'Dependency Installation',
    duration: '1m 45s',
    status: 'completed',
    description: 'Packages restored from the build cache.',
    user: {
      name: 'Sabine Okafor',
      avatar:
        '/avatars/person-20.svg'
    }
  },
  {
    id: 3,
    title: 'Content checks',
    duration: 'Running',
    status: 'active',
    description: 'Checking 142 posts for broken links and missing images...',
    user: {
      name: 'Rafe Okonkwo',
      avatar:
        '/avatars/person-31.svg'
    }
  },
  {
    id: 4,
    title: 'Production Build',
    duration: 'Pending',
    status: 'pending',
    description: 'Resizing images and rendering every page.',
    user: {
      name: 'Ilse Valtonen',
      avatar:
        '/avatars/person-24.svg'
    }
  }
];
function StatusIcon({ status }) {
  if (status === 'completed')
    return <RegistryIcon lucide='CheckIcon' className='size-3.5' />;
  if (status === 'active') return <Loader className='size-3.5' />;
  return <RegistryIcon lucide='CircleIcon' className='size-3.5' />;
}
function StatusBadge({ status, duration }) {
  const variant =
    status === 'completed'
      ? 'success-light'
      : status === 'active'
        ? 'info-light'
        : 'warning-light';
  return (
    <Badge variant={variant} size='sm'>
      {duration}
    </Badge>
  );
}
export function Pattern() {
  return (
    <div className='w-full max-w-lg'>
      <Timeline defaultValue={3}>
        {pipelineSteps.map((step) => (
          <TimelineItem key={step.id} step={step.id} className='group-data-[orientation=vertical]/timeline:ms-10 pb-10'>
            <TimelineHeader>
              <TimelineSeparator className='group-data-[orientation=vertical]/timeline:-start-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-7' />
              <div className='flex flex-wrap items-center gap-2'>
                <TimelineTitle>
                  {step.title}
                </TimelineTitle>
                <StatusBadge status={step.status} duration={step.duration} />
              </div>
              <TimelineIndicator
                className={cn(
                  'bg-ui-muted text-ui-muted-foreground group-data-completed/timeline-item:bg-ui-primary group-data-completed/timeline-item:text-ui-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-start-7',
                  step.status === 'active' && 'ring-ui-primary/20 ring-2'
                )}
              >
                <StatusIcon status={step.status} />
              </TimelineIndicator>
            </TimelineHeader>
            <TimelineContent className='mt-2'>
              <Frame stacked dense spacing='sm'>
                <Collapsible defaultOpen className='group/collapsible'>
                  <CollapsibleTrigger className='flex w-full'>
                    <FrameHeader className='flex grow flex-row items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <Avatar className='size-5'>
                          <AvatarImage
                            src={step.user.avatar}
                            alt={step.user.name}
                          />
                          <AvatarFallback>
                            {step.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-ui-muted-foreground text-xs font-medium'>
                          {step.user.name}
                        </span>
                      </div>
                      <RegistryIcon
                        lucide='ChevronRightIcon'
                        className='text-ui-muted-foreground size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90'
                      />
                    </FrameHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <FramePanel>
                      <p className='text-ui-muted-foreground text-sm leading-relaxed'>
                        {step.description}
                      </p>
                    </FramePanel>
                  </CollapsibleContent>
                </Collapsible>
              </Frame>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
