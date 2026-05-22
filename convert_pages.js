const fs = require('fs');

const pages = [
  { file: 'daily.html',     id: 'daily',     title: 'Журнал' },
  { file: 'field-map.html', id: 'field-map', title: 'Схема поля' },
  { file: 'routine.html',   id: 'routine',   title: 'Распорядок' },
  { file: 'calc.html',      id: 'calc',      title: 'Шпаргалка' },
  { file: 'montage.html',   id: 'montage',   title: 'Регламент' },
  { file: 'schedule.html',  id: 'schedule',  title: 'График работ' },
];

pages.forEach(({ file, id }) => {
  const html = fs.readFileSync(file, 'utf8');

  // Извлечь все <style>...</style> блоки
  const styleMatches = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)];
  const styleBlock = styleMatches.length > 0
    ? styleMatches.map(m => `<style>\n${m[1]}\n</style>`).join('\n')
    : '';

  // Извлечь содержимое <body>...</body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1].trim() : html;

  const output =
`<div class="page" id="page-${id}">
${styleBlock}
<div class="page-inner-doc">
${bodyContent}
</div>
</div>`;

  fs.writeFileSync(`src/tabs/${id}.html`, output, 'utf8');
  console.log(`✓ src/tabs/${id}.html ← ${file}`);
});

console.log('Готово: 6 страниц конвертировано.');
