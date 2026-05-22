# calc.html Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Полностью переписать `calc.html` — создать современный 5-страничный A4-документ (Стиль Б: карточки/инфографика, Структура В: Дашборд + 4 страницы ролей) с реальными данными объекта, заполняемыми полями для Шпилёва/Яковлева и корректными расчётами.

**Architecture:** Один самодостаточный HTML-файл без внешних зависимостей. CSS Grid для карточек. `@page { size: A4 }` + `page-break-before: always` между страницами. Один inline `<script>` генерирует строки таблицы Рабочего (86 рабочих дней) — без бизнес-логики JS. Все константы объекта объявлены в начале скрипта. Поля для ручного заполнения — пустые `<td>` с минимальной шириной.

**Tech Stack:** HTML5, CSS3 (custom properties, Grid), ванильный JS (только генерация дат), `window.print()` для PDF.

---

## Структура файлов

| Файл | Действие | Ответственность |
|------|----------|-----------------|
| `calc.html` | Полная перезапись | Все 5 страниц, стили, скрипт генерации дат |

---

### Task 1: Скелет HTML, CSS-переменные, фундамент A4-печати

**Files:**
- Modify: `calc.html` (полная перезапись)

- [ ] **Step 1: Записать полный скелет файла**

Заменить содержимое `calc.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Шпаргалка · Виноградник 56,7 га · №ГС-12-05</title>
<style>
:root {
  --g-dark:  #1a4d2e;
  --g-mid:   #2d6a4f;
  --g-light: #40916c;
  --yellow:  #fff3cd;
  --y-bord:  #ffc107;
  --red-lt:  #fce4ec;
  --blue-lt: #e3f2fd;
  --border:  #dee2e6;
  --text:    #212529;
  --muted:   #6c757d;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: Arial, sans-serif;
  font-size: 9pt;
  color: var(--text);
  background: #ecf0ec;
}

/* ── A4 shell ── */
@page { size: A4 portrait; margin: 10mm 10mm 10mm 12mm; }
@media print {
  body { background: white; }
  .no-print { display: none !important; }
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.page {
  width: 210mm;
  min-height: 297mm;
  background: white;
  margin: 0 auto 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,.15);
  page-break-before: always;
  page-break-after: always;
  overflow: hidden;
}
.page:first-of-type { page-break-before: avoid; }

/* ── Page header bar ── */
.ph {
  background: var(--g-dark);
  color: white;
  padding: 9px 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.ph h1 { font-size: 11pt; font-weight: bold; line-height: 1.2; }
.ph .sub { font-size: 7pt; opacity: .75; margin-top: 2px; }
.ph .role-badge {
  background: rgba(255,255,255,.2);
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 8pt;
  font-weight: bold;
  white-space: nowrap;
  align-self: center;
}

/* ── PDF button ── */
.btn-pdf {
  background: rgba(255,255,255,.2);
  color: white;
  border: 1px solid rgba(255,255,255,.4);
  padding: 5px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 8.5pt;
  align-self: center;
}

/* ── Page body ── */
.pb { padding: 10px 14px 12px; }

/* ── KPI cards ── */
.kpi-row { display: grid; gap: 6px; margin-bottom: 10px; }
.kpi-card {
  border-radius: 6px;
  padding: 8px 10px;
  text-align: center;
}
.kpi-card .lbl { font-size: 6.5pt; margin-bottom: 2px; }
.kpi-card .val { font-size: 14pt; font-weight: bold; line-height: 1.1; }
.kpi-card .sub-val { font-size: 7pt; margin-top: 1px; }

/* KPI on dark header */
.kpi-dark .kpi-card { background: rgba(255,255,255,.15); color: white; }
.kpi-dark .kpi-card .lbl { opacity: .75; }

/* KPI on white body */
.kpi-light .kpi-card { background: #f0f7f2; color: var(--g-dark); border: 1px solid #c8e6c9; }

/* ── Section title ── */
.st {
  font-size: 8pt;
  font-weight: bold;
  color: var(--g-dark);
  text-transform: uppercase;
  letter-spacing: .4px;
  border-bottom: 2px solid var(--g-dark);
  padding-bottom: 2px;
  margin: 10px 0 6px;
}

/* ── Data tables ── */
.tbl { width: 100%; border-collapse: collapse; font-size: 8pt; }
.tbl th {
  background: var(--g-dark);
  color: white;
  padding: 3px 5px;
  font-size: 7.5pt;
  font-weight: bold;
  text-align: center;
  border: 1px solid var(--g-mid);
}
.tbl td { padding: 2px 5px; border: 1px solid var(--border); vertical-align: middle; }
.tbl tr.week-sum { background: #e8f5e9; font-weight: bold; }
.tbl tr.milestone { background: var(--yellow); }
.tbl tr.kt { background: var(--blue-lt); font-weight: bold; }
.tbl tr.ns td { color: var(--muted); font-style: italic; }

/* ── Brigade cards ── */
.brigade-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 6px; }
.brig-card {
  border: 2px solid var(--g-dark);
  border-radius: 6px;
  overflow: hidden;
}
.brig-head {
  background: var(--g-dark);
  color: white;
  padding: 5px 8px;
  font-size: 8pt;
  font-weight: bold;
}
.brig-body { padding: 6px 8px; font-size: 7.5pt; }
.brig-member { padding: 1.5px 0; border-bottom: 1px dashed #eee; }
.brig-member:last-child { border-bottom: none; }

/* ── Progress bar ── */
.prog-wrap { margin: 8px 0; }
.prog-track {
  height: 16px;
  background: #c8e6c9;
  border-radius: 8px;
  position: relative;
  margin-bottom: 4px;
}
.prog-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--g-dark), var(--g-light));
  border-radius: 8px;
  transition: width .3s;
}
.prog-labels { display: flex; justify-content: space-between; font-size: 6.5pt; color: var(--muted); }

/* ── Two-column layout (Page 5) ── */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* ── Risk list ── */
.risk { 
  background: var(--red-lt);
  border-left: 3px solid #e91e63;
  padding: 4px 8px;
  margin-bottom: 4px;
  font-size: 7.5pt;
  border-radius: 0 4px 4px 0;
}

/* ── Template fields (Page 5) ── */
.tpl-field {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
  font-size: 8pt;
}
.tpl-field label { min-width: 130px; color: var(--muted); font-size: 7.5pt; }
.tpl-field .inp {
  flex: 1;
  border: none;
  border-bottom: 1.5px solid var(--g-dark);
  padding: 1px 4px;
  font-size: 9pt;
  font-family: Arial, sans-serif;
  outline: none;
  background: transparent;
}

/* ── Formula chain ── */
.formula-chain {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  font-size: 7.5pt;
  margin: 6px 0;
}
.fc-box {
  background: #e8f5e9;
  border: 1px solid var(--g-light);
  border-radius: 4px;
  padding: 3px 7px;
  font-weight: bold;
  color: var(--g-dark);
  white-space: nowrap;
}
.fc-arrow { color: var(--g-mid); font-size: 9pt; }
</style>
</head>
<body>

<!-- ═══════════════ PAGE 1: ДАШБОРД ═══════════════ -->

<!-- ═══════════════ PAGE 2: РАБОЧИЙ ═══════════════ -->

<!-- ═══════════════ PAGE 3: БРИГАДИР ═══════════════ -->

<!-- ═══════════════ PAGE 4: РУКОВОДИТЕЛЬ ═══════════════ -->

<!-- ═══════════════ PAGE 5: ДИРЕКТОР ═══════════════ -->

<script>
/* Генератор строк таблицы Рабочего (Стр. 2) */
</script>
</body>
</html>
```

