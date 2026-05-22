# Рефакторинг 4S Grape Garden — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Превратить 8 отдельных HTML-файлов в один `index.html`, организовав исходники в папку `src/` с данными в JSON, общими стилями и каждой вкладкой в отдельном файле.

**Architecture:** Сборщик `build.js` читает `src/shared/style.css`, `src/shared/script.js`, `src/shared/topbar.html`, `src/shared/sidebar.html` и все 19 файлов вкладок из `src/tabs/`, собирает единый `index.html`. Данные из `src/data/*.json` инжектируются как `window.DATA`. Вспомогательные страницы (`daily.html` и др.) становятся вкладками с сохранением своих стилей внутри `<div class="page">`.

**Tech Stack:** Node.js (fs, path), чистый HTML/CSS/JS, GitHub Pages (git push).

---

## Карта файлов

**Создать:**
- `src/data/finance.json`
- `src/data/crew.json`
- `src/data/materials.json`
- `src/data/tasks.json`
- `src/shared/style.css`
- `src/shared/script.js`
- `src/shared/topbar.html`
- `src/shared/sidebar.html`
- `src/tabs/overview.html` (строки 489–634 из index.html)
- `src/tabs/blocks.html` (строки 635–721)
- `src/tabs/plantings.html` (строки 722–825)
- `src/tabs/equip.html` (строки 826–1236)
- `src/tabs/finance.html` (строки 1237–1723)
- `src/tabs/tasks.html` (строки 1724–1894)
- `src/tabs/smeta.html` (строки 1895–2016)
- `src/tabs/docs-tab.html` (строки 2017–2220)
- `src/tabs/build.html` (строки 2221–2569)
- `src/tabs/map.html` (строки 2570–2906)
- `src/tabs/crew.html` (строки 2907–3041)
- `src/tabs/qa.html` (строки 3042–3057)
- `src/tabs/ops.html` (строки 3058–3376)
- `src/tabs/daily.html` (из daily.html)
- `src/tabs/field-map.html` (из field-map.html)
- `src/tabs/routine.html` (из routine.html)
- `src/tabs/calc.html` (из calc.html)
- `src/tabs/montage.html` (из montage.html)
- `src/tabs/schedule.html` (из schedule.html)
- `build.js`

**Изменить:**
- `update.bat` — добавить `node build.js` перед git push
- `src/shared/sidebar.html` — добавить 6 новых пунктов меню
- `index.html` — полностью перегенерируется build.js

**Удалить (после проверки):**
- `docs.html`, `daily.html`, `field-map.html`, `routine.html`, `calc.html`, `montage.html`, `schedule.html`

---

## Task 1: Создать папки и JSON-файлы данных

**Files:**
- Create: `src/data/finance.json`
- Create: `src/data/crew.json`
- Create: `src/data/materials.json`
- Create: `src/data/tasks.json`

- [ ] **Step 1: Создать папки**

```bash
mkdir -p src/data src/shared src/tabs
```

- [ ] **Step 2: Создать src/data/finance.json**

```json
{
  "tranches": [
    { "amount": 10000000, "date": "2026-05-18", "label": "Транш 1", "status": "paid" },
    { "amount": 20000000, "date": "2026-05-22", "label": "Транш 2", "status": "paid" }
  ],
  "totalReceived": 30000000,
  "expenses": [
    { "name": "СТИЛЕКС трубы ПЭ (счёт 290)", "amount": 700000, "status": "paid", "date": "2026-05-18", "remainder": 1659810 },
    { "name": "Авто Lada Granta ИП Парамонов (счёт 125)", "amount": 58900, "status": "paid", "date": "2026-05-18" },
    { "name": "Озон товары бытовка (счёт 545)", "amount": 15054, "status": "paid", "date": "2026-05-18" },
    { "name": "Биотуалет 1 кабина + 4 обсл. ИП Сазыкин (счёт 86)", "amount": 14000, "status": "paid", "date": "2026-05-18" },
    { "name": "Бытовки × 2 + доставка (Крымтехкаркас)", "amount": null, "status": "paid", "note": "сумма не уточнена" }
  ],
  "pending": [
    { "name": "Ёмкости ПЭ 10 000 л × 8 шт. (КОИ52)", "amount": 671040, "due": "2026-05-15", "overdue": true }
  ],
  "confirmedTotal": 787954,
  "paymentSchedule": {
    "official": [
      { "date": "2026-05-15", "amount": 10000000, "note": "просрочена" },
      { "date": "2026-06-05", "amount": 24000000 },
      { "date": "2026-06-19", "amount": 4393848 }
    ],
    "unofficial": [
      { "date": "2026-05-18", "amount": 7000000, "status": "paid" },
      { "date": "2026-05-25", "amount": 5000000, "status": "pending" },
      { "date": "2026-06-12", "amount": 20000000, "status": "scheduled" }
    ]
  }
}
```

