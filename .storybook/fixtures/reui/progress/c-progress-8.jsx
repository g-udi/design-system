// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useEffect, useState } from 'react';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
export function Pattern() {
  const [progress, setProgress] = useState(45);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(75), 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-6'>
      <Progress
        value={progress}
        className='**:data-[slot=progress-indicator]:bg-green-500'
      />
      <Progress
        value={progress}
        className='**:data-[slot=progress-indicator]:bg-yellow-500'
      />
      <Progress
        value={progress}
        className='**:data-[slot=progress-indicator]:bg-fuchsia-500'
      />
      <Progress
        value={progress}
        className='**:data-[slot=progress-indicator]:bg-indigo-500'
      />
      <Progress
        value={progress}
        className='**:data-[slot=progress-indicator]:bg-violet-500'
      />
    </div>
  );
}
