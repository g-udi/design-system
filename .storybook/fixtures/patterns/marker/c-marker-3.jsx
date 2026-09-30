import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
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
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Card className='mx-auto w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Agent run</CardTitle>
        <CardDescription>fix/rate-limit-window</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-3'>
          <Marker>
            <MarkerIcon>
              <RegistryIcon lucide='CircleCheckIcon' />
            </MarkerIcon>
            <MarkerContent>Read src/lib/rate-limit.ts</MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <RegistryIcon lucide='CircleCheckIcon' />
            </MarkerIcon>
            <MarkerContent>Reproduced the 429 on staging</MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <RegistryIcon lucide='CircleCheckIcon' />
            </MarkerIcon>
            <MarkerContent>Widened the window to 60s</MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <RegistryIcon lucide='XIcon' />
            </MarkerIcon>
            <MarkerContent>Type check failed in src/db/schema.ts</MarkerContent>
            <Badge variant='destructive-light'>failed</Badge>
          </Marker>
          {/* The pulse rides on a plain span, not on the content slot, and it
       is core Tailwind rather than a utility that arrives with the CLI
       package, so an older toolchain still renders a readable line. */}
          <Marker role='status'>
            <MarkerIcon>
              {/* size-full, because the spinner carries its own fixed size and
       the icon slot's per style sizing skips any svg that already
       has one, which would pin it to one style's scale. */}
              <Spinner className='size-full' />
            </MarkerIcon>
            <MarkerContent>
              <span className='sr-only'>In progress: </span>
              <span className='animate-pulse'>Re-running the test suite</span>
            </MarkerContent>
          </Marker>
        </div>
      </CardContent>
    </Card>
  );
}
