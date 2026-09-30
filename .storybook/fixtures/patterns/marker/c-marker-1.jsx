import {
  Marker,
  MarkerContent
} from '../../../../src/components/core/Marker/parts/marker.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-6'>
      <Marker>
        <MarkerContent>Read 14 files under src/billing</MarkerContent>
      </Marker>
      <Marker variant='separator'>
        <MarkerContent>Planning</MarkerContent>
      </Marker>
      <Marker variant='border'>
        <MarkerContent>Wrote 3 files, 128 lines changed</MarkerContent>
      </Marker>
    </div>
  );
}