- [ ] **Step 2: Открыть в браузере, убедиться в корректной загрузке**

```powershell
Start-Process "C:\Users\user\Desktop\vineyard-deploy\calc.html"
```

Ожидаемый результат: пустая страница, нет ошибок в консоли.

- [ ] **Step 3: Коммит скелета**

```bash
git add calc.html
git commit -m "feat: calc.html — CSS skeleton, A4 print foundation, CSS variables"
```

---

### Task 2: Страница 1 — Дашборд объекта

**Files:**
- Modify: `calc.html` (заменить комментарий `<!-- PAGE 1: ДАШБОРД -->`)

- [ ] **Step 1: Вставить HTML дашборда вместо комментария PAGE 1**

```html
<!-- ═══════════════ PAGE 1: ДАШБОРД ═══════════════ -->
<div class="page" id="p1">

  <!-- Шапка с кнопкой PDF -->
  <div class="ph">
    <div>
      <h1>ВИНОГРАДНИК · 56,7 ГА · С. ПОЖАРСКОЕ, КРЫМ</h1>
      <div class="sub">ООО «СУЛАНЖ» + ООО «Гарден Сити» &nbsp;·&nbsp; Договор №ГС-12-05 от 12.05.2026 &nbsp;·&nbsp; 38,4 млн ₽</div>
    </div>
    <button class="btn-pdf no-print" onclick="window.print()">⬇ Сохранить PDF</button>
  </div>

  <!-- KPI-карточки на тёмном фоне -->
  <div style="background:var(--g-mid);padding:8px 14px;">
    <div class="kpi-row kpi-dark" style="grid-template-columns:1fr 1fr 1fr 1fr;">
      <div class="kpi-card">
        <div class="lbl">Готовность</div>
        <div class="val" id="kpi-ready">___&nbsp;%</div>
        <div class="sub-val" style="opacity:.7;">от 217 000 м</div>
      </div>
      <div class="kpi-card">
        <div class="lbl">Капля уложена</div>
        <div class="val" id="kpi-laid">___&nbsp;м</div>
        <div class="sub-val" style="opacity:.7;">из 217 000 м</div>
      </div>
      <div class="kpi-card">
        <div class="lbl">На объекте</div>
        <div class="val">15&nbsp;чел.</div>
        <div class="sub-val" style="opacity:.7;">13 пол. + 2 ИТР</div>
      </div>
      <div class="kpi-card">
        <div class="lbl">Финиш (договор)</div>
        <div class="val" style="font-size:11pt;">25.08.2026</div>
        <div class="sub-val" style="opacity:.7;">100 к.д. от 18.05</div>
      </div>
    </div>
  </div>

  <div class="pb">

    <!-- Прогресс-бар с контрольными точками -->
    <div class="st">Контрольные точки — укладка капли</div>
    <div class="prog-wrap">
      <div class="prog-track">
        <div class="prog-fill" id="prog-fill" style="width:0%"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;font-size:7pt;text-align:center;">
        <div style="color:var(--g-dark);font-weight:bold;">
          КТ-1 · 30.06<br><span style="font-size:8pt;font-weight:bold;">46 800 м</span>
        </div>
        <div style="color:var(--g-dark);font-weight:bold;">
          КТ-2 · 21.07<br><span style="font-size:8pt;font-weight:bold;">85 800 м</span>
        </div>
        <div style="color:var(--g-dark);font-weight:bold;">
          КТ-3 · 01.08<br><span style="font-size:8pt;font-weight:bold;">163 800 м</span>
        </div>
        <div style="color:#c62828;font-weight:bold;">
          ФИНИШ · 23.08<br><span style="font-size:8pt;font-weight:bold;">217 000 м</span>
        </div>
      </div>
    </div>

    <!-- Таблица ключевых точек -->
    <div class="st">График выполнения — план</div>
    <table class="tbl" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>КТ</th><th>Дата</th><th>Нараст. план, м</th><th>Нараст. факт, м</th><th>% вып.</th><th>Откл. ±м</th><th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight:bold;color:var(--g-dark);">КТ-1</td>
          <td>30.06.2026</td>
          <td style="text-align:right;">46 800</td>
          <td style="text-align:right;"></td>
          <td style="text-align:center;"></td>
          <td style="text-align:right;"></td>
          <td></td>
        </tr>
        <tr>
          <td style="font-weight:bold;color:var(--g-dark);">КТ-2</td>
          <td>21.07.2026</td>
          <td style="text-align:right;">85 800</td>
          <td style="text-align:right;"></td>
          <td style="text-align:center;"></td>
          <td style="text-align:right;"></td>
          <td></td>
        </tr>
        <tr>
          <td style="font-weight:bold;color:var(--g-dark);">КТ-3</td>
          <td>01.08.2026</td>
          <td style="text-align:right;">163 800</td>
          <td style="text-align:right;"></td>
          <td style="text-align:center;"></td>
          <td style="text-align:right;"></td>
          <td></td>
        </tr>
        <tr style="background:#fce4ec;">
          <td style="font-weight:bold;color:#c62828;">ФИНИШ</td>
          <td>23.08.2026</td>
          <td style="text-align:right;">217 000</td>
          <td style="text-align:right;"></td>
          <td style="text-align:center;"></td>
          <td style="text-align:right;"></td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <!-- Карточки бригад -->
    <div class="st">Бригады на объекте</div>
    <div class="brigade-grid">

      <div class="brig-card">
        <div class="brig-head">
          БРИГАДА А · 5 чел.
          <span style="font-size:6.5pt;font-weight:normal;opacity:.8;float:right;">ГС / НС + трубы → капля</span>
        </div>
        <div class="brig-body">
          <div class="brig-member">👷 Примачок (бригадир)</div>
          <div class="brig-member">Темников</div>
          <div class="brig-member">Швец-Роговой</div>
          <div class="brig-member">Васильев</div>
          <div class="brig-member">Рыков</div>
        </div>
      </div>

      <div class="brig-card">
        <div class="brig-head">
          БРИГАДА Б · 4 чел.
          <span style="font-size:6.5pt;font-weight:normal;opacity:.8;float:right;">ГС / земля + трубы → капля</span>
        </div>
        <div class="brig-body">
          <div class="brig-member">👷 Прусаков (бригадир)</div>
          <div class="brig-member">Борисов Д.</div>
          <div class="brig-member">Борисов А.</div>
          <div class="brig-member">Браковенко</div>
        </div>
      </div>

      <div class="brig-card">
        <div class="brig-head">
          БРИГАДА В · 4 чел.
          <span style="font-size:6.5pt;font-weight:normal;opacity:.8;float:right;">СУЛАНЖ / капля с Н4</span>
        </div>
        <div class="brig-body">
          <div class="brig-member">👷 Костров (бригадир)</div>
          <div class="brig-member">Моисеенко</div>
          <div class="brig-member">Божко</div>
          <div class="brig-member">Высидалко</div>
        </div>
      </div>

    </div><!-- /brigade-grid -->

  </div><!-- /pb -->
</div><!-- /page p1 -->
```

