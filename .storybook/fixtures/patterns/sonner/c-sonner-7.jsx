'use client';
import { useEffect, useRef } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { default as ToastProvider, toast } from '../../../../src/components/core/Toast/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const toasterId = 'toast-progress';
// Custom content renders in the title slot, so it takes the full row and drops the title weight.
const custom = { toasterId, classNames: { content: 'min-w-0 flex-1', title: 'font-normal text-current' } };
function UploadProgress({ progress }) {
  const done = progress >= 100;
  return (
    <div className='flex w-full flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <RegistryIcon
          lucide={done ? 'CircleCheckIcon' : 'FileIcon'}
          className={`size-4 shrink-0 ${done ? 'text-success' : 'text-text-muted'}`}
          aria-hidden='true'
        />
        <p className='flex-1 truncate text-sm font-medium'>report-q4-2025.pdf</p>
        <span className='text-text-muted text-xs tabular-nums'>{done ? 'Uploaded' : `${progress}%`}</span>
      </div>
      <Progress value={progress} className='h-1.5' aria-label='Upload progress' />
    </div>
  );
}
export function Pattern() {
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);
  // toast.promise switches from loading to success or error when the promise settles.
  const deploy = () =>
    toast.promise(new Promise((resolve) => setTimeout(() => resolve({ name: 'production' }), 2000)), {
      toasterId,
      classNames: { icon: 'relative size-4 shrink-0' },
      loading: 'Deploying to production...',
      success: (data) => `Deployed to ${data.name}`,
      error: 'Deployment failed. Please try again.'
    });
  // Reusing the id updates one toast in place instead of stacking a new one per step.
  const upload = () => {
    clearInterval(timer.current);
    let progress = 0;
    const id = toast.custom(() => <UploadProgress progress={progress} />, { ...custom, duration: Infinity });
    timer.current = setInterval(() => {
      progress = Math.min(progress + 20, 100);
      toast.custom(() => <UploadProgress progress={progress} />, {
        ...custom,
        id,
        duration: progress >= 100 ? 3000 : Infinity
      });
      if (progress >= 100) clearInterval(timer.current);
    }, 500);
  };
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Button size='sm' variant='outline' tone='neutral' onClick={deploy}>
        Deploy
      </Button>
      <Button size='sm' variant='outline' tone='neutral' onClick={upload}>
        <RegistryIcon lucide='UploadIcon' />
        Upload report
      </Button>
      <ToastProvider id={toasterId} />
    </div>
  );
}
