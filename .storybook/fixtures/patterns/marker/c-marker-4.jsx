import { Fragment } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Marker,
  MarkerContent,
  MarkerIcon
} from '../../../../src/components/core/Marker/parts/marker.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
        label: 'Searched 214 files for rateLimit(',
        icon: <RegistryIcon lucide='SearchIcon' />
      },
      {
        id: 'read',
        label: 'Read src/lib/rate-limit.ts',
        icon: <RegistryIcon lucide='FileTextIcon' />
      },
      {
        id: 'outline',
        label: 'Drafted a 3 step plan',
        icon: <RegistryIcon lucide='ListChecksIcon' />
      }
    ]
  },
  {
    name: 'Edit',
    steps: [
      {
        id: 'window',
        label: 'Widened the window to 60s',
        icon: <RegistryIcon lucide='PencilIcon' />
      },
      {
        id: 'route',
        label: 'Wired the limiter into the send route',
        icon: <RegistryIcon lucide='CodeIcon' />
      },
      {
        id: 'commit',
        label: 'Committed to fix/rate-limit-window',
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
        label: 'Ran pnpm test rate-limit',
        icon: <RegistryIcon lucide='TerminalIcon' />
      },
      {
        id: 'probe',
        label: 'Confirmed the 429 no longer fires',
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
              <Marker variant='separator'>
                <MarkerContent>{phase.name}</MarkerContent>
              </Marker>
              {phase.steps.map((step) => (
                <Marker key={step.id}>
                  <MarkerIcon>{step.icon}</MarkerIcon>
                  <MarkerContent>{step.label}</MarkerContent>
                </Marker>
              ))}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
