function serializeDataGridClipboardField(field) {
  return /[\t\n\r"]/.test(field)
    ? '"' + field.replaceAll('"', '""') + '"'
    : field;
}
function serializeDataGridClipboardText(grid) {
  return grid
    .map((line) => line.map(serializeDataGridClipboardField).join('	'))
    .join('\r\n');
}
function parseDataGridClipboardText(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }
    if (ch === '"' && field === '') {
      quoted = true;
      i += 1;
      continue;
    }
    if (ch === '	') {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }
    if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }
  row.push(field);
  rows.push(row);
  const last = rows[rows.length - 1];
  if (rows.length > 1 && last?.length === 1 && last[0] === '') rows.pop();
  return rows;
}
function tileDataGridClipboardBlock(block, rowCount, columnCount) {
  const tiled = [];
  for (let r = 0; r < rowCount; r++) {
    const source = block[r % block.length] ?? [];
    const line = [];
    for (let c = 0; c < columnCount; c++) {
      line.push(source[c % (source.length || 1)] ?? '');
    }
    tiled.push(line);
  }
  return tiled;
}
function escapeDataGridClipboardHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
function renderDataGridClipboardHtml(grid) {
  const body = grid
    .map(
      (line) =>
        '<tr>' +
        line
          .map(
            (field) =>
              '<td>' +
              escapeDataGridClipboardHtml(field).replace(
                /\r\n|\r|\n/g,
                '<br>'
              ) +
              '</td>'
          )
          .join('') +
        '</tr>'
    )
    .join('');
  return '<table><tbody>' + body + '</tbody></table>';
}
export { serializeDataGridClipboardText, parseDataGridClipboardText, tileDataGridClipboardBlock, renderDataGridClipboardHtml };
