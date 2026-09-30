// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useEffect, useState } from 'react';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setLoading((prev) => !prev), 2e3);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className='relative'>
      <Avatar>
        <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='@alexjohnson' />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      {loading && (
        <div className='bg-ui-background/60 absolute inset-0 flex items-center justify-center rounded-full'>
          <Spinner className='text-ui-primary' />
        </div>
      )}
    </div>
  );
}
