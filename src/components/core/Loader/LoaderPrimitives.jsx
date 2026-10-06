import { cn } from '../../../utilities/cn/index.js';

export const loaderVariants = ['arc', 'dual-arc', 'bar', 'beat', 'bounce', 'circle-dots', 'clip', 'puff', 'three-dots', 'triangle', 'two-dots'];

function LoaderShape({ variant }) {
  switch (variant) {
    case 'dual-arc':
      return <>
        <circle className='ds-loader-motion ds-loader-rotate' cx='12' cy='12' r='10' strokeDasharray='44 19' />
        <circle className='ds-loader-motion ds-loader-counter-rotate' cx='12' cy='12' r='6' strokeDasharray='25 13' />
      </>;
    case 'bar':
      return <>
        <path d='M2 12h68' strokeWidth='4' opacity='.2' />
        <path className='ds-loader-motion ds-loader-bar' d='M2 12h20' strokeWidth='4' />
      </>;
    case 'beat':
      return [4, 12, 20].map((x, index) => <circle key={x} className='ds-loader-motion ds-loader-beat' cx={x} cy='12' r='2.7' fill='currentColor' stroke='none' style={{ animationDelay: `${index * -0.16}s` }} />);
    case 'bounce':
      return [0, 1].map(index => <circle key={index} className='ds-loader-motion ds-loader-bounce' cx='12' cy='12' r='10' fill='currentColor' stroke='none' opacity='.55' style={{ animationDelay: `${index * -0.7}s` }} />);
    case 'circle-dots':
      return [[12, 3], [18.36, 5.64], [21, 12], [18.36, 18.36], [12, 21], [5.64, 18.36], [3, 12], [5.64, 5.64]].map(([x, y], index) => <circle key={index} className='ds-loader-motion ds-loader-orbit-dot' cx={x} cy={y} r='1.8' fill='currentColor' stroke='none' style={{ animationDelay: `${index * -0.15}s` }} />);
    case 'clip':
      return <g className='ds-loader-motion ds-loader-rotate'><circle className='ds-loader-motion ds-loader-clip' cx='12' cy='12' r='9' strokeDasharray='36 21' /></g>;
    case 'puff':
      return [0, 1].map(index => <circle key={index} className='ds-loader-motion ds-loader-puff' cx='12' cy='12' r='10' style={{ animationDelay: `${index * -0.75}s` }} />);
    case 'three-dots':
      return [4, 12, 20].map((x, index) => <circle key={x} className='ds-loader-motion ds-loader-hop' cx={x} cy='12' r='2.6' fill='currentColor' stroke='none' style={{ animationDelay: `${index * -0.16}s` }} />);
    case 'triangle':
      return <g className='ds-loader-motion ds-loader-triangle' fill='currentColor' stroke='none'>
        <circle cx='12' cy='5' r='3' /><circle cx='5' cy='17' r='3' /><circle cx='19' cy='17' r='3' />
      </g>;
    case 'two-dots':
      return <g className='ds-loader-motion ds-loader-rotate' fill='currentColor' stroke='none'>
        <circle cx='6' cy='12' r='4' /><circle cx='18' cy='12' r='4' opacity='.5' />
      </g>;
    default:
      return <circle className='ds-loader-motion ds-loader-rotate' cx='12' cy='12' r='9' strokeDasharray='43 14' />;
  }
}

/** Inherits currentColor; the public Loader adds Gaudi's default accent and size. */
export function Loader({ className, variant = 'arc', size = 'sm', ...props }) {
  const shape = loaderVariants.includes(variant) ? variant : 'arc';
  return <svg data-slot='loader' data-variant={shape} role='status' aria-label='Loading'
    viewBox={shape === 'bar' ? '0 0 72 24' : '0 0 24 24'} fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'
    className={cn('ds-loader', `ds-loader-size-${size}`, className)} {...props}>
    <g aria-hidden='true'><LoaderShape variant={shape} /></g>
  </svg>;
}
