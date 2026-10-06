'use client';
import { cn } from '../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import {
  useSignaturePad,
  useSignaturePadConfig,
} from './signaturePadContext.js';

function SignaturePadGuide({ className, children, ...props }) {
  return (
    <div
      data-slot="signature-pad-guide"
      aria-hidden="true"
      className={cn('ds-signature-pad-guide', className)}
      {...props}
    >
      {children ?? (
        <RegistryIcon lucide="X" className="size-3" aria-hidden="true" />
      )}
    </div>
  );
}

function SignaturePadPlaceholder({ className, children, ...props }) {
  const { labels } = useSignaturePadConfig('SignaturePadPlaceholder');
  const { isEmpty, isDrawing } = useSignaturePad();
  if (!isEmpty || isDrawing) return null;
  return (
    <div
      data-slot="signature-pad-placeholder"
      aria-hidden="true"
      className={cn('ds-signature-pad-placeholder', className)}
      {...props}
    >
      {children ?? labels.placeholder}
    </div>
  );
}

const CONTROLS_POSITION_CLASS = {
  'top-start': 'top-2 start-2',
  'top-end': 'top-2 end-2',
  'bottom-start': 'bottom-2 start-2',
  'bottom-end': 'bottom-2 end-2',
};

function SignaturePadControls({ position = 'top-end', className, ...props }) {
  return (
    <div
      data-slot="signature-pad-controls"
      data-position={position}
      className={cn(
        'ds-signature-pad-controls',
        CONTROLS_POSITION_CLASS[position],
        className,
      )}
      {...props}
    />
  );
}

export { SignaturePadGuide, SignaturePadPlaceholder, SignaturePadControls };
