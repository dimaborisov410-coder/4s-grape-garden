const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const tabs = [
  { id: 'overview',  start: 489,  end: 633  },
  { id: 'blocks',    start: 635,  end: 720  },
  { id: 'plantings', start: 722,  end: 824  },
  { id: 'equip',     start: 826,  end: 1235 },
  { id: 'finance',   start: 1237, end: 1722 },
  { id: 'tasks',     start: 1724, end: 1893 },
  { id: 'smeta',     start: 1895, end: 2015 },
  { id: 'docs-tab',  start: 2017, end: 2219 },
  { id: 'build',     start: 2221, end: 2568 },
  { id: 'map',       start: 2570, end: 2905 },
  { id: 'crew',      start: 2907, end: 3040 },
  { id: 'qa',        start: 3042, end: 3055 },
  { id: 'ops',       start: 3058, end: 3308 },
];

tabs.forEach(({ id, start, end }) => {
  const content = lines.slice(start - 1, end).join('\n');
  fs.writeFileSync(`src/tabs/${id}.html`, content, 'utf8');
  console.log(`✓ src/tabs/${id}.html (строки ${start}–${end})`);
});

console.log('Готово: 13 вкладок извлечено.');