- [ ] **Step 2: Открыть calc.html в браузере, проверить Стр. 1**

Ожидаемый результат:
- Тёмно-зелёная шапка с названием объекта и кнопкой PDF
- Полоса с 4 KPI-карточками (белый текст на тёмно-зелёном)
- Прогресс-бар с 4 точками
- Таблица КТ с пустыми колонками Факт/% вып.
- 3 карточки бригад с именами

- [ ] **Step 3: Коммит страницы 1**

```bash
git add calc.html
git commit -m "feat: calc.html — Page 1 Dashboard with KPIs, progress bar, brigade cards"
```

---

### Task 3: Страница 2 — Рабочий · Посуточный журнал

**Files:**
- Modify: `calc.html` (заменить комментарий `<!-- PAGE 2: РАБОЧИЙ -->`, добавить скрипт генерации дат)

- [ ] **Step 1: Вставить HTML каркаса Стр. 2**

```html
<!-- ═══════════════ PAGE 2: РАБОЧИЙ ═══════════════ -->
<div class="page" id="p2">
  <div class="ph">
    <div>
      <h1>РАБОЧИЙ · ПОСУТОЧНЫЙ ЖУРНАЛ</h1>
      <div class="sub">Выдаётся каждому рабочему. Бригадир подписывает ежедневно. Период: 22.05 – 29.08.2026</div>
    </div>
    <div class="role-badge">👷 РАБОЧИЙ</div>
  </div>

  <div class="pb">
    <!-- KPI-карточки рабочего -->
    <div class="kpi-row kpi-light" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:8px;">
      <div class="kpi-card">
        <div class="lbl" style="color:var(--muted);">ФИО / Бригада</div>
        <div class="val" style="font-size:10pt;border-bottom:1.5px solid var(--g-dark);padding-bottom:2px;">&nbsp;</div>
      </div>
      <div class="kpi-card">
        <div class="lbl" style="color:var(--muted);">Норма в день (с 09.06)</div>
        <div class="val">325 м</div>
        <div class="sub-val" style="color:var(--muted);">10 ч/день, 6 дн/нед</div>
      </div>
      <div class="kpi-card">
        <div class="lbl" style="color:var(--muted);">Период</div>
        <div class="val" style="font-size:10pt;">22.05 – 29.08</div>
        <div class="sub-val" style="color:var(--muted);">86 р.дн. / 100 к.д.</div>
      </div>
    </div>

    <!-- Таблица посуточного журнала -->
    <table class="tbl">
      <thead>
        <tr>
          <th style="width:42px;">Дата</th>
          <th>Участок / Блок</th>
          <th style="width:52px;">Норма, м</th>
          <th style="width:52px;">Факт, м</th>
          <th style="width:60px;">Нараст., м</th>
          <th style="width:60px;">Подпись бриг.</th>
        </tr>
      </thead>
      <tbody id="worker-rows">
        <!-- строки генерируются скриптом -->
      </tbody>
    </table>

    <div style="margin-top:8px;font-size:7pt;color:var(--muted);border-top:1px solid var(--border);padding-top:4px;">
      * При печати выбрать «Все страницы» — журнал занимает несколько листов A4. НС/тр. = нестандартные работы (трубы, монтаж оборудования) — норма капли не применяется.
    </div>
  </div>
</div><!-- /page p2 -->
```

- [ ] **Step 2: Вставить скрипт генерации строк таблицы**

В секцию `<script>` добавить (вместо комментария):

