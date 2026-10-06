'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { default as ToastProvider, toast } from '@gaudi/design-system/core/Toast';
import { useTimeout } from '@gaudi/design-system/hooks/state/use-timeout';
import { useInterval } from '@gaudi/design-system/hooks/state/use-interval';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
// Custom content renders in the title slot, so it takes the full row and drops the title weight.
const custom = { classNames: { content: 'min-w-0 flex-1', title: 'font-normal text-current' } };
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
  const toasterId = useId();
  const deployment = useRef(null);
  const uploadId = useRef(null);
  const progress = useRef(0);
  const [deploying, setDeploying] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Shared timer hooks stop the demo's work when its owning canvas unmounts.
  useTimeout(() => {
    deployment.current?.({ name: 'production' });
    deployment.current = null;
    setDeploying(false);
  }, deploying ? 2000 : null);
  useInterval(() => {
    progress.current = Math.min(progress.current + 20, 100);
    const nextProgress = progress.current;
    toast.custom(() => <UploadProgress progress={nextProgress} />, {
      ...custom,
      toasterId,
      id: uploadId.current,
      duration: nextProgress >= 100 ? 3000 : Infinity
    });
    if (nextProgress >= 100) setUploading(false);
  }, uploading ? 500 : null);
  useEffect(() => () => {
    toast.getToasts().filter((item) => item.toasterId === toasterId).forEach((item) => toast.dismiss(item.id));
  }, [toasterId]);
  // toast.promise switches from loading to success or error when the promise settles.
  const deploy = () => {
    if (deploying) return;
    setDeploying(true);
    toast.promise(new Promise((resolve) => { deployment.current = resolve; }), {
      toasterId,
      classNames: { icon: 'relative size-4 shrink-0' },
      loading: 'Deploying to production...',
      success: (data) => `Deployed to ${data.name}`,
      error: 'Deployment failed. Please try again.'
    });
  };
  // Reusing the id updates one toast in place instead of stacking a new one per step.
  const upload = () => {
    if (uploading) return;
    progress.current = 0;
    uploadId.current = toast.custom(() => <UploadProgress progress={0} />, { ...custom, toasterId, duration: Infinity });
    setUploading(true);
  };
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Button size='sm' variant='outline' tone='neutral' onClick={deploy} disabled={deploying}>
        Deploy
      </Button>
      <Button size='sm' variant='outline' tone='neutral' onClick={upload} disabled={uploading}>
        <RegistryIcon lucide='UploadIcon' />
        Upload report
      </Button>
      <ToastProvider id={toasterId} />
    </div>
  );
}