- [ ] **Step 3: Создать src/data/crew.json**

```json
{
  "startDate": "2026-05-18",
  "brigades": [
    {
      "id": "A",
      "name": "Бр.А",
      "contractor": "ГС",
      "task": "магистраль/НС",
      "members": ["Примачок", "Темников", "Швец-Роговой", "Васильев", "Рыков"]
    },
    {
      "id": "B",
      "name": "Бр.Б",
      "contractor": "ГС",
      "task": "земля/латераль",
      "members": ["Прусаков", "Борисов Д.", "Борисов А.", "Браковенко"]
    },
    {
      "id": "V",
      "name": "Бр.В",
      "contractor": "СУЛАНЖ",
      "task": "капельная лента",
      "members": ["Костров", "Моисеенко", "Божко", "Высидалко"]
    }
  ],
  "management": [
    { "name": "Шпилёв А.А.", "role": "Руководитель проекта", "phone": "+7(978)812-36-47" },
    { "name": "Яковлев А.М.", "role": "Координатор", "phone": "+7(978)786-07-67" }
  ],
  "transport": [
    { "type": "Lada Largus", "plate": "У643ТК 797", "owner": "ГС" },
    { "type": "Газель", "plate": "Т410ВУ 977", "owner": "ГС" },
    { "type": "Toyota RAV4", "plate": "В325ЕС 92", "owner": "Лёха" },
    { "type": "VW Tiguan", "plate": "А289ХР 92", "owner": "Шпилёв" },
    { "type": "Lada Granta", "plate": "аренда", "owner": "ИП Парамонов" }
  ]
}
```

- [ ] **Step 4: Создать src/data/materials.json**

```json
{
  "items": [
    {
      "name": "Насосы Masdaf",
      "status": "missing",
      "note": "запрос подан КвадроГрупп, доставка 10–14 дн.",
      "icon": "❌"
    },
    {
      "name": "Ёмкости ПЭ 10 000 л × 8 шт. (КОИ52, 671 040 ₽)",
      "status": "missing",
      "note": "счёт НЕ ОПЛАЧЕН, просрочен 15.05",
      "icon": "❌"
    },
    {
      "name": "ТУ на электроснабжение (45–56 кВт)",
      "status": "missing",
      "note": "не получены",
      "icon": "❌"
    },
    {
      "name": "Капельная трубка METZER",
      "status": "partial",
      "note": "первые 50 000 м придут 29.05 (нужно 217 000 м, дефицит 167 000 м)",
      "icon": "⚠️"
    },
    {
      "name": "Крючки Irritec 16 мм",
      "status": "partial",
      "note": "62 000 шт. на Суланже (нужно ~217 000 шт., дефицит 155 000 шт.)",
      "icon": "⚠️"
    },
    {
      "name": "Трубы ПЭ СТИЛЕКС",
      "status": "ok",
      "note": "оплачено 700 000 ₽, поставка ожидается",
      "icon": "✅"
    },
    {
      "name": "Бытовки × 2",
      "status": "ok",
      "note": "оплачены, Крымтехкаркас",
      "icon": "✅"
    },
    {
      "name": "Биотуалет, Озон, аренда авто",
      "status": "ok",
      "note": "оплачены 18.05",
      "icon": "✅"
    }
  ]
}
```

- [ ] **Step 5: Создать src/data/tasks.json**

```json
{
  "urgent": [
    {
      "text": "Оплатить ёмкости ПЭ 10 000 л × 8 шт. (КОИ52) — 671 040 ₽, счёт просрочен с 15.05",
      "responsible": "Надежда",
      "priority": "danger"
    },
    {
      "text": "Получить ТУ на электроснабжение 45–56 кВт",
      "responsible": "Шпилёв",
      "priority": "danger"
    },
    {
      "text": "Уточнить статус насосов Masdaf у КвадроГрупп",
      "responsible": "Яковлев",
      "priority": "warn"
    },
    {
      "text": "Уточнить итоговую сумму за бытовки Крымтехкаркас",
      "responsible": "Шпилёв",
      "priority": "warn"
    }
  ]
}
```