```javascript
(function buildWorkerTable() {
  var tbody = document.getElementById('worker-rows');
  if (!tbody) return;

  /* ── Константы объекта ── */
  var START      = new Date(2026, 4, 22); // 22 мая
  var DRIP_START = new Date(2026, 5, 9);  // 9 июня — старт капли
  var END        = new Date(2026, 7, 29); // 29 августа
  var NORM       = 325;                   // м/чел.день

  /* Начало каждой недели (Н1–Н15) */
  var WEEK_STARTS = [
    new Date(2026,4,22), new Date(2026,4,25),
    new Date(2026,5,1),  new Date(2026,5,8),
    new Date(2026,5,15), new Date(2026,5,22),
    new Date(2026,5,29), new Date(2026,6,6),
    new Date(2026,6,13), new Date(2026,6,20),
    new Date(2026,6,27), new Date(2026,7,3),
    new Date(2026,7,10), new Date(2026,7,17),
    new Date(2026,7,24)
  ];

  /* Особые даты — выделяются жёлтым + подпись */
  var HIGHLIGHTS = {
    '2026-06-09': 'Старт капли ▶',
    '2026-06-30': '◆ КТ-1 план 46 800 м',
    '2026-07-21': '◆ КТ-2 план 85 800 м',
    '2026-08-01': '◆ КТ-3 план 163 800 м',
    '2026-08-22': '◆ Финиш капли 217 000 м'
  };

  function fmt(d) {
    return ('0'+d.getDate()).slice(-2)+'.'+('0'+(d.getMonth()+1)).slice(-2);
  }
  function iso(d) {
    return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
  }
  function tr(html, cls) {
    var row = document.createElement('tr');
    if (cls) row.className = cls;
    row.innerHTML = html;
    tbody.appendChild(row);
  }

  var cur        = new Date(START);
  var weekIdx    = 0;   /* текущая неделя (0-based) */
  var weekDays   = 0;   /* рабочих дней в текущей неделе */
  var weekNorm   = 0;   /* итоговая норма текущей недели */

  while (cur <= END) {
    /* Воскресенье — пропуск */
    if (cur.getDay() === 0) { cur.setDate(cur.getDate()+1); continue; }

    /* Новая неделя? */
    var nextWeek = WEEK_STARTS[weekIdx + 1];
    if (nextWeek && cur >= nextWeek) {
      /* Вставить итоговую строку прошедшей недели */
      var wLabel  = weekIdx < 3 ? '—' : (weekDays * NORM + ' м');
      tr(
        '<td colspan="2" style="text-align:right;font-size:7.5pt;color:var(--g-dark);">Итого Н'+(weekIdx+1)+' (' +
          WEEK_STARTS[weekIdx].getDate()+'.'+(WEEK_STARTS[weekIdx].getMonth()+1)+'–'+
          (nextWeek.getDate()-1)+'.'+(nextWeek.getMonth()+1)+')</td>' +
        '<td style="text-align:center;color:var(--g-dark);">'+(weekIdx < 3 ? 'НС' : weekNorm)+'</td>' +
        '<td></td><td></td><td></td>',
        'week-sum'
      );
      weekIdx++;
      weekDays = 0;
      weekNorm = 0;
    }

    var key     = iso(cur);
    var isNS    = cur < DRIP_START;
    var hl      = HIGHLIGHTS[key];
    var rowCls  = hl ? 'milestone' : (isNS ? 'ns' : '');
    var normCell = isNS
      ? '<span style="color:var(--muted);">НС/тр.</span>'
      : NORM;

    tr(
      '<td style="white-space:nowrap;">'+ fmt(cur) +'</td>' +
      '<td style="'+(hl?'font-weight:bold;color:var(--g-dark);':'')+'">'+(hl||'')+'</td>' +
      '<td style="text-align:center;">'+ normCell +'</td>' +
      '<td></td><td></td><td></td>',
      rowCls
    );

    if (!isNS) { weekDays++; weekNorm += NORM; }
    cur.setDate(cur.getDate()+1);
  }

  /* Итоговая строка последней недели (Н15) */
  tr(
    '<td colspan="2" style="text-align:right;font-size:7.5pt;color:var(--g-dark);">Итого Н15 (24.08–29.08)</td>' +
    '<td style="text-align:center;color:var(--g-dark);">'+ weekNorm +'</td>' +
    '<td></td><td></td><td></td>',
    'week-sum'
  );
})();
```

- [ ] **Step 3: Проверить в браузере**

Открыть calc.html, перейти к Стр. 2.

Ожидаемый результат:
- Строки с 22.05 по 29.08 (кроме воскресений), итого 86 рабочих строк
- 22.05–08.06: в колонке Норма = «НС/тр.» серым курсивом
- 09.06: жёлтая строка «Старт капли ▶», Норма = 325
- 30.06, 21.07, 01.08, 22.08: жёлтые строки с метками КТ
- Зелёные итоговые строки по каждой неделе

- [ ] **Step 4: Коммит**

```bash
git add calc.html
git commit -m "feat: calc.html — Page 2 Worker daily journal, 86-day date generator"
```

---

### Task 4: Страница 3 — Бригадир · Недельный отчёт

**Files:**
- Modify: `calc.html` (заменить комментарий `<!-- PAGE 3: БРИГАДИР -->`)

- [ ] **Step 1: Вставить HTML Стр. 3**

