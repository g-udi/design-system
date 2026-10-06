const INDENT_RE = /^[ \t]*/;
function computeFoldRegions(lines) {
  const indent = (text) =>
    (INDENT_RE.exec(text)?.[0] ?? '').replace(/\t/g, '  ').length;
  const blank = (text) => text.trim().length === 0;
  const regions = [];
  const stack = [];
  let previous = null;
  for (const line of lines) {
    if (blank(line.text)) continue;
    const own = indent(line.text);
    while (stack.length && own <= stack[stack.length - 1].indent) {
      const open = stack.pop();
      if (open.last > open.start) {
        regions.push({ start: open.start, end: open.last });
      }
    }
    for (const open of stack) open.last = line.number;
    if (previous && own > previous.indent) {
      stack.push({
        start: previous.number,
        indent: previous.indent,
        last: line.number
      });
    }
    previous = { number: line.number, indent: own };
  }
  while (stack.length) {
    const open = stack.pop();
    if (open.last > open.start)
      regions.push({ start: open.start, end: open.last });
  }
  return regions.sort((a, b) => a.start - b.start);
}
const EMPTY_FOLD_REGIONS = [];
export { computeFoldRegions, EMPTY_FOLD_REGIONS };
