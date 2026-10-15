// Server-safe block grammar for streamed chat markdown; ChatMessageMarkdown renders the blocks.

const TABLE_RULE = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;

const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;

const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());

export function parseMessageMarkdown(text) {
  const lines = text.split('\n');
  const blocks = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: 'rule' });
      index += 1;
      continue;
    }
    if (line.includes('|') && TABLE_RULE.test(lines[index + 1] || '')) {
      const head = cells(line);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(cells(lines[index]));
        index += 1;
      }
      blocks.push({ type: 'table', head, rows });
      continue;
    }
    if (/^\s*>/.test(line)) {
      const quote = [];
      while (index < lines.length && /^\s*>/.test(lines[index])) {
        quote.push(lines[index].replace(/^\s*>\s?/, ''));
        index += 1;
      }
      blocks.push({ type: 'quote', text: quote.join('\n') });
      continue;
    }
    if (LIST_ITEM.test(line)) {
      const ordered = /\d/.test(line.match(LIST_ITEM)[2]);
      const items = [];
      while (index < lines.length && (LIST_ITEM.test(lines[index]) || (/^\s{2,}\S/.test(lines[index]) && items.length))) {
        const item = lines[index].match(LIST_ITEM);
        if (item) {
          const task = item[3].match(/^\[( |x|X)\]\s+(.*)$/);
          items.push(task ? { text: task[2], checked: task[1] !== ' ' } : { text: item[3] });
        } else items[items.length - 1].text += ` ${lines[index].trim()}`;
        index += 1;
      }
      blocks.push({ type: 'list', ordered, start: ordered ? Number.parseInt(line.match(LIST_ITEM)[2], 10) : undefined, items });
      continue;
    }
    const paragraph = [];
    while (index < lines.length && lines[index].trim() && !/^(#{1,4})\s|^\s*>|^\s*(-{3,}|\*{3,})\s*$/.test(lines[index]) && !LIST_ITEM.test(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
  }
  return blocks;
}
