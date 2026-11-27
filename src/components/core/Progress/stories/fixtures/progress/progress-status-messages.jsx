'use client';
import { useInterval } from '@gaudi/design-system/hooks/state/use-interval';
import { useState } from 'react';
import Progress from '@gaudi/design-system/core/Progress';
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
  useInterval(() => {
    setDownloadProgress((prev) => {
      if (prev >= 100) {
        return 0;
      }
      return prev + Math.random() * 3 + 1;
    });
  }, 150);
  return (
    <div className='w-full max-w-xs space-y-2'>
      <Progress label='Workspace Setup' value={downloadProgress} valueText={`${Math.min(Math.round(downloadProgress), 100)}%`} />
      <div className='text-ui-muted-foreground text-xs'>
        {getStatusMessage(downloadProgress)}
      </div>
    </div>
  );
}