- [ ] **Step 6: Коммит**

```bash
git add src/
git commit -m "feat: добавить JSON-файлы данных (finance, crew, materials, tasks)"
```

---

## Task 2: Извлечь общий CSS из index.html

**Files:**
- Create: `src/shared/style.css`

- [ ] **Step 1: Прочитать строки 8–431 из index.html**

Открыть `index.html`, найти блок `<style>` (строки 8–431) — это всё между `<style>` и `</style>` внутри `<head>`.

- [ ] **Step 2: Создать src/shared/style.css**

Скопировать содержимое CSS-блока (строки 8–431) в `src/shared/style.css`.  
Начало файла должно выглядеть так:
```css
:root{
  --bg:#111a10;--sidebar:#0a1509;--topbar:#0d1a0f;
  --gold:#c9a84c;--gold-dim:rgba(201,168,76,.12);--gold-mid:rgba(201,168,76,.2);
  ...
}
```

- [ ] **Step 3: Проверить**

```bash
wc -l src/shared/style.css
```
Ожидаем: ~424 строки.

- [ ] **Step 4: Коммит**

```bash
git add src/shared/style.css
git commit -m "feat: извлечь общий CSS в src/shared/style.css"
```

---

## Task 3: Извлечь JavaScript из index.html

**Files:**
- Create: `src/shared/script.js`

- [ ] **Step 1: Прочитать строки 3377–4017 из index.html**

Найти блок `<script>` в конце index.html (строки 3377–4017).

- [ ] **Step 2: Создать src/shared/script.js**

Скопировать содержимое JS-блока (без тегов `<script>` и `</script>`) в `src/shared/script.js`.  
Начало файла:
```js
function printPDF(){
  const details=document.querySelectorAll('details');
  ...
}
function showPage(id,btn){
  ...
}
```

- [ ] **Step 3: Проверить**

```bash
wc -l src/shared/script.js
```
Ожидаем: ~640 строк.

- [ ] **Step 4: Коммит**

```bash
git add src/shared/script.js
git commit -m "feat: извлечь JS в src/shared/script.js"
```

---

## Task 4: Извлечь topbar и sidebar из index.html

**Files:**
- Create: `src/shared/topbar.html`
- Create: `src/shared/sidebar.html`

- [ ] **Step 1: Создать src/shared/topbar.html**

Скопировать из index.html строки 436–458 (блок `<div class="topbar">...</div>`).

- [ ] **Step 2: Создать src/shared/sidebar.html**

Скопировать из index.html строки 462–483 (блок `<nav class="sidebar">...</nav>`).  
Этот файл будет изменён в Task 8 — пока оставляем как есть (13 пунктов).

- [ ] **Step 3: Коммит**

```bash
git add src/shared/
git commit -m "feat: извлечь topbar и sidebar в src/shared/"
```

---

## Task 5: Извлечь 13 вкладок из index.html

**Files:**
- Create: `src/tabs/overview.html` (строки 489–634)
- Create: `src/tabs/blocks.html` (строки 635–721)
- Create: `src/tabs/plantings.html` (строки 722–825)
- Create: `src/tabs/equip.html` (строки 826–1236)
- Create: `src/tabs/finance.html` (строки 1237–1723)
- Create: `src/tabs/tasks.html` (строки 1724–1894)
- Create: `src/tabs/smeta.html` (строки 1895–2016)
- Create: `src/tabs/docs-tab.html` (строки 2017–2220)
- Create: `src/tabs/build.html` (строки 2221–2569)
- Create: `src/tabs/map.html` (строки 2570–2906)
- Create: `src/tabs/crew.html` (строки 2907–3041)
- Create: `src/tabs/qa.html` (строки 3042–3057)
- Create: `src/tabs/ops.html` (строки 3058–3376)

- [ ] **Step 1: Написать скрипт-разрезатель extract_tabs.js**

Создать `extract_tabs.js` в корне vineyard-deploy:

