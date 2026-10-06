'use client';
import { useEffect, useState } from 'react';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
export function Pattern() {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const getStatusMessage = (progress) => {
    if (progress < 5) return 'Preparing the export...';
    if (progress < 15) return 'Collecting posts...';
    if (progress < 25) return 'Reading drafts...';
    if (progress < 35) return 'Checking image rights...';
    if (progress < 50) return 'Packing articles...';
    if (progress < 65) return 'Packing images...';
    if (progress < 80) return 'Packing attachments...';
    if (progress < 90) return 'Writing the archive...';
    if (progress < 95) return 'Checking every file...';
    if (progress < 100) return 'Finishing the export...';
    return 'Export ready to download.';
  };
  useEffect(() => {
    const downloadTimer = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + Math.random() * 3 + 1;
      });
    }, 150);
    return () => {
      clearInterval(downloadTimer);
    };
  }, []);
  return (
    <div className='w-full max-w-xs space-y-2'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium'>Workspace Setup</span>
        <span className='text-ui-muted-foreground text-sm'>
          {Math.min(Math.round(downloadProgress), 100)}%
        </span>
      </div>
      <Progress value={downloadProgress} />
      <div className='text-ui-muted-foreground text-xs'>
        {getStatusMessage(downloadProgress)}
      </div>
    </div>
  );
}
