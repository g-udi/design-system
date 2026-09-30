// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs'>
      <CardContent className='flex flex-col gap-4'>
        <div className='relative h-48 w-full overflow-hidden rounded-lg'>
          <img
            src='https://picsum.photos/1000/800?grayscale&random=18'
            alt='16:9'
            width={1e3}
            height={800}
            className='h-full w-full object-cover'
          />
        </div>

        <div className='flex items-center justify-between gap-5'>
          <Badge variant='outline'>
            <RegistryIcon lucide='BellIcon' aria-hidden='true' />
            Trending
          </Badge>
          <div className='flex items-center gap-1'>
            <RegistryIcon lucide='SparklesIcon' aria-hidden='true' />
            <span className='text-ui-secondary-foreground text-xs font-medium'>
              Featured
            </span>
          </div>
        </div>

        <p className='text-ui-foreground text-sm'>
          Simplifying your workflow from day one. Manage your tasks, projects,
          and team in one place.
        </p>

        <Button>
          Get Started
          <RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' />
        </Button>
      </CardContent>
    </Card>
  );
}
