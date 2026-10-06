const resolveNextImage = (candidate) => {
  let component = candidate;
  let depth = 0;

  while (component && typeof component === 'object' && 'default' in component && depth < 3) {
    component = component.default;
    depth += 1;
  }

  // Next/Image uses React.forwardRef, whose component type is an object.
  if (typeof component === 'function' || component?.$$typeof === Symbol.for('react.forward_ref') || component?.$$typeof === Symbol.for('react.memo')) return component;

  return null;
};

export default resolveNextImage;
