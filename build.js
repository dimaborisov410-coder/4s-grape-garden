const fs = require('fs');

// ── Данные ───────────────────────────────────────────────────
const DATA = {
  finance:   JSON.parse(fs.readFileSync('src/data/finance.json',   'utf8')),
  crew:      JSON.parse(fs.readFileSync('src/data/crew.json',      'utf8')),
  materials: JSON.parse(fs.readFileSync('src/data/materials.json', 'utf8')),
  tasks:     JSON.parse(fs.readFileSync('src/data/tasks.json',     'utf8')),
};

// ── Общие файлы ───────────────────────────────────────────────
const sharedCSS = fs.readFileSync('src/shared/style.css',    'utf8');
const sharedJS  = fs.readFileSync('src/shared/script.js',    'utf8');
const topbar    = fs.readFileSync('src/shared/topbar.html',  'utf8');
const sidebar   = fs.readFileSync('src/shared/sidebar.html', 'utf8');

// ── Попап карты и мобильная навигация ────────────────────────
const extras = fs.readFileSync('src/shared/extras.html', 'utf8');

// ── Порядок вкладок ──────────────────────────────────────────
const TAB_ORDER = [
  'overview', 'blocks', 'plantings', 'equip', 'map',
  'finance', 'tasks', 'build', 'schedule', 'crew', 'smeta',
  'daily', 'field-map', 'routine', 'calc', 'montage',
  'docs-tab', 'qa', 'ops',
];

// ── Загрузка вкладок ─────────────────────────────────────────
const tabs = TAB_ORDER.map(id => {
  const filePath = `src/tabs/${id}.html`;
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Вкладка не найдена: ${filePath}`);
    return `<!-- Вкладка ${id} не найдена -->`;
  }
  return fs.readFileSync(filePath, 'utf8');
}).join('\n\n');

// ── Сборка ───────────────────────────────────────────────────
const output = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍇</text></svg>">
<title>4S Grape Garden — Система орошения</title>
<style>
${sharedCSS}
</style>
</head>
<body>

${topbar}

<div class="app-body">

${sidebar}

  <!-- MAIN -->
  <div class="main-wrap"><div class="content">

${tabs}

  </div></div>
</div>

${extras}

<script>
window.DATA = ${JSON.stringify(DATA, null, 2)};
</script>
<script>
${sharedJS}
</script>
</body>
</html>`;

fs.writeFileSync('index.html', output, 'utf8');
const size = fs.statSync('index.html');
const kb = Math.round(size.size / 1024);
const lines = output.split('\n').length;
console.log(`✓ index.html собран: ${lines} строк, ${kb} кб`);