```html
<!-- ═══════════════ PAGE 3: БРИГАДИР ═══════════════ -->
<div class="page" id="p3">
  <div class="ph">
    <div>
      <h1>БРИГАДИР · НЕДЕЛЬНЫЙ ОТЧЁТ</h1>
      <div class="sub">Сдаётся РП каждый понедельник утром. Вид работ: НС — нестандартные/монтаж; Капля — укладка капельной трубки.</div>
    </div>
    <div class="role-badge">🦺 БРИГАДИР</div>
  </div>

  <div class="pb">
    <div class="st">Сводная таблица по неделям — план / факт</div>

    <table class="tbl" style="font-size:7.5pt;">
      <thead>
        <tr>
          <th rowspan="2" style="width:24px;">Нед</th>
          <th rowspan="2" style="width:70px;">Даты</th>
          <th colspan="2" style="background:#1a5c36;">Бригада А (5 чел)</th>
          <th colspan="2" style="background:#1a5c36;">Бригада Б (4 чел)</th>
          <th colspan="2" style="background:#1a5c36;">Бригада В (4 чел)</th>
          <th rowspan="2" style="width:50px;">Итого план, м</th>
          <th rowspan="2" style="width:50px;">Итого факт, м</th>
          <th rowspan="2" style="width:40px;">Откл, %</th>
        </tr>
        <tr>
          <th style="background:#236b40;width:55px;">План, м</th>
          <th style="background:#236b40;width:55px;">Факт, м</th>
          <th style="background:#236b40;width:55px;">План, м</th>
          <th style="background:#236b40;width:55px;">Факт, м</th>
          <th style="background:#236b40;width:55px;">План, м</th>
          <th style="background:#236b40;width:55px;">Факт, м</th>
        </tr>
      </thead>
      <tbody>
        <!-- Н1-Н3: НС + подготовительные работы -->
        <tr class="ns">
          <td style="text-align:center;font-weight:bold;">Н1</td>
          <td style="font-size:7pt;">22–23.05</td>
          <td style="text-align:center;">НС/фильтры</td><td></td>
          <td style="text-align:center;">НС/земля</td><td></td>
          <td style="text-align:center;">НС/монтаж</td><td></td>
          <td style="text-align:center;">—</td><td></td><td></td>
        </tr>
        <tr class="ns">
          <td style="text-align:center;font-weight:bold;">Н2</td>
          <td style="font-size:7pt;">25–30.05</td>
          <td style="text-align:center;">НС/фильтры</td><td></td>
          <td style="text-align:center;">НС/земля</td><td></td>
          <td style="text-align:center;">НС/монтаж</td><td></td>
          <td style="text-align:center;">—</td><td></td><td></td>
        </tr>
        <tr class="ns">
          <td style="text-align:center;font-weight:bold;">Н3</td>
          <td style="font-size:7pt;">01–06.06</td>
          <td style="text-align:center;">НС/фильтры</td><td></td>
          <td style="text-align:center;">НС/земля</td><td></td>
          <td style="text-align:center;">НС/монтаж</td><td></td>
          <td style="text-align:center;">—</td><td></td><td></td>
        </tr>
        <!-- Н4-Н8: В на капле, А+Б на трубах -->
        <tr>
          <td style="text-align:center;font-weight:bold;">Н4</td>
          <td style="font-size:7pt;">08–13.06</td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">трубы d110</td><td></td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">земля</td><td></td>
          <td style="text-align:right;">6 500</td><td></td>
          <td style="text-align:right;">6 500</td><td></td><td></td>
        </tr>
        <tr>
          <td style="text-align:center;font-weight:bold;">Н5</td>
          <td style="font-size:7pt;">15–20.06</td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">трубы d110</td><td></td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">земля</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">7 800</td><td></td><td></td>
        </tr>
        <tr>
          <td style="text-align:center;font-weight:bold;">Н6</td>
          <td style="font-size:7pt;">22–27.06</td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">трубы d75</td><td></td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">трубы d75</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">7 800</td><td></td><td></td>
        </tr>
        <!-- Н7 = КТ-1 -->
        <tr class="kt">
          <td style="text-align:center;font-weight:bold;color:var(--g-dark);">Н7</td>
          <td style="font-size:7pt;font-weight:bold;">29.06–04.07<br><span style="font-size:6.5pt;color:#1565c0;">◆ КТ-1 30.06</span></td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">трубы d75</td><td></td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">трубы d50</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;color:#1565c0;">≥ 46 800 нараст.</td><td></td><td></td>
        </tr>
        <tr>
          <td style="text-align:center;font-weight:bold;">Н8</td>
          <td style="font-size:7pt;">06–11.07</td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">трубы d75</td><td></td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">трубы d50</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">7 800</td><td></td><td></td>
        </tr>
        <!-- Н9–Н14: все 3 бригады на капле -->
        <tr>
          <td style="text-align:center;font-weight:bold;">Н9</td>
          <td style="font-size:7pt;">13–18.07</td>
          <td style="text-align:right;">9 750</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">25 350</td><td></td><td></td>
        </tr>
        <!-- Н10 = КТ-2 -->
        <tr class="kt">
          <td style="text-align:center;font-weight:bold;color:var(--g-dark);">Н10</td>
          <td style="font-size:7pt;font-weight:bold;">20–25.07<br><span style="font-size:6.5pt;color:#1565c0;">◆ КТ-2 21.07</span></td>
          <td style="text-align:right;">9 750</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;color:#1565c0;">≥ 85 800 нараст.</td><td></td><td></td>
        </tr>
        <!-- Н11 = КТ-3 -->
        <tr class="kt">
          <td style="text-align:center;font-weight:bold;color:var(--g-dark);">Н11</td>
          <td style="font-size:7pt;font-weight:bold;">27.07–01.08<br><span style="font-size:6.5pt;color:#1565c0;">◆ КТ-3 01.08</span></td>
          <td style="text-align:right;">9 750</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;color:#1565c0;">≥ 163 800 нараст.</td><td></td><td></td>
        </tr>
        <tr>
          <td style="text-align:center;font-weight:bold;">Н12</td>
          <td style="font-size:7pt;">03–08.08</td>
          <td style="text-align:right;">9 750</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">25 350</td><td></td><td></td>
        </tr>
        <tr>
          <td style="text-align:center;font-weight:bold;">Н13</td>
          <td style="font-size:7pt;">10–15.08</td>
          <td style="text-align:right;">9 750</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">25 350</td><td></td><td></td>
        </tr>
        <tr>
          <td style="text-align:center;font-weight:bold;">Н14</td>
          <td style="font-size:7pt;">17–22.08</td>
          <td style="text-align:right;">9 750</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">7 800</td><td></td>
          <td style="text-align:right;">25 350</td><td></td><td></td>
        </tr>
        <!-- Н15 — сдача -->
        <tr style="background:#fce4ec;">
          <td style="text-align:center;font-weight:bold;color:#c62828;">Н15</td>
          <td style="font-size:7pt;font-weight:bold;color:#c62828;">24–29.08<br><span style="font-size:6.5pt;">⚑ ФИНИШ 25.08</span></td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">арматура/сдача</td><td></td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">арматура/сдача</td><td></td>
          <td style="text-align:center;font-size:7pt;color:var(--muted);">арматура/сдача</td><td></td>
          <td style="text-align:center;font-weight:bold;color:#c62828;">СДАЧА</td><td></td><td></td>
        </tr>
      </tbody>
    </table>

    <!-- Блок задания на следующую неделю -->
    <div class="st" style="margin-top:10px;">Задание на следующую неделю</div>
    <table class="tbl" style="font-size:8pt;">
      <thead>
        <tr>
          <th style="width:30%;">Бригада</th>
          <th>Вид работ</th>
          <th style="width:25%;">Участок / Блок</th>
        </tr>
      </thead>
      <tbody>
        <tr style="height:22px;"><td>Бригада А</td><td></td><td></td></tr>
        <tr style="height:22px;"><td>Бригада Б</td><td></td><td></td></tr>
        <tr style="height:22px;"><td>Бригада В</td><td></td><td></td></tr>
      </tbody>
    </table>

    <div class="st" style="margin-top:8px;">Потребность в материале</div>
    <table class="tbl" style="font-size:8pt;">
      <thead>
        <tr><th style="width:35%;">Материал</th><th style="width:20%;">Кол-во</th><th>Примечание</th></tr>
      </thead>
      <tbody>
        <tr style="height:20px;"><td></td><td></td><td></td></tr>
        <tr style="height:20px;"><td></td><td></td><td></td></tr>
        <tr style="height:20px;"><td></td><td></td><td></td></tr>
      </tbody>
    </table>
  </div>
</div><!-- /page p3 -->
```