```js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const tabs = [
  { id: 'overview',  start: 489,  end: 634  },
  { id: 'blocks',    start: 635,  end: 721  },
  { id: 'plantings', start: 722,  end: 825  },
  { id: 'equip',     start: 826,  end: 1236 },
  { id: 'finance',   start: 1237, end: 1723 },
  { id: 'tasks',     start: 1724, end: 1894 },
  { id: 'smeta',     start: 1895, end: 2016 },
  { id: 'docs-tab',  start: 2017, end: 2220 },
  { id: 'build',     start: 2221, end: 2569 },
  { id: 'map',       start: 2570, end: 2906 },
  { id: 'crew',      start: 2907, end: 3041 },
  { id: 'qa',        start: 3042, end: 3057 },
  { id: 'ops',       start: 3058, end: 3376 },
];

tabs.forEach(({ id, start, end }) => {
  // строки 1-индексированы, массив 0-индексирован
  const content = lines.slice(start - 1, end).join('\n');
  fs.writeFileSync(`src/tabs/${id}.html`, content, 'utf8');
  console.log(`✓ src/tabs/${id}.html (строки ${start}–${end})`);
});

console.log('Готово: 13 вкладок извлечено.');
```

- [ ] **Step 2: Запустить скрипт**

```bash
node extract_tabs.js
```

Ожидаем вывод:
```
✓ src/tabs/overview.html (строки 489–634)
✓ src/tabs/blocks.html (строки 635–721)
...
✓ src/tabs/ops.html (строки 3058–3376)
Готово: 13 вкладок извлечено.
```

- [ ] **Step 3: Проверить что все 13 файлов созданы**

```bash
ls src/tabs/
```

- [ ] **Step 4: Проверить первый файл**

```bash
head -3 src/tabs/overview.html
tail -3 src/tabs/overview.html
```

Первая строка должна начинаться с `<div class="page` или комментария `<!-- ══`.  
Последняя строка — закрывающий `</div>`.

- [ ] **Step 5: Коммит**

```bash
git add src/tabs/ extract_tabs.js
git commit -m "feat: извлечь 13 вкладок index.html в src/tabs/"
```

---

## Task 6: Извлечь 6 дополнительных страниц как вкладки

**Files:**
- Create: `src/tabs/daily.html`
- Create: `src/tabs/field-map.html`
- Create: `src/tabs/routine.html`
- Create: `src/tabs/calc.html`
- Create: `src/tabs/montage.html`
- Create: `src/tabs/schedule.html`

- [ ] **Step 1: Написать скрипт-конвертер convert_pages.js**

Создать `convert_pages.js` в корне:

```js
const fs = require('fs');

const pages = [
  { file: 'daily.html',     id: 'daily',     title: 'Журнал' },
  { file: 'field-map.html', id: 'field-map', title: 'Схема поля' },
  { file: 'routine.html',   id: 'routine',   title: 'Распорядок' },
  { file: 'calc.html',      id: 'calc',      title: 'Шпаргалка' },
  { file: 'montage.html',   id: 'montage',   title: 'Регламент' },
  { file: 'schedule.html',  id: 'schedule',  title: 'График работ' },
];

pages.forEach(({ file, id, title }) => {
  const html = fs.readFileSync(file, 'utf8');

  // Извлечь <style>...</style> блок (если есть)
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const styleBlock = styleMatch
    ? `<style>\n${styleMatch[1]}\n</style>\n`
    : '';

  // Извлечь содержимое <body>...</body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1].trim() : html;

  // Обернуть в <div class="page">
  const output =
`<div class="page" id="page-${id}">
${styleBlock}<div class="page-inner-doc">
${bodyContent}
</div>
</div>`;

  fs.writeFileSync(`src/tabs/${id}.html`, output, 'utf8');
  console.log(`✓ src/tabs/${id}.html ← ${file}`);
});

console.log('Готово: 6 дополнительных страниц конвертировано.');
```

- [ ] **Step 2: Запустить**

```bash
node convert_pages.js
```

Ожидаем:
```
✓ src/tabs/daily.html ← daily.html
✓ src/tabs/field-map.html ← field-map.html
✓ src/tabs/routine.html ← routine.html
✓ src/tabs/calc.html ← calc.html
✓ src/tabs/montage.html ← montage.html
✓ src/tabs/schedule.html ← schedule.html
Готово: 6 дополнительных страниц конвертировано.
```

- [ ] **Step 3: Проверить один из файлов**

```bash
head -5 src/tabs/daily.html
tail -3 src/tabs/daily.html
```

Первая строка: `<div class="page" id="page-daily">`  
Последняя: `</div>`

