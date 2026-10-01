import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '../../../../src/components/core/Timeline/parts/timeline-extended.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';

const kinds = { New: 'info-light', Improved: 'primary-light', Fixed: 'success-light', Breaking: 'warning-light' };
const releases = [
  {
    version: 'v2.4.0',
    date: 'Oct 1, 2026',
    summary: 'Code blocks join Core, articles render fences through CodeBlock, and quiet buttons stop carrying the accent.',
    kinds: ['New', 'Improved', 'Breaking'],
    impact: 'High',
    changes: 18
  },
  {
    version: 'v2.3.2',
    date: 'Sep 24, 2026',
    summary: 'Toast stacks keep their cards inside narrow previews and long custom content truncates instead of overflowing.',
    kinds: ['Fixed'],
    impact: 'Low',
    changes: 4
  },
  {
    version: 'v2.3.0',
    date: 'Sep 12, 2026',
    summary: 'Tabs gain underline, outline and type variants with a tone for the active marker, plus a global density control.',
    kinds: ['New', 'Improved'],
    impact: 'Medium',
    changes: 11
  },
  {
    version: 'v2.2.1',
    date: 'Aug 30, 2026',
    summary: 'Keyboard shortcuts render as proper keycaps and command results align their file paths.',
    kinds: ['Fixed', 'Improved'],
    impact: 'Low',
    changes: 6
  }
];

export function Pattern() {
  return (
    <div className='w-full max-w-xl'>
      <Timeline defaultValue={1}>
        {releases.map((release, index) => (
          <TimelineItem key={release.version} step={index + 1} className='sm:group-data-[orientation=vertical]/timeline:ms-36'>
            <TimelineHeader>
              <TimelineSeparator />
              {/* From sm up the date moves into a rail on the left of the line. */}
              <TimelineDate className='sm:group-data-[orientation=vertical]/timeline:absolute sm:group-data-[orientation=vertical]/timeline:-left-36 sm:group-data-[orientation=vertical]/timeline:w-24 sm:group-data-[orientation=vertical]/timeline:text-right'>
                {release.date}
              </TimelineDate>
              <TimelineTitle className='flex items-center gap-2'>
                {release.version}
                {index === 0 && (
                  <Badge variant='secondary' size='sm'>
                    Latest
                  </Badge>
                )}
              </TimelineTitle>
              <TimelineIndicator />
            </TimelineHeader>
            <TimelineContent className='grid gap-2'>
              <p>{release.summary}</p>
              <div className='flex flex-wrap items-center gap-1.5'>
                {release.kinds.map((kind) => (
                  <Badge key={kind} variant={kinds[kind]} size='sm'>
                    {kind}
                  </Badge>
                ))}
                <Badge variant='outline' size='sm'>
                  {release.impact} impact
                </Badge>
                <Badge variant='outline' size='sm'>
                  {release.changes} changes
                </Badge>
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