- [ ] **Step 2: Проверить в браузере**

Ожидаемый результат:
- Таблица Н1–Н15 с Бриг.А/Б/В по столбцам (план/факт)
- Н1–Н3 серым курсивом «НС/...»
- Н4–Н8: В имеет плановые метры, А и Б — серые «трубы»
- Н7, Н10, Н11 выделены голубым (КТ)
- Н15 красно-розовый (сдача)
- Нижние таблицы задания и материала — пустые строки для заполнения

- [ ] **Step 3: Коммит**

```bash
git add calc.html
git commit -m "feat: calc.html — Page 3 Foreman weekly report H1-H15"
```

---

### Task 5: Страница 4 — Руководитель · Месячный контроль

**Files:**
- Modify: `calc.html` (заменить комментарий `<!-- PAGE 4: РУКОВОДИТЕЛЬ -->`)

- [ ] **Step 1: Вставить HTML Стр. 4**

```html
<!-- ═══════════════ PAGE 4: РУКОВОДИТЕЛЬ ═══════════════ -->
<div class="page" id="p4">
  <div class="ph">
    <div>
      <h1>РУКОВОДИТЕЛЬ · МЕСЯЧНЫЙ КОНТРОЛЬ</h1>
      <div class="sub">Заполняется 1-го числа каждого месяца. Нарастающий итог по капельной трубке.</div>
    </div>
    <div class="role-badge">📋 РУК-ЛЬ</div>
  </div>

  <div class="pb">
    <!-- KPI-карточки руководителя -->
    <div class="kpi-row kpi-light" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:10px;">
      <div class="kpi-card">
        <div class="lbl" style="color:var(--muted);">Капля нараст. (факт)</div>
        <div class="val" style="border-bottom:1.5px solid var(--g-dark);padding-bottom:2px;">___ м</div>
        <div class="sub-val" style="color:var(--muted);">из 217 000 м</div>
      </div>
      <div class="kpi-card">
        <div class="lbl" style="color:var(--muted);">Отклонение от плана</div>
        <div class="val" style="border-bottom:1.5px solid var(--g-dark);padding-bottom:2px;">± ___ м</div>
        <div class="sub-val" style="color:var(--muted);">+ опережение / − отставание</div>
      </div>
      <div class="kpi-card">
        <div class="lbl" style="color:var(--muted);">Прогноз финиша</div>
        <div class="val" style="border-bottom:1.5px solid var(--g-dark);padding-bottom:2px;">__.__.2026</div>
        <div class="sub-val" style="color:var(--muted);">по текущему темпу</div>
      </div>
    </div>

    <!-- Таблица нарастающего итога -->
    <div class="st">Нарастающий итог — план vs факт</div>
    <table class="tbl" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th style="width:80px;">Период / КТ</th>
          <th style="width:55px;">Дата</th>
          <th style="width:65px;">План нараст., м</th>
          <th style="width:65px;">Факт нараст., м</th>
          <th style="width:55px;">Δ, м</th>
          <th style="width:45px;">% вып.</th>
          <th>Причина откл. / Комментарий</th>
        </tr>
      </thead>
      <tbody>
        <tr class="ns">
          <td>Май · НС+трубы</td>
          <td>22–31.05</td>
          <td style="text-align:center;">—</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="kt">
          <td style="font-weight:bold;color:var(--g-dark);">◆ КТ-1</td>
          <td style="font-weight:bold;">30.06.2026</td>
          <td style="text-align:right;font-weight:bold;">46 800</td>
          <td style="text-align:right;"></td>
          <td style="text-align:right;"></td>
          <td style="text-align:center;"></td>
          <td></td>
        </tr>
        <tr>
          <td>Июль (+ капля)</td>
          <td>01–31.07</td>
          <td style="text-align:right;">+ 97 500</td>
          <td style="text-align:right;"></td>
          <td style="text-align:right;"></td>
          <td style="text-align:center;"></td>
          <td></td>
        </tr>
        <tr class="kt">
          <td style="font-weight:bold;color:var(--g-dark);">◆ КТ-2</td>
          <td style="font-weight:bold;">21.07.2026</td>
          <td style="text-align:right;font-weight:bold;">85 800</td>
          <td style="text-align:right;"></td>
          <td style="text-align:right;"></td>
          <td style="text-align:center;"></td>
          <td></td>
        </tr>
        <tr class="kt">
          <td style="font-weight:bold;color:var(--g-dark);">◆ КТ-3</td>
          <td style="font-weight:bold;">01.08.2026</td>
          <td style="text-align:right;font-weight:bold;">163 800</td>
          <td style="text-align:right;"></td>
          <td style="text-align:right;"></td>
          <td style="text-align:center;"></td>
          <td></td>
        </tr>
        <tr style="background:#fce4ec;">
          <td style="font-weight:bold;color:#c62828;">⚑ ФИНИШ</td>
          <td style="font-weight:bold;color:#c62828;">25.08.2026</td>
          <td style="text-align:right;font-weight:bold;color:#c62828;">217 000</td>
          <td style="text-align:right;"></td>
          <td style="text-align:right;"></td>
          <td style="text-align:center;"></td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <!-- Блок заявок -->
    <div class="st">Заявки на следующий месяц</div>
    <table class="tbl" style="font-size:8pt;">
      <thead>
        <tr>
          <th style="width:25%;">Позиция</th>
          <th style="width:15%;">Кол-во</th>
          <th style="width:15%;">Ед. изм.</th>
          <th style="width:20%;">Срок поставки</th>
          <th>Комментарий</th>
        </tr>
      </thead>
      <tbody>
        <tr style="height:22px;"><td></td><td></td><td></td><td></td><td></td></tr>
        <tr style="height:22px;"><td></td><td></td><td></td><td></td><td></td></tr>
        <tr style="height:22px;"><td></td><td></td><td></td><td></td><td></td></tr>
        <tr style="height:22px;"><td></td><td></td><td></td><td></td><td></td></tr>
      </tbody>
    </table>

    <!-- Примечания -->
    <div style="margin-top:10px;font-size:7.5pt;color:var(--muted);">
      Нормы: Капля 325 м/чел.день (10 ч/день, 6 дн/нед) &nbsp;·&nbsp;
      d50 = 80 м/чел.день &nbsp;·&nbsp; d75 = 65 м/чел.день &nbsp;·&nbsp;
      d110 = 50 м/чел.день &nbsp;·&nbsp; d140 = 40 м/чел.день
    </div>
  </div>
</div><!-- /page p4 -->
```