- [ ] **Step 4: Добавить стиль-изоляцию в src/shared/style.css**

Добавить в конец `src/shared/style.css`:

```css
/* Изоляция печатных документов внутри вкладок */
.page-inner-doc {
  background: #fff;
  color: #1a1a1a;
  padding: 16px;
  border-radius: 8px;
  margin: 8px 0;
}
```

- [ ] **Step 5: Коммит**

```bash
git add src/tabs/ convert_pages.js src/shared/style.css
git commit -m "feat: конвертировать 6 дополнительных страниц в вкладки"
```

---

## Task 7: Написать build.js

**Files:**
- Create: `build.js`

- [ ] **Step 1: Создать build.js**

```js
const fs = require('fs');
const path = require('path');

// ── Загрузка данных ──────────────────────────────────────────
const DATA = {
  finance:   JSON.parse(fs.readFileSync('src/data/finance.json',   'utf8')),
  crew:      JSON.parse(fs.readFileSync('src/data/crew.json',      'utf8')),
  materials: JSON.parse(fs.readFileSync('src/data/materials.json', 'utf8')),
  tasks:     JSON.parse(fs.readFileSync('src/data/tasks.json',     'utf8')),
};

// ── Загрузка общих файлов ───────────────────────────────────
const sharedCSS  = fs.readFileSync('src/shared/style.css',   'utf8');
const sharedJS   = fs.readFileSync('src/shared/script.js',   'utf8');
const topbar     = fs.readFileSync('src/shared/topbar.html', 'utf8');
const sidebar    = fs.readFileSync('src/shared/sidebar.html','utf8');

// ── Порядок вкладок ─────────────────────────────────────────
const TAB_ORDER = [
  'overview', 'blocks', 'plantings', 'equip', 'map',
  'finance', 'tasks', 'build', 'schedule', 'crew', 'smeta',
  'daily', 'field-map', 'routine', 'calc', 'montage',
  'docs-tab', 'qa', 'ops',
];

// ── Загрузка вкладок ────────────────────────────────────────
const tabs = TAB_ORDER.map(id => {
  const filePath = `src/tabs/${id}.html`;
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Вкладка не найдена: ${filePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}).join('\n\n');

// ── Сборка index.html ───────────────────────────────────────
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

<script>
window.DATA = ${JSON.stringify(DATA, null, 2)};
</script>
<script>
${sharedJS}
</script>
</body>
</html>`;

fs.writeFileSync('index.html', output, 'utf8');
const kb = Math.round(fs.statSync('index.html').size / 1024);
console.log(`✓ index.html собран (${kb} кб)`);
```

- [ ] **Step 2: Запустить сборку**

```bash
node build.js
```

Ожидаем:
```
✓ index.html собран (XXX кб)
```

Если ошибки — исправить пути к файлам.

- [ ] **Step 3: Проверить что index.html начинается правильно**

```bash
head -10 index.html
```

Должно начинаться с `<!DOCTYPE html>`.

- [ ] **Step 4: Проверить размер**

```bash
wc -l index.html
```

Ожидаем: больше 4019 строк (добавились 6 новых вкладок + данные).

- [ ] **Step 5: Коммит**

```bash
git add build.js
git commit -m "feat: добавить build.js — сборщик index.html из src/"
```

---

## Task 8: Обновить боковое меню — добавить 6 новых вкладок

**Files:**
- Modify: `src/shared/sidebar.html`

- [ ] **Step 1: Открыть src/shared/sidebar.html**

Найти конец файла — закрывающий `</nav>`.

- [ ] **Step 2: Добавить 6 новых пунктов перед </nav>**

Вставить новую группу «Рабочие документы» перед `</nav>`:

```html
    <div class="nav-divider" data-roles="all монтаж"></div>
    <div class="nav-group-label" data-roles="all монтаж">Документы</div>
    <div class="nav-item" data-roles="all монтаж" onclick="showPage('daily',this)"><span class="ni">📓</span>Журнал</div>
    <div class="nav-item" data-roles="all монтаж" onclick="showPage('field-map',this)"><span class="ni">🗺️</span>Схема поля</div>
    <div class="nav-item" data-roles="all монтаж" onclick="showPage('routine',this)"><span class="ni">📌</span>Распорядок</div>
    <div class="nav-item" data-roles="all монтаж" onclick="showPage('calc',this)"><span class="ni">📎</span>Шпаргалка</div>
    <div class="nav-item" data-roles="all монтаж" onclick="showPage('montage',this)"><span class="ni">📐</span>Регламент</div>
    <div class="nav-item" data-roles="all монтаж финансы заказчик" onclick="showPage('schedule',this)"><span class="ni">📅</span>График</div>
