// Dialog entrance classes, kept out of the client module so server code reads the map, not a client reference.
const slideIn = {
  'from-bottom': 'translate-y-8 opacity-0 data-open:translate-y-0 data-open:opacity-100',
  'from-left': '-translate-x-8 opacity-0 data-open:translate-x-0 data-open:opacity-100',
  'from-right': 'translate-x-8 opacity-0 data-open:translate-x-0 data-open:opacity-100',
  'from-top': '-translate-y-8 opacity-0 data-open:translate-y-0 data-open:opacity-100'
};

/** Panel entrance per `animationStyle`; the two legacy names alias their `from-*` equivalents. */
export const videoAnimationStyles = {
  'fade': 'opacity-0 data-open:opacity-100',
  ...slideIn,
  'from-center': 'scale-95 opacity-0 data-open:scale-100 data-open:opacity-100',
  'left-in-right-out': slideIn['from-left'],
  'top-in-bottom-out': slideIn['from-top']
};