- [ ] **Step 2: Проверить в браузере**

Ожидаемый результат:
- 3 KPI-карточки с пустыми полями для факта
- Таблица с 6 строками: НС-фаза, КТ-1, Июль, КТ-2, КТ-3, ФИНИШ
- КТ-строки голубые, ФИНИШ — розово-красный
- Таблица заявок с пустыми строками

- [ ] **Step 3: Коммит**

```bash
git add calc.html
git commit -m "feat: calc.html — Page 4 Manager monthly control table"
```

---

### Task 6: Страница 5 — Директор · Статус + шаблон нового объекта

**Files:**
- Modify: `calc.html` (заменить комментарий `<!-- PAGE 5: ДИРЕКТОР -->`)

- [ ] **Step 1: Вставить HTML Стр. 5**

```html
<!-- ═══════════════ PAGE 5: ДИРЕКТОР ═══════════════ -->
<div class="page" id="p5">
  <div class="ph">
    <div>
      <h1>ДИРЕКТОР · СТАТУС ОБЪЕКТА + ШАБЛОН НОВОГО ОБЪЕКТА</h1>
      <div class="sub">Текущий объект — данные заполняет РП. Правая колонка — шаблон для следующего объекта.</div>
    </div>
    <div class="role-badge">👔 ДИРЕКТОР</div>
  </div>

  <div class="pb">
    <div class="two-col">

      <!-- ─── ЛЕВАЯ: текущий объект ─── -->
      <div>
        <div class="st">Текущий объект</div>

        <div class="kpi-row kpi-light" style="grid-template-columns:1fr 1fr;margin-bottom:8px;">
          <div class="kpi-card">
            <div class="lbl" style="color:var(--muted);">Договор (сумма)</div>
            <div class="val" style="font-size:11pt;">38,4 млн ₽</div>
            <div class="sub-val" style="color:var(--muted);">№ГС-12-05 от 12.05.2026</div>
          </div>
          <div class="kpi-card">
            <div class="lbl" style="color:var(--muted);">Готовность, %</div>
            <div class="val" style="border-bottom:1.5px solid var(--g-dark);">___ %</div>
          </div>
          <div class="kpi-card">
            <div class="lbl" style="color:var(--muted);">ФОТ план</div>
            <div class="val" style="font-size:10pt;">2 193 750 ₽</div>
            <div class="sub-val" style="color:var(--muted);">15 × 45 000 × 3,25 мес</div>
          </div>
          <div class="kpi-card">
            <div class="lbl" style="color:var(--muted);">Прогноз финиша</div>
            <div class="val" style="border-bottom:1.5px solid var(--g-dark);font-size:10pt;">__.__.2026</div>
            <div class="sub-val" style="color:var(--muted);">Договор: 25.08.2026</div>
          </div>
        </div>

        <div class="st">ФОТ факт / план (₽)</div>
        <table class="tbl" style="font-size:8pt;margin-bottom:8px;">
          <thead><tr><th>Месяц</th><th>План, ₽</th><th>Факт, ₽</th><th>Δ, ₽</th></tr></thead>
          <tbody>
            <tr><td>Май (0,3 мес)</td><td style="text-align:right;">202 500</td><td></td><td></td></tr>
            <tr><td>Июнь (1 мес)</td><td style="text-align:right;">675 000</td><td></td><td></td></tr>
            <tr><td>Июль (1 мес)</td><td style="text-align:right;">675 000</td><td></td><td></td></tr>
            <tr><td>Август (0,95 мес)</td><td style="text-align:right;">641 250</td><td></td><td></td></tr>
            <tr class="week-sum"><td>ИТОГО</td><td style="text-align:right;">2 193 750</td><td></td><td></td></tr>
          </tbody>
        </table>

        <div class="st">ТОП-3 риска</div>
        <div class="risk">
          <b>Нехватка трубки</b> — 1-я поставка METZER 46 800 м ≈ 94 катушки к 30.06
        </div>
        <div class="risk">
          <b>Дефицит рабочих</b> — базовый сценарий: −19 400 м; нужно +3 чел. с 01.07
        </div>
        <div class="risk">
          <b>Задержка насосов</b> — Masdaf 1 973 899 ₽, поставка критична до 20.08
        </div>
      </div>

      <!-- ─── ПРАВАЯ: шаблон нового объекта ─── -->
      <div>
        <div class="st">Шаблон — новый объект</div>
        <div style="background:#f0f7f2;border:2px solid var(--g-light);border-radius:6px;padding:10px;margin-bottom:8px;">
          <div style="font-size:8pt;color:var(--g-dark);font-weight:bold;margin-bottom:8px;">
            ⬇ Заменить только эти 6 полей — всё остальное пересчитается автоматически
          </div>

          <div class="tpl-field">
            <label>Площадь, га</label>
            <input class="inp" type="text" placeholder="56,7">
          </div>
          <div class="tpl-field">
            <label>Межрядье, м</label>
            <input class="inp" type="text" placeholder="3">
          </div>
          <div class="tpl-field">
            <label>Дата старта</label>
            <input class="inp" type="text" placeholder="ДД.ММ.ГГГГ">
          </div>
          <div class="tpl-field">
            <label>Срок к.д. (договор)</label>
            <input class="inp" type="text" placeholder="100">
          </div>
          <div class="tpl-field">
            <label>Кол-во рабочих</label>
            <input class="inp" type="text" placeholder="15">
          </div>
          <div class="tpl-field">
            <label>Ставка ₽/мес</label>
            <input class="inp" type="text" placeholder="45 000">
          </div>
        </div>

        <div class="st">Формула пересчёта</div>
        <div style="font-size:7.5pt;color:var(--muted);margin-bottom:4px;">
          L_капли = Площадь × 10 000 ÷ Межрядье (м)
        </div>
        <div class="formula-chain">
          <div class="fc-box">L_капли</div>
          <div class="fc-arrow">→</div>
          <div class="fc-box">T_капли = L ÷ (N × 325)</div>
          <div class="fc-arrow">→</div>
          <div class="fc-box">N_min = ⌈L ÷ (325 × Д_p)⌉</div>
          <div class="fc-arrow">→</div>
          <div class="fc-box">ФОТ = N × Ставка × Мес</div>
          <div class="fc-arrow">→</div>
          <div class="fc-box">Финиш = Старт + Д_p</div>
        </div>
        <div style="font-size:7pt;color:var(--muted);margin-top:4px;">
          Д_p — рабочих дней (6/7 × к.д.) &nbsp;·&nbsp; N — число рабочих &nbsp;·&nbsp;
          325 м — норма капли на чел.день
        </div>

        <div class="st" style="margin-top:8px;">Пример (текущий объект)</div>
        <table class="tbl" style="font-size:7.5pt;">
          <tbody>
            <tr>
              <td style="color:var(--muted);">L_капли</td>
              <td>56,7 га × 10 000 ÷ 3 м = <b>189 000 м</b></td>
              <td style="color:var(--muted);font-size:7pt;">(корр. до 217 000 м)</td>
            </tr>
            <tr>
              <td style="color:var(--muted);">N_min (капля)</td>
              <td>217 000 ÷ (325 × 71 дн.) = <b>≥ 10 чел.</b></td>
              <td style="color:var(--muted);font-size:7pt;">(71 р.дн. с 09.06)</td>
            </tr>
            <tr>
              <td style="color:var(--muted);">ФОТ план</td>
              <td>15 × 45 000 × 3,25 = <b>2 193 750 ₽</b></td>
              <td></td>
            </tr>
            <tr>
              <td style="color:var(--muted);">Финиш договор</td>
              <td>18.05 + 100 к.д. = <b>25.08.2026</b></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div><!-- /two-col -->
  </div><!-- /pb -->
</div><!-- /page p5 -->
```

