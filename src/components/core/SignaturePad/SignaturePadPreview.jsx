import { cn } from '../../../utilities/cn/index.js';
import {
  resolveFrame,
  getSignaturePadBounds,
  getSignaturePadStrokePath,
} from './signaturePadModel.js';

function SignaturePadPreview({
  strokes,
  padding = 4,
  color,
  className,
  ...props
}) {
  if (!getSignaturePadBounds(strokes)) return null;
  const { x, y, width, height } = resolveFrame(strokes, { padding });
  return (
    <svg
      data-slot="signature-pad-preview"
      role="img"
      aria-label="Signature"
      viewBox={`${x} ${y} ${width} ${height}`}
      width={width}
      height={height}
      className={cn('text-text h-auto max-w-full', className)}
      {...props}
    >
      {strokes.map((stroke, index) => (
        <path
          key={index}
          d={getSignaturePadStrokePath(stroke)}
          fill={stroke.color ?? color ?? 'currentColor'}
        />
      ))}
    </svg>
  );
}

export { SignaturePadPreview };
