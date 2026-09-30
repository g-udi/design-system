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
    <Card className='w-full max-w-xs p-0'>
      <CardContent className='flex flex-col gap-5 p-0'>
        <div className='relative h-48 w-full overflow-hidden'>
          <img
            src='https://picsum.photos/1000/800?grayscale&random=52'
            alt='16:9'
            width={1e3}
            height={800}
            className='h-full w-full object-cover'
          />
        </div>

        <div className='flex flex-col items-center gap-4 p-6 pt-0'>
          <Badge variant='outline'>
            <RegistryIcon lucide='BellIcon' aria-hidden='true' />
            Trending
          </Badge>

          <p className='text-ui-foreground text-center text-sm'>
            Making your design process faster and easier. Design tools for your
            team.
          </p>

          <Button className='w-fit'>
            Get Started
            <RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
