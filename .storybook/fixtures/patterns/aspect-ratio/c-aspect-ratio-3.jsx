import { AspectRatio } from '../../../../src/components/core/AspectRatio/parts/aspect-ratio.jsx';
export function Pattern() {
  return (
    <div className='w-full max-w-xs'>
      <AspectRatio
        ratio={1 / 1}
        className='bg-ui-muted rounded-xl overflow-hidden border'
      >
        <img
          src='static/images/art/0.svg'
          alt='1:1'
          width={1e3}
          height={800}
          className='h-full w-full object-cover'
        />
      </AspectRatio>
    </div>
  );
}
