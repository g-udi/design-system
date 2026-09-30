// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Card,
  CardContent,
  CardHeader
} from '../../../../src/components/core/Card/parts/card.jsx';
import { Skeleton } from '../../../../src/components/core/Skeleton/parts/skeleton.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs'>
      <CardHeader className='gap-2'>
        <Skeleton className='h-4 w-2/3' />
        <Skeleton className='h-4 w-1/2' />
      </CardHeader>
      <CardContent>
        <Skeleton className='aspect-video w-full rounded-md' />
      </CardContent>
    </Card>
  );
}
