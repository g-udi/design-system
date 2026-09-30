// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { ScrollArea } from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
const tags = Array.from({ length: 30 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);
export function Pattern() {
  return (
    <ScrollArea className='rounded-2xl h-72 w-48 border'>
      <div className='p-4'>
        <h4 className='mb-4 text-sm leading-none font-medium'>Releases</h4>
        <div className='flex flex-col divide-y'>
          {tags.map((tag, _i) => (
            <div key={tag} className='py-2 text-sm'>
              {tag}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
