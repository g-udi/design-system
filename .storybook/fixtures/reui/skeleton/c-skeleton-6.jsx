// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Card,
  CardContent,
  CardHeader
} from '../../../../src/components/core/Card/parts/card.jsx';
import { Skeleton } from '../../../../src/components/core/Skeleton/parts/skeleton.jsx';
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-lg grid-cols-3 gap-4'>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className='pb-2'>
            <Skeleton className='h-3 w-16' />
          </CardHeader>
          <CardContent className='space-y-2'>
            <Skeleton className='h-7 w-24' />
            <Skeleton className='h-3 w-20' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