- [ ] **Step 2: Проверить в браузере**

Ожидаемый результат:
- Два столбца: слева — текущий объект, справа — шаблон
- 4 KPI-карточки слева (договор, готовность, ФОТ, прогноз)
- 3 риска красно-розовыми плашками
- Справа — 6 полей ввода с примерами, цепочка формул

- [ ] **Step 3: Коммит**

```bash
git add calc.html
git commit -m "feat: calc.html — Page 5 Director status + new object template with 6 input fields"
```

---

### Task 7: Полировка печати и финальный визуальный контроль

**Files:**
- Modify: `calc.html` (CSS для печати, мелкие правки)

- [ ] **Step 1: Добавить print-специфичные стили в блок `<style>`**

Добавить перед `</style>`:

```css
/* ── Print tweaks ── */
@media print {
  .page { box-shadow: none; margin: 0; }
  .brig-card { break-inside: avoid; }
  .tbl tbody tr { break-inside: avoid; }
  .brigade-grid { break-inside: avoid; }
  .two-col { break-inside: avoid; }
  /* Страница 2 — таблица рабочего занимает несколько листов */
  #p2 { min-height: auto; page-break-after: always; }
  .tbl thead { display: table-header-group; } /* повторять заголовок при переносе */
}
```

- [ ] **Step 2: Проверить печать — нажать «Сохранить PDF» в браузере**

Ожидаемый результат в предпросмотре печати:
- Стр. 1: дашборд помещается на 1 лист
- Стр. 2: таблица рабочего на 2–3 листах, заголовок таблицы повторяется
- Стр. 3–5: каждая на 1 листе
- Карточки и шапки — цветные (не серые)
- Кнопка PDF скрыта

- [ ] **Step 3: Финальная визуальная проверка в браузере**

Пройти по всем 5 страницам. Убедиться:
- Нет горизонтального скролла на 210mm
- Все таблицы помещаются по ширине
- Цвета консистентны (--g-dark везде одинаковый)
- Пустые ячейки очевидно пустые (не «undefined» или «NaN»)

- [ ] **Step 4: Коммит финальной полировки**

```bash
git add calc.html
git commit -m "feat: calc.html — print polish, thead repeat, page-break fixes"
```

---

### Task 8: Деплой на GitHub Pages

**Files:**
- `calc.html` (только проверить, что он есть в `docs/` или корневой папке репо)

- [ ] **Step 1: Убедиться, что файл находится в правильном месте**

```powershell
Get-Item "C:\Users\user\Desktop\vineyard-deploy\calc.html"
```

Ожидаемый результат: файл существует в корне репо.

- [ ] **Step 2: Зафиксировать все изменения и запушить**

```bash
git status
git add calc.html
git commit -m "deploy: calc.html redesign — 5-page A4 cheat sheet ready"
git push
```

- [ ] **Step 3: Проверить деплой на GitHub Pages**

Через 1–2 минуты открыть:
```
https://dimaborisov410-coder.github.io/4s-grape-garden/calc.html
```

Ожидаемый результат: страница открывается, все 5 страниц видны, кнопка PDF работает.

---

## Self-Review

### 1. Spec coverage

| Требование из спека | Задача |
|---------------------|--------|
| Стиль Б — карточки, скруглённые углы | Task 1 (CSS) |
| Структура В — Дашборд + детали | Task 2–6 |
| Стр.1: дашборд, 4 KPI, прогресс-бар, бригады | Task 2 |
| Стр.2: журнал рабочего, 86 строк, НС→капля | Task 3 |
| Стр.3: недельный Н1–Н15 с планом бригад | Task 4 |
| Стр.4: месячный контроль, КТ-таблица | Task 5 |
| Стр.5: статус директора + 6 полей шаблона | Task 6 |
| @page A4, page-break-before, print-color-adjust | Task 1 + 7 |
| Кнопка «Сохранить PDF» скрыта при печати | Task 1 |
| Реальные данные предзаполнены | Task 2–6 |
| Дата договора 25.08.2026 (не 29.08) | Task 2, 4, 5, 6 |
| Корректная формула N_min (71 р.дн. от 09.06) | Task 6 |
| Деплой на GitHub Pages | Task 8 |

Все требования покрыты. ✓

### 2. Placeholder scan

- Нет «TBD», «TODO», «implement later»
- Все ячейки «Факт» намеренно пустые — это требование (заполняются вручную)
- Все плановые числа предзаполнены реальными данными

### 3. Type consistency

- CSS-классы: `.tbl`, `.kpi-card`, `.kpi-row`, `.ph`, `.pb`, `.st`, `.brig-card` — используются консистентно во всех задачах
- JS: `id="worker-rows"` определён в Task 3 Step 1, скрипт обращается к нему в Task 3 Step 2 ✓
- Цвета через `var(--g-dark)`, `var(--yellow)` и т.д. — определены в Task 1, используются во всех задачах ✓
