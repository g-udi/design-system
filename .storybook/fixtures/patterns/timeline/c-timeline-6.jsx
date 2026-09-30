import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Frame,
  FrameHeader,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '../../../../src/components/core/Timeline/parts/timeline-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const pipelineSteps = [
  {
    id: 1,
    title: 'Source Code Checkout',
    duration: '12s',
    status: 'completed',
    description: 'Successfully fetched latest changes from the main branch.',
    user: {
      name: 'Alex Johnson',
      avatar:
        'https://randomuser.me/api/portraits/men/32.jpg'
    }
  },
  {
    id: 2,
    title: 'Dependency Installation',
    duration: '1m 45s',
    status: 'completed',
    description: 'All npm packages installed and cached for future builds.',
    user: {
      name: 'Sarah Chen',
      avatar:
        'https://randomuser.me/api/portraits/women/44.jpg'
    }
  },
  {
    id: 3,
    title: 'Unit & Integration Tests',
    duration: 'Running',
    status: 'active',
    description: 'Running 142 test suites across the entire codebase...',
    user: {
      name: 'Michael Rodriguez',
      avatar:
        'https://randomuser.me/api/portraits/men/11.jpg'
    }
  },
  {
    id: 4,
    title: 'Production Build',
    duration: 'Pending',
    status: 'pending',
    description: 'Optimizing assets and generating static site pages.',
    user: {
      name: 'Emma Wilson',
      avatar:
        'https://randomuser.me/api/portraits/women/68.jpg'
    }
  }
];
function StatusIcon({ status }) {
  if (status === 'completed')
    return <RegistryIcon lucide='CheckIcon' className='size-3.5' />;
  if (status === 'active') return <Spinner className='size-3.5' />;
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
          <TimelineItem key={step.id} step={step.id} className='ms-10 pb-10'>
            <TimelineHeader>
              <TimelineSeparator className='group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-7' />
              <div className='flex items-center gap-2'>
                <TimelineTitle className='text-sm font-semibold'>
                  {step.title}
                </TimelineTitle>
                <StatusBadge status={step.status} duration={step.duration} />
              </div>
              <TimelineIndicator
                className={cn(
                  'bg-ui-muted text-ui-muted-foreground group-data-completed/timeline-item:bg-ui-primary group-data-completed/timeline-item:text-ui-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7',
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