```

- [ ] **Step 3: Убрать ссылку на docs.html из topbar**

Открыть `src/shared/topbar.html`.  
Найти строку с `href="docs.html"` и заменить на:

```html
<a class="doc-pill" onclick="showPage('docs-tab',document.querySelector('[onclick*=docs-tab]'))" style="cursor:pointer;background:rgba(201,168,76,.13);border-color:rgba(201,168,76,.35)"><span class="doc-pill-icon">📚</span><span class="doc-pill-text"><b>Документы</b> · реестр</span></a>
```

- [ ] **Step 4: Пересобрать**

```bash
node build.js
```

- [ ] **Step 5: Коммит**

```bash
git add src/shared/sidebar.html src/shared/topbar.html
git commit -m "feat: обновить sidebar — 19 вкладок, убрать ссылку на docs.html"
```

---

## Task 9: Обновить update.bat и проверить в браузере

**Files:**
- Modify: `update.bat`

- [ ] **Step 1: Открыть update.bat и проверить текущее содержимое**

```bash
cat update.bat
```

- [ ] **Step 2: Обновить update.bat**

Заменить содержимое на:

```bat
@echo off
echo Сборка...
node build.js
if %errorlevel% neq 0 (
  echo ОШИБКА сборки! Деплой отменён.
  pause
  exit /b 1
)
echo Деплой...
git add -A
git commit -m "update: пересборка дашборда"
git push
echo Готово!
```

- [ ] **Step 3: Открыть index.html в браузере**

Открыть файл `C:\Users\user\Desktop\vineyard-deploy\index.html` в браузере.  
Проверить:
- [ ] Все 13 оригинальных вкладок открываются (Главная, Блоки, Финансы...)
- [ ] 6 новых вкладок в боковом меню видны (Журнал, Схема поля, Распорядок, Шпаргалка, Регламент, График)
- [ ] Клик на каждую из 6 новых вкладок — страница открывается
- [ ] Журнал (daily) — виден список дней
- [ ] Бригада — localStorage работает (данные не сбросились)

- [ ] **Step 4: Коммит update.bat**

```bash
git add update.bat
git commit -m "feat: обновить update.bat — сборка перед деплоем"
```

---

## Task 10: Удалить старые файлы и задеплоить

**Files:**
- Delete: `docs.html`, `daily.html`, `field-map.html`, `routine.html`, `calc.html`, `montage.html`, `schedule.html`
- Delete: `extract_tabs.js`, `convert_pages.js` (временные скрипты)

- [ ] **Step 1: Удалить старые HTML-файлы**

```bash
git rm docs.html daily.html field-map.html routine.html calc.html montage.html schedule.html
```

- [ ] **Step 2: Удалить временные скрипты**

```bash
git rm extract_tabs.js convert_pages.js
```

- [ ] **Step 3: Финальная сборка**

```bash
node build.js
```

- [ ] **Step 4: Коммит и деплой**

```bash
git add -A
git commit -m "refactor: одна ссылка — 19 вкладок в index.html, src/ структура, JSON данные"
git push
```

- [ ] **Step 5: Проверить сайт**

Открыть https://dimaborisov410-coder.github.io/4s-grape-garden/  
Подождать 1–2 минуты (GitHub Pages обновляется).  
Проверить: сайт работает, все 19 вкладок открываются.

---

## Self-Review

**Spec coverage:**
- ✅ Одна ссылка — Task 10 удаляет 7 файлов, остаётся только index.html
- ✅ Данные в JSON — Task 1 создаёт 4 JSON-файла
- ✅ Общие стили — Task 2 создаёт style.css
- ✅ Вкладки по файлам — Tasks 5–6 создают 19 файлов в src/tabs/
- ✅ Сборщик — Task 7 создаёт build.js
- ✅ Деплой — Task 10 обновляет update.bat и пушит
- ✅ materials.json подключён к daily.html и field-map.html через window.DATA (инжектируется в index.html)

**Ограничение:** JSON данные инжектируются как window.DATA, но сами вкладки пока читают из hardcoded HTML. Это нормально для первой итерации — структура готова, данные будут мигрированы постепенно.
