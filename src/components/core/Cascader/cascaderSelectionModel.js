function shallowEqualRecords(a, b) {
  const left = a;
  const right = b;
  const keys = Object.keys(left);
  if (keys.length !== Object.keys(right).length) return false;
  for (const key of keys) {
    if (!Object.is(left[key], right[key])) return false;
  }
  return true;
}
function shallowEqualItemLists(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i] && !shallowEqualRecords(a[i], b[i])) return false;
  }
  return true;
}
function toArray(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.filter((entry) => entry !== '');
  return value === '' ? [] : [value];
}
export { shallowEqualRecords, shallowEqualItemLists, toArray };
