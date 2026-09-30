// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
export function Pattern() {
  const [rating, setRating] = useState(null);
  return (
    <div className='space-y-3'>
      <p className='text-sm font-medium'>How likely are you to recommend us?</p>
      <ButtonGroup className='max-w-full overflow-x-auto'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <Button
            key={n}
            variant='outline'
            size='icon-sm'
            onClick={() => setRating(n)}
            className={cn(
              rating === n &&
                'bg-ui-primary hover:bg-ui-primary hover:text-ui-primary-foreground hover:border-ui-primary text-ui-primary-foreground border-ui-primary'
            )}
          >
            {n}
          </Button>
        ))}
      </ButtonGroup>
      <div className='text-ui-muted-foreground flex justify-between text-xs'>
        <span>Not likely</span>
        <span>Very likely</span>
      </div>
    </div>
  );
}
