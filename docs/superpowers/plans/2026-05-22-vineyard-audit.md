# 4S Grape Garden — Полный аудит и улучшение проекта

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Устранить все критические баги отображения, исправить навигацию, обновить устаревшие данные и привести Оперативку к тёмной теме — без потери ни одной строки данных.

**Architecture:** 8 самодостаточных HTML-файлов без внешних зависимостей. Все правки через Edit-инструмент с точными old_string/new_string. Деплой через `git push` в репозиторий dimaborisov410-coder/4s-grape-garden на GitHub Pages. Рабочая папка: `C:\Users\user\Desktop\vineyard-deploy\`.

**Tech Stack:** HTML5, inline CSS, inline JS, localStorage, Git, GitHub Pages

---

## Карта файлов

| Файл | Задачи |
|---|---|
| `index.html` | 1–7 (баги, навигация, данные, стили) |
| `field-map.html` | 8 (статусы материалов) |
| `daily.html` | 9 (KPI дня, материалы) |
| `montage.html` | 10 (персонал, транспорт) |
| `schedule.html` | 11 (контрольные точки) |
| `calc.html` | 12 (числа, нормы) |
| `routine.html` | 12 (нормы выработки) |

---

## Задача 1: Исправить плавающие карточки (КРИТИЧНО)

**Файл:** `index.html` · строки ~2958–3028

**Проблема:** Карточки «Персонал ГС на объекте» и «Транспорт объекта» расположены после закрывающего `</div>` страницы `#page-crew` (строка 2960). CSS `.page{display:none}` на них не распространяется — они видны **на всех вкладках одновременно**.

**Структура до правки:**
```
</div>           ← строка 2960: конец #page-crew
</div>           ← строка 2959
</div>           ← строка 2958

<!-- Персонал --> ← ПЛАВАЕТ вне страниц
<div class="card"...>...</div>

<!-- Транспорт --> ← ПЛАВАЕТ вне страниц
<div class="card"...>...</div>

<div class="page" id="page-qa"> ← строка 3029
```

- [ ] **Шаг 1.1: Вырезать плавающие карточки из текущего места**

В `index.html` найти и заменить:

```
old_string:
    </div>
  </div>
</div>

<!-- ══════ ВОПРОСЫ АУДИТА ══════ -->
<!-- Персонал ГС на объекте -->

new_string:
    </div>
  </div>

  <!-- Персонал ГС на объекте -->
```

Это «присоединяет» комментарий и карточки к странице `#page-crew` путём удаления закрывающего `</div>` с переносом его в конец.

- [ ] **Шаг 1.2: Закрыть page-crew после карточек**

Найти конец второй карточки (транспорт) перед открытием page-qa и заменить:

```
old_string:
  </div>
  </div>

<div class="page" id="page-qa">

new_string:
  </div>
  </div>

</div>

<div class="page" id="page-qa">
```

Это ставит закрывающий `</div>` страницы `#page-crew` в правильное место — после обеих карточек.

- [ ] **Шаг 1.3: Проверить в браузере**

Открыть `index.html` локально (через `file://` или `python -m http.server 8000`). Переключиться между вкладками: «Главная», «Финансы», «Монтаж», «Вопросы». Убедиться, что карточки «Персонал ГС» и «Транспорт» **не видны** ни на одной из этих вкладок. Перейти на «Бригада» — убедиться, что они **видны** там.

- [ ] **Шаг 1.4: Коммит**

```bash
git add index.html
git commit -m "fix: переместить карточки персонала и транспорта внутрь page-crew"
```

---

## Задача 2: Исправить навигацию (sidebar + bottom bar)

**Файл:** `index.html`

**Проблемы:**
- `page-ops` (Оперативка) отсутствует в sidebar — недоступна на десктопе
- `page-smeta` и `page-docs` отсутствуют в bottom bar — недоступны на мобильном
- Кнопка «Опер.» в bottom bar имеет `style="color:#f59f00"` — несогласованность

- [ ] **Шаг 2.1: Добавить Оперативку в sidebar и обновить qa-badge**

Найти:
```html
    <div class="nav-item" data-roles="all" onclick="showPage('qa',this)"><span class="ni">❓</span>Вопросы<span class="nav-badge" id="qa-badge">13</span></div>
  </nav>
```

Заменить на:
```html
    <div class="nav-item" data-roles="all" onclick="showPage('qa',this)"><span class="ni">❓</span>Вопросы<span class="nav-badge" id="qa-badge">7</span></div>
    <div class="nav-item" data-roles="all" onclick="showPage('ops',this)"><span class="ni">⚡</span>Оперативка</div>
  </nav>
```

*(Статическое значение badge исправлено с 13 → 7: JS перезапишет его при загрузке, но начальное значение должно быть верным.)*

- [ ] **Шаг 2.2: Добавить Смету и Документы в bottom bar, убрать лишний inline-цвет**

Найти:
```html
    <button class="bot-tab" onclick="showPage('ops',this)" style="color:#f59f00">
      <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      Опер.
    </button>
```

Заменить на:
```html
    <button class="bot-tab" onclick="showPage('smeta',this)">
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      Смета
    </button>
    <button class="bot-tab" onclick="showPage('docs',this)">
      <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
      Документы
    </button>
    <button class="bot-tab" onclick="showPage('ops',this)">
      <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      Опер.
    </button>
```

- [ ] **Шаг 2.3: Проверить в браузере**

- На десктопе: в sidebar появился пункт «⚡ Оперативка» — кликнуть, открывается страница Оперативки
- На десктопе: кликнуть «Вопросы» — badge показывает 7 (или значение из JS)
- Сузить окно < 700px: внизу появляются «Смета» и «Документы» — обе открываются
- Кнопка «Опер.» в bottom bar: при активации подсвечивается золотым (`.bot-tab.active`), без лишней заливки в пассивном состоянии

- [ ] **Шаг 2.4: Коммит**

```bash
git add index.html
git commit -m "fix: навигация — Оперативка в sidebar, Смета/Документы в bottom bar"
```

---

## Задача 3: Добавить CSS-классы для зелёных статусов

**Файл:** `index.html` · блок `<style>` (~строка 138)

Сейчас для статус-пилюль есть только `.sp-red` и `.sp-orange`. Нужен `.sp-green` для оплаченных счетов. Аналогично для `fin-sum`.

- [ ] **Шаг 3.1: Добавить CSS-классы**

Найти:
```css
.sp-orange{background:rgba(180,100,0,.3);color:#ffcc44;border:1px solid rgba(180,100,0,.4)}
```

Заменить на:
```css
.sp-orange{background:rgba(180,100,0,.3);color:#ffcc44;border:1px solid rgba(180,100,0,.4)}
.sp-green{background:rgba(46,125,50,.3);color:#81c784;border:1px solid rgba(46,125,50,.5)}
.fin-sum.green{color:#81c784}
```

- [ ] **Шаг 3.2: Проверить**

Нет визуальной проверки — классы используются в задаче 4.

---

## Задача 4: Обновить данные на вкладке «Главная»

**Файл:** `index.html`

### 4а — Блок «Срочные задачи»

- [ ] **Шаг 4.1: Обновить список и счётчик**

Найти весь блок cb срочных задач:
```html
      <div class="ch"><div class="ch-bar red"></div><div class="ch-title red">Срочные задачи</div><div class="ch-badge">7 открыто</div></div>
      <div class="cb">
        <div class="ar"><div class="adot orange"></div><div class="at"><b>Первый платёж по договору</b> — 7 000 000 ₽ до <b>18.05.2026</b> · АО «Янтарный» → ГС (уточнённый график)</div></div>
        <div class="ar"><div class="adot red"></div><div class="at"><b>Счёт №125 — ПРОСРОЧЕН</b> — 58 900 ₽ · ИП Парамонов · срок 15.05.2026</div></div>
        <div class="ar"><div class="adot red"></div><div class="at"><b>Согласовать объём</b> первой очереди — критично для старта монтажа</div></div>
        <div class="ar"><div class="adot orange"></div><div class="at"><b>Счёт ЦБ-242</b> — уточнить актуальность · 632 200 ₽ · ПГФ 3050</div></div>
        <div class="ar"><div class="adot orange"></div><div class="at"><b>Съёмка рельефа</b> от Максима (пункты ГРО) — нужна для геодезиста</div></div>
        <div class="ar"><div class="adot red"></div><div class="at">🚨 <b>Нехватка персонала</b> — нужно 60 чел. к 30.06 (есть только 15), + 5 ед. техники</div></div>
      </div>
```

Заменить на:
```html
      <div class="ch"><div class="ch-bar red"></div><div class="ch-title red">Срочные задачи</div><div class="ch-badge">8 открыто</div></div>
      <div class="cb">
        <div class="ar"><div class="adot red"></div><div class="at">🚨 <b>Насосы Masdaf</b> — заказ не размещён · доставка 10–14 дн. · нужны к 26.05</div></div>
        <div class="ar"><div class="adot red"></div><div class="at"><b>Ёмкости ПЭ × 8 (КОИ52)</b> — счёт 671 040 ₽ не оплачен · <b>просрочен 15.05</b></div></div>
        <div class="ar"><div class="adot red"></div><div class="at"><b>ТУ на электроснабжение</b> 45–56 кВт — не получены · блокируют монтаж НС</div></div>
        <div class="ar"><div class="adot red"></div><div class="at">🚨 <b>Нехватка персонала</b> — нужно 60 чел. к 30.06 (есть только 15), + 5 ед. техники</div></div>
        <div class="ar"><div class="adot red"></div><div class="at"><b>Согласовать объём</b> первой очереди — критично для старта монтажа</div></div>
        <div class="ar"><div class="adot orange"></div><div class="at"><b>Счёт ЦБ-242</b> — уточнить актуальность · 632 200 ₽ · ПГФ 3050</div></div>
        <div class="ar"><div class="adot orange"></div><div class="at"><b>Съёмка рельефа</b> от Максима (пункты ГРО) — нужна для геодезиста</div></div>
        <div class="ar"><div class="adot orange"></div><div class="at">⏳ <b>Транш 2</b> — 5 000 000 ₽ ожидается <b>25.05.2026</b> · АО «Янтарный» → ГС</div></div>
      </div>
```

### 4б — Блок «Финансы» (мини-список на Главной)

- [ ] **Шаг 4.2: Обновить статус Транша 1**

Найти:
```html
        <div class="fin-item">
          <div><div class="fin-name">Договор · Платёж 1</div><div class="fin-sub">АО «Янтарный» → ГС · уточн. срок 18.05.2026</div></div>
          <div style="text-align:right"><div class="fin-sum orange">7 000 000 ₽</div><div class="status-pill sp-orange">ДО 18.05</div></div>
        </div>
```

Заменить на:
```html
        <div class="fin-item">
          <div><div class="fin-name">Договор · Платёж 1</div><div class="fin-sub">АО «Янтарный» → ГС · получен 18.05.2026 ✅</div></div>
          <div style="text-align:right"><div class="fin-sum green">7 000 000 ₽</div><div class="status-pill sp-green">✅ ПОЛУЧЕН</div></div>
        </div>
```

- [ ] **Шаг 4.3: Обновить статус Счёта №125**

Найти:
```html
        <div class="fin-item">
          <div><div class="fin-name">Счёт №125 · Транспорт</div><div class="fin-sub">ИП Парамонов · Lada Granta · 31 день</div></div>
          <div style="text-align:right"><div class="fin-sum red">58 900 ₽</div><div class="status-pill sp-red">ПРОСРОЧЕН!</div></div>
        </div>
```

Заменить на:
```html
        <div class="fin-item">
          <div><div class="fin-name">Счёт №125 · Транспорт</div><div class="fin-sub">ИП Парамонов · Lada Granta · 31 день · оплачен 18.05.2026</div></div>
          <div style="text-align:right"><div class="fin-sum green">58 900 ₽</div><div class="status-pill sp-green">✅ ОПЛАЧЕН</div></div>
        </div>
```

- [ ] **Шаг 4.4: Обновить статус Счёта №86**

Найти:
```html
        <div class="fin-item">
          <div><div class="fin-name">Счёт №86 · Биотуалет</div><div class="fin-sub">ИП Сазыкин · 1 кабина · 4 обслуживания · срок 18.05</div></div>
          <div style="text-align:right"><div class="fin-sum orange">14 000 ₽</div><div class="status-pill sp-orange">ДО 18.05</div></div>
        </div>
```

Заменить на:
```html
        <div class="fin-item">
          <div><div class="fin-name">Счёт №86 · Биотуалет</div><div class="fin-sub">ИП Сазыкин · 1 кабина · 4 обслуживания · оплачен 18.05.2026</div></div>
          <div style="text-align:right"><div class="fin-sum green">14 000 ₽</div><div class="status-pill sp-green">✅ ОПЛАЧЕН</div></div>
        </div>
```

- [ ] **Шаг 4.5: Обновить статус Счёта №-545**

Найти:
```html
        <div class="fin-item">
          <div><div class="fin-name">Счёт №-545 · Продукты и быт</div><div class="fin-sub">Расходы для бытовки</div></div>
          <div style="text-align:right"><div class="fin-sum orange">15 054 ₽</div><div class="status-pill sp-orange">К ОПЛАТЕ</div></div>
        </div>
```

Заменить на:
```html
        <div class="fin-item">
          <div><div class="fin-name">Счёт №-545 · Продукты и быт</div><div class="fin-sub">Озон · бытовка · оплачен 18.05.2026</div></div>
          <div style="text-align:right"><div class="fin-sum green">15 054 ₽</div><div class="status-pill sp-green">✅ ОПЛАЧЕН</div></div>
        </div>
```

- [ ] **Шаг 4.6: Обновить Счёт №290 СТИЛЕКС — частичная оплата**

Найти:
```html
        <div class="fin-item">
          <div><div class="fin-name">Счёт №290 · Трубы ПЭ + фитинги</div><div class="fin-sub">ООО СТИЛЕКС · 23 позиции · срок 18.05</div></div>
          <div style="text-align:right"><div class="fin-sum orange">2 359 810 ₽</div><div class="status-pill sp-orange">ДО 18.05</div></div>
        </div>
```

Заменить на:
```html
        <div class="fin-item">
          <div><div class="fin-name">Счёт №290 · Трубы ПЭ + фитинги</div><div class="fin-sub">ООО СТИЛЕКС · 23 позиции · оплачено 700 000 ₽ из 2 359 810 ₽</div></div>
          <div style="text-align:right"><div class="fin-sum orange">1 659 810 ₽</div><div class="status-pill sp-orange">⚠️ ЧАСТИЧНО</div></div>
        </div>
```

- [ ] **Шаг 4.7: Обновить итоговую сумму и счётчик счетов**

Расчёт нового итога:
- Исходный: 4 656 299 ₽ (10 счетов)
- Убрать оплаченные: −58 900 (№125) − 14 000 (№86) − 15 054 (№-545) = −87 954
- Уточнить №290: был 2 359 810, теперь 1 659 810 → разница −700 000
- Новый итог: 4 656 299 − 87 954 − 700 000 = **3 868 345 ₽**
- Счётчик: 10 − 3 оплаченных = **7 счетов** (транш 1 тоже убирается из подсчёта «к оплате» — он получен)

Найти:
```html
          <span style="color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.5px">Итого к оплате (10 счетов)</span>
          <span style="color:var(--danger);font-size:16px;font-weight:900">4 656 299 ₽</span>
```

Заменить на:
```html
          <span style="color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.5px">Итого к оплате (7 счетов)</span>
          <span style="color:var(--danger);font-size:16px;font-weight:900">3 868 345 ₽</span>
```

- [ ] **Шаг 4.8: Обновить Hero KPI «к оплате»**

Найти:
```html
      <div class="hkpi hkpi-warn"><div class="hkpi-num">4,66М</div><div class="hkpi-lbl">₽ к оплате</div></div>
```

Заменить на:
```html
      <div class="hkpi hkpi-warn"><div class="hkpi-num">3,87М</div><div class="hkpi-lbl">₽ к оплате</div></div>
```

- [ ] **Шаг 4.9: Проверить в браузере**

Открыть вкладку «Главная»:
- Блок «Срочные задачи»: 8 пунктов, первые 4 красных — Masdaf, КОИ52, ТУ, персонал; нет упоминания транша 1 и счёта №125
- Блок «Финансы»: Транш 1 и три счёта зелёные, №290 показывает «⚠️ ЧАСТИЧНО», итого 3 868 345 ₽
- Hero: показывает «3,87М ₽ к оплате»

- [ ] **Шаг 4.10: Коммит**

```bash
git add index.html
git commit -m "fix: обновить данные Главной — статусы платежей, срочные задачи, KPI"
```

---

## Задача 5: Обновить транспорт в «Бригаде»

**Файл:** `index.html`

Сейчас в таблице транспорта 4 строки + сноска под таблицей про Lada Granta. Нужно: добавить Granta как 5-ю строку, обновить badge, убрать сноску.

- [ ] **Шаг 5.1: Добавить Lada Granta, обновить badge, убрать сноску**

Найти:
```html
    <div class="ch"><div class="ch-bar" style="background:#1565c0"></div><div class="ch-title">Транспорт объекта</div><div class="ch-badge" style="background:rgba(21,101,192,.15);color:#90caf9">4 авт.</div></div>
    <div class="cb">
      <div class="tbl-wrap">
        <table class="t" style="font-size:12px">
          <thead><tr><th>#</th><th>Марка / Модель</th><th>Гос. номер</th><th>Принадлежность</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Lada Largus</td><td><b>У643ТК 797</b></td><td>ГС</td></tr>
            <tr><td>2</td><td>ГАЗель</td><td><b>Т410ВУ977</b></td><td>ГС</td></tr>
            <tr><td>3</td><td>Toyota RAV4</td><td><b>В325ЕС 92</b></td><td>Леха</td></tr>
            <tr><td>4</td><td>Volkswagen Tiguan</td><td><b>А289ХР 92</b></td><td>Шпилёв</td></tr>
          </tbody>
        </table>
      </div>
      <div style="margin-top:6px;font-size:11px;color:rgba(255,255,255,.35)">+ Lada Granta ИП Парамонов П.С. · аренда · Счёт №125</div>
    </div>
```

Заменить на:
```html
    <div class="ch"><div class="ch-bar" style="background:#1565c0"></div><div class="ch-title">Транспорт объекта</div><div class="ch-badge" style="background:rgba(21,101,192,.15);color:#90caf9">5 авт.</div></div>
    <div class="cb">
      <div class="tbl-wrap">
        <table class="t" style="font-size:12px">
          <thead><tr><th>#</th><th>Марка / Модель</th><th>Гос. номер</th><th>Принадлежность</th><th>Статус</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Lada Largus</td><td><b>У643ТК 797</b></td><td>ГС</td><td>собственный</td></tr>
            <tr><td>2</td><td>ГАЗель</td><td><b>Т410ВУ 977</b></td><td>ГС</td><td>собственный</td></tr>
            <tr><td>3</td><td>Toyota RAV4</td><td><b>В325ЕС 92</b></td><td>Лёха (рук.)</td><td>собственный</td></tr>
            <tr><td>4</td><td>Volkswagen Tiguan</td><td><b>А289ХР 92</b></td><td>Шпилёв А.А.</td><td>собственный</td></tr>
            <tr style="background:rgba(201,168,76,.06)"><td>5</td><td>Lada Granta</td><td><b>—</b></td><td>ИП Парамонов · аренда</td><td><span class="status-pill sp-green">✅ сч.№125</span></td></tr>
          </tbody>
        </table>
      </div>
      <div style="margin-top:6px;font-size:11px;color:rgba(255,255,255,.35)">Lada Granta — трансфер монтажников СУЛАНЖ: Ароматное ↔ Пожарское · счёт №125 оплачен 18.05</div>
    </div>
```

- [ ] **Шаг 5.2: Проверить**

Открыть «Бригада» → блок «Транспорт объекта»: 5 строк, badge «5 авт.», Granta со статусом ✅.

- [ ] **Шаг 5.3: Коммит**

```bash
git add index.html
git commit -m "fix: добавить Lada Granta в таблицу транспорта, обновить badge"
```

---

## Задача 6: Привести Оперативку к тёмной теме

**Файл:** `index.html` · страница `#page-ops`

Три таблицы и один алерт используют стили белого фона — нужно заменить на тёмные эквиваленты.

- [ ] **Шаг 6.1: Динамическая дата в заголовке**

Найти:
```html
<div class="page" id="page-ops">
  <div class="page-title">Оперативка · 22.05.2026</div>
```

Заменить на:
```html
<div class="page" id="page-ops">
  <div class="page-title">Оперативка · <span id="ops-date">22.05.2026</span></div>
```

Затем в блоке `<script>` найти строку:
```js
document.addEventListener('DOMContentLoaded',initTubeCalc);
```

Заменить на:
```js
document.addEventListener('DOMContentLoaded',initTubeCalc);
document.addEventListener('DOMContentLoaded',function(){
  var el=document.getElementById('ops-date');
  if(el)el.textContent=new Date().toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'});
});
```

- [ ] **Шаг 6.2: Исправить стили таблицы «Горящие вопросы»**

Найти заголовок блока:
```html
  <div style="margin-bottom:4mm">
    <div style="font-size:10pt;font-weight:800;color:#e65100;margin-bottom:2mm">🔥 Горящие вопросы (Шпилёв А.А.)</div>
    <table style="width:100%;border-collapse:collapse;font-size:8.5pt">
      <thead><tr>
        <th style="background:#37474f;color:#fff;padding:4px 6px;text-align:left;width:4%">#</th>
        <th style="background:#37474f;color:#fff;padding:4px 6px;text-align:left;width:54%">Вопрос</th>
        <th style="background:#37474f;color:#fff;padding:4px 6px;text-align:left;width:20%">Статус</th>
        <th style="background:#37474f;color:#fff;padding:4px 6px;text-align:left;width:22%">Ответственный</th>
      </tr></thead>
```

Заменить на:
```html
  <div style="margin-bottom:14px">
    <div style="font-size:12px;font-weight:800;color:var(--warn);letter-spacing:.3px;text-transform:uppercase;margin-bottom:8px">🔥 Горящие вопросы · Шпилёв А.А.</div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr>
        <th style="background:rgba(255,255,255,.06);color:var(--text-dim);padding:6px 8px;text-align:left;width:4%;border-bottom:1px solid var(--gold-dim)">#</th>
        <th style="background:rgba(255,255,255,.06);color:var(--text-dim);padding:6px 8px;text-align:left;width:54%;border-bottom:1px solid var(--gold-dim)">Вопрос</th>
        <th style="background:rgba(255,255,255,.06);color:var(--text-dim);padding:6px 8px;text-align:left;width:20%;border-bottom:1px solid var(--gold-dim)">Статус</th>
        <th style="background:rgba(255,255,255,.06);color:var(--text-dim);padding:6px 8px;text-align:left;width:22%;border-bottom:1px solid var(--gold-dim)">Ответственный</th>
      </tr></thead>
```

- [ ] **Шаг 6.3: Исправить строки таблицы «Горящие вопросы»**

Найти и заменить все 4 строки tbody. Каждая строка меняется так:

Строка 1 (⏳):
```
old: <tr>
  <td style="padding:4px 6px;border-bottom:1px solid #eee">1</td>
  <td style="padding:4px 6px;border-bottom:1px solid #eee">Оплата обедов: ГС кормит Суланжевцев или Суланж сам?</td>
  <td style="padding:4px 6px;border-bottom:1px solid #eee"><span style="background:#fff8e1;color:#e65100;padding:2px 6px;border-radius:8px;font-size:7.5pt;font-weight:700">⏳ В процессе</span></td>
  <td style="padding:4px 6px;border-bottom:1px solid #eee">Дария ГС +7-978-767-23-36 · завтра ответ</td>
</tr>

new: <tr style="border-bottom:1px solid rgba(255,255,255,.07)">
  <td style="padding:6px 8px;color:var(--text-dim)">1</td>
  <td style="padding:6px 8px">Оплата обедов: ГС кормит Суланжевцев или Суланж сам?</td>
  <td style="padding:6px 8px"><span class="status-pill sp-orange">⏳ В процессе</span></td>
  <td style="padding:6px 8px;color:var(--text-dim)">Дария ГС +7-978-767-23-36</td>
</tr>
```

Строки 2, 3, 4 (❌):
```
old (повтор на каждой строке): border-bottom:1px solid #eee  и  background:#ffcdd2;color:#c62828;...font-size:7.5pt
new (повтор на каждой строке): border-bottom:1px solid rgba(255,255,255,.07)  и  class="status-pill sp-red"
```

Сделать Edit для каждой строки отдельно используя уникальный контекст строки.

- [ ] **Шаг 6.4: Исправить таблицу «Статус материалов»**

Заменить заголовок таблицы:
```
old: <div style="font-size:10pt;font-weight:800;color:#1b5e20;margin:4mm 0 2mm">📦 Статус ключевых материалов</div>
new: <div style="font-size:12px;font-weight:800;color:var(--gold);letter-spacing:.3px;text-transform:uppercase;margin:14px 0 8px">📦 Статус ключевых материалов</div>
```

Заменить заголовок таблицы (th строки):
```
old: <th style="background:#1b5e20;color:#fff;padding:4px 6px;text-align:left;width:28%">Материал</th>
new: <th style="background:rgba(27,94,32,.5);color:rgba(255,255,255,.7);padding:6px 8px;text-align:left;width:28%">Материал</th>
```
*(То же самое для остальных трёх th в той же строке)*

Заменить фоны строк:
```
old: style="background:#ffebee"  →  new: style="background:rgba(139,26,47,.12)"
old: style="background:#fff8e1"  →  new: style="background:rgba(180,100,0,.1)"
old: style="background:#e8f5e9"  →  new: style="background:rgba(46,125,50,.1)"
```

Заменить границы в каждой td:
```
old: border-bottom:1px solid #eee
new: border-bottom:1px solid rgba(255,255,255,.07)
```

Заменить цвета дат:
```
old: color:#c62828;font-weight:700
new: color:var(--danger);font-weight:700
```

- [ ] **Шаг 6.5: Исправить алерт «Дефицит людей»**

Найти:
```html
  <div style="background:#ffebee;border-left:4px solid #c62828;padding:3mm 5mm;margin-bottom:3mm;font-size:8.5pt">
```

Заменить на:
```html
  <div style="background:var(--danger-bg);border:1px solid var(--danger-border);border-left:4px solid var(--danger);padding:10px 14px;margin-bottom:12px;font-size:12px;border-radius:6px;color:var(--text)">
```

- [ ] **Шаг 6.6: Исправить таблицу «Транспорт» в Оперативке**

Заголовок таблицы (блок div):
```
old: <div style="font-size:10pt;font-weight:800;color:#1b5e20;margin:4mm 0 2mm">🚗 Транспорт</div>
new: <div style="font-size:12px;font-weight:800;color:var(--gold);letter-spacing:.3px;text-transform:uppercase;margin:14px 0 8px">🚗 Транспорт</div>
```

Заголовок таблицы (th):
```
old: <th style="background:#1b5e20;color:#fff;padding:4px 6px;text-align:left">
new: <th style="background:rgba(27,94,32,.5);color:rgba(255,255,255,.7);padding:6px 8px;text-align:left">
```

Строки tbody (td границы):
```
old: border-bottom:1px solid #eee
new: border-bottom:1px solid rgba(255,255,255,.07)
```

- [ ] **Шаг 6.7: Исправить заголовок блока «График оплат»**

```
old: <div style="font-size:10pt;font-weight:800;color:#1b5e20;margin:4mm 0 2mm">💰 График оплат (от заказчика)</div>
new: <div style="font-size:12px;font-weight:800;color:var(--gold);letter-spacing:.3px;text-transform:uppercase;margin:14px 0 8px">💰 График оплат</div>
```

Карточки транша 1/2/3 — они уже используют `border:1.5px solid #c8e6c9` и т.п. (светлые тона). Заменить:
```
old: style="border:1.5px solid #c8e6c9;border-radius:4px;padding:3mm;text-align:center"
new: style="border:1px solid rgba(46,125,50,.4);border-radius:8px;padding:10px;text-align:center;background:rgba(46,125,50,.08)"

old: style="border:1.5px solid #ffe0b2;border-radius:4px;padding:3mm;text-align:center"
new: style="border:1px solid rgba(255,170,0,.3);border-radius:8px;padding:10px;text-align:center;background:rgba(180,100,0,.08)"

old: style="border:1.5px solid #e0e0e0;border-radius:4px;padding:3mm;text-align:center"
new: style="border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px;text-align:center;background:rgba(255,255,255,.03)"
```

Цвета чисел внутри карточек:
```
old: style="font-size:18pt;font-weight:900;color:#1b5e20;...  →  new: color:#81c784
old: style="font-size:18pt;font-weight:900;color:#e65100;...  →  new: color:var(--warn)
old: style="font-size:18pt;font-weight:900;color:#555;...     →  new: color:var(--text-dim)
```

Бейджи статуса внутри карточек:
```
old: background:#c8e6c9;color:#1b5e20  →  new: background:rgba(46,125,50,.3);color:#81c784
old: background:#fff8e1;color:#e65100  →  new: background:rgba(180,100,0,.2);color:var(--warn)
old: background:#f5f5f5;color:#888     →  new: background:rgba(255,255,255,.06);color:var(--text-dim)
```

- [ ] **Шаг 6.8: Проверить в браузере**

Открыть вкладку «Оперативка»:
- Дата в заголовке динамическая (отображает сегодняшнюю дату)
- Таблицы «Горящие вопросы» и «Статус материалов» — нет белых/кремовых фонов, всё тёмное
- Алерт «Дефицит людей» — тёмный красный фон, вписывается в тему
- Таблица «Транспорт» — тёмные заголовки
- Карточки «График оплат» — тёмные фоны

- [ ] **Шаг 6.9: Коммит**

```bash
git add index.html
git commit -m "fix: Оперативка — тёмная тема, динамическая дата, унификация стилей"
```

---

## Задача 7: Финальная проверка index.html

**Файл:** `index.html`

- [ ] **Шаг 7.1: Проверить все 13 вкладок**

Открыть `index.html` в браузере. Кликнуть каждую вкладку в sidebar и убедиться:
- Главная, Блоки, Насаждения, Оборудование, Карта — открываются, нет лишнего контента
- Финансы, Задачи, Монтаж, Бригада — открываются, карточки персонала/транспорта только в Бригаде
- Смета, Документы, Вопросы, Оперативка — открываются без ошибок

- [ ] **Шаг 7.2: Проверить консоль браузера**

Открыть DevTools (F12) → Console. Убедиться: нет красных ошибок при переключении вкладок.

- [ ] **Шаг 7.3: Проверить карту**

Перейти на «Карта» → кликнуть любой блок → попап появляется и закрывается корректно.

- [ ] **Шаг 7.4: Проверить Бригаду (localStorage)**

Перейти на «Бригада» → добавить тестового рабочего → обновить страницу → рабочий сохранился.

---

## Задача 8: Проверить field-map.html

**Файл:** `field-map.html`

- [ ] **Шаг 8.1: Прочитать блок статусов материалов**

Прочитать `field-map.html` начиная со строки, содержащей `mat-bad` или `MATERIALS`. Найти все статусы материалов.

- [ ] **Шаг 8.2: Сверить со спеком**

Проверить соответствие данным из памяти (22.05.2026):
- ❌ Насосы Masdaf — не заказаны
- ❌ Ёмкости ПЭ × 8 — не оплачены
- ❌ ТУ на электроснабжение — не получены
- ⚠️ Капельная лента METZER — 50 000 м придут 29.05, нужно 217 000 м
- ⚠️ Крючки Irritec — 62 000 шт., нужно 217 000 шт.
- ✅ Трубы ПЭ СТИЛЕКС — оплачено 700 000 ₽
- ✅ Бытовки, биотуалет, Озон — оплачены

- [ ] **Шаг 8.3: Внести правки если нужно**

Если найдены несоответствия — исправить конкретные строки через Edit.

- [ ] **Шаг 8.4: Проверить попапы блоков**

Открыть `field-map.html` в браузере → кликнуть 3–4 блока → убедиться, что попап показывает верный сорт, площадь и смену.

- [ ] **Шаг 8.5: Коммит (если были правки)**

```bash
git add field-map.html
git commit -m "fix: field-map — обновить статусы материалов"
```

---

## Задача 9: Проверить daily.html

**Файл:** `daily.html`

- [ ] **Шаг 9.1: Прочитать KPI-блок и логику расчёта дня**

Найти JS-код с расчётом текущего дня. Базовая дата должна быть `22.05.2026`. Проверить: `dayNum = Math.floor((today - start) / 86400000) + 1`.

- [ ] **Шаг 9.2: Открыть в браузере и проверить KPI**

Открыть `daily.html` → KPI «Сегодня день №» должен показывать 1 (если открыто 22.05.2026) или N в зависимости от текущей даты. Проверить что не NaN и не отрицательное.

- [ ] **Шаг 9.3: Проверить блок MATERIALS**

Найти раздел MATERIALS в файле. Статусы должны совпадать с актуальными данными из задачи 8 (те же: METZER 50 000 м на 29.05, крючки 62 000 шт., Masdaf не заказан и т.д.).

- [ ] **Шаг 9.4: Внести правки если нужно**

Исправить через Edit.

- [ ] **Шаг 9.5: Коммит (если были правки)**

```bash
git add daily.html
git commit -m "fix: daily — обновить статусы материалов"
```

---

## Задача 10: Проверить montage.html

**Файл:** `montage.html`

- [ ] **Шаг 10.1: Прочитать раздел персонала**

Найти раздел «Персонал и транспорт» (раздел 10 по memory). Проверить:
- Бр.А: Примачок, Темников, Швец-Роговой, Васильев, Рыков (5 чел. ГС)
- Бр.Б: Прусаков, Борисов Д., Борисов А., Браковенко (4 чел. ГС)
- Бр.В: Костров, Моисеенко, Божко, Высидалко (4 чел. СУЛАНЖ)
- ИТР: Шпилёв А.А., Яковлев А.
- Транспорт: 5 авт. включая Lada Granta

- [ ] **Шаг 10.2: Проверить дату договора и контрольные точки**

Договор №ГС-12-05 от 12.05.2026, сумма 38 393 848,42 ₽, срок 100 к.д. → финиш 25.08.2026 (или 29.08.2026 — уточнить по тексту).

- [ ] **Шаг 10.3: Внести правки если нужно**

- [ ] **Шаг 10.4: Коммит (если были правки)**

```bash
git add montage.html
git commit -m "fix: montage — персонал, транспорт, даты"
```

---

## Задача 11: Проверить schedule.html

**Файл:** `schedule.html`

- [ ] **Шаг 11.1: Прочитать контрольные точки**

Найти КТ-1, КТ-2, КТ-3 и ФИНИШ. Должно быть:
- КТ-1: 30.06 · ≥ 46 800 м капли
- КТ-2: 14.07 · ≥ 85 800 м
- КТ-3: 01.08 · ≥ 163 800 м
- ФИНИШ: 29.08.2026

- [ ] **Шаг 11.2: Проверить дату начала работ**

Старт работ: 18.05.2026. Бр.А/Б/В с 22.05.2026.

- [ ] **Шаг 11.3: Внести правки если нужно**

- [ ] **Шаг 11.4: Коммит (если были правки)**

```bash
git add schedule.html
git commit -m "fix: schedule — контрольные точки, даты финиша"
```

---

## Задача 12: Проверить calc.html и routine.html

**Файлы:** `calc.html`, `routine.html`

- [ ] **Шаг 12.1: Проверить нормы в calc.html**

Найти норму капли: должно быть **325 м/чел/день**. Итого: Бр.А 1 625 м/день, Бр.Б/В 1 300 м/день. Общий итог с Н9: 13 чел. × 325 = 4 225 м/день.

- [ ] **Шаг 12.2: Проверить капельную трубку в calc.html**

Должно быть: 217 000 м, стартконнекторы 2 300 шт., слепая трубка 3 470 м, заглушки 2 300 шт.

- [ ] **Шаг 12.3: Проверить нормы в routine.html**

Норма капли: 325 м/чел/день. Рабочий день: 5:30–21:00. Перерывы и распорядок — без изменений.

- [ ] **Шаг 12.4: Внести правки если нужно**

- [ ] **Шаг 12.5: Коммит (если были правки)**

```bash
git add calc.html routine.html
git commit -m "fix: calc/routine — нормы выработки"
```

---

## Задача 13: Финальный деплой и проверка

- [ ] **Шаг 13.1: Запустить полный чек-лист**

Открыть `index.html` в браузере. Пройти все пункты из спека (секция 8):

**Структура:**
- [ ] Карточки «Персонал ГС» и «Транспорт» не видны ни на одной вкладке кроме «Бригада»
- [ ] «Оперативка» открывается через sidebar
- [ ] «Смета» и «Документы» открываются через bottom bar
- [ ] Все 13 вкладок переключаются, скролл сбрасывается
- [ ] Активная вкладка подсвечивается в обоих меню

**Данные:**
- [ ] «Срочные задачи»: 8 пунктов, нет транша 1 и счёта №125
- [ ] «Финансы»: оплаченные зелёные, просроченные красные, итого 3 868 345 ₽
- [ ] Hero KPI «к оплате»: 3,87М
- [ ] Транш 1 нигде не «ожидаемый»
- [ ] №125, №86, №-545 нигде не «просроченные»
- [ ] Lada Granta в таблице транспорта (Бригада) — 5-я строка
- [ ] QA badge динамически показывает 7

**Стили:**
- [ ] Оперативка: нет белых/кремовых фонов в таблицах
- [ ] Заголовок Оперативки: актуальная дата
- [ ] Кнопка «Опер.» в bottom bar без лишнего цвета

- [ ] **Шаг 13.2: Проверить docs.html**

Открыть `docs.html` → переключить все 6 вкладок → каждый iframe загружается без ошибок.

- [ ] **Шаг 13.3: Проверить консоль браузера для всех файлов**

DevTools → Console → нет красных ошибок в index.html, field-map.html, daily.html.

- [ ] **Шаг 13.4: git status — убедиться что нет лишних файлов**

```bash
git status
```

Ожидаем: только изменённые HTML-файлы, никаких `.env`, скриншотов, временных файлов.

- [ ] **Шаг 13.5: Деплой**

```powershell
cd "C:\Users\user\Desktop\vineyard-deploy"
git push origin master
```

Ожидаем: `master -> master` без ошибок.

- [ ] **Шаг 13.6: Проверить продакшн**

Открыть https://dimaborisov410-coder.github.io/4s-grape-garden/ (GitHub Pages обновляется за 1–3 минуты).

Проверить:
- Открывается дашборд, Hero показывает 3,87М
- Sidebar содержит «⚡ Оперативка» последним пунктом
- Вкладка «Бригада» → «Транспорт» → 5 строк

---

## Справочные данные (актуальные на 22.05.2026)

### Движение денег
| Статья | Сумма | Статус |
|---|---|---|
| Транш 1 (АО Янтарный) | 7 000 000 ₽ | ✅ получен 18.05 |
| Транш 2 (ожидается) | 5 000 000 ₽ | ⏳ 25.05.2026 |
| Транш 3 | 20 000 000 ₽ | 🗓 12.06.2026 |
| СТИЛЕКС №290 | 700 000 ₽ | ✅ оплачен из 7М |
| Парамонов №125 | 58 900 ₽ | ✅ оплачен |
| Озон №-545 | 15 054 ₽ | ✅ оплачен |
| Сазыкин №86 | 14 000 ₽ | ✅ оплачен |
| Бытовки Крымтехкаркас | ? | ✅ оплачен, сумма уточняется |

### Открытые счета
| Счёт | Сумма | Статус |
|---|---|---|
| КОИ52 (ёмкости × 8) | 671 040 ₽ | ❌ просрочен 15.05 |
| ЦБ-242 (ПГФ 3050) | 632 200 ₽ | ⚠️ уточнить |
| ЦБ-253 (фильтры Aytok) | 276 999 ₽ | ❌ не оплачен |
| Masdaf + ЧРП (КвадроГрупп) | ~1 973 899 ₽ | ❌ заказ не размещён |
| №3933 (генераторы × 3) | 267 750 ₽ | ❌ просрочен 15.05 |
| №290 СТИЛЕКС (остаток) | 1 659 810 ₽ | ⚠️ частично оплачен |
| №7175 (инструмент) | 215 888 ₽ | ⚠️ к оплате |
| №224 СИМПЛАСТ | 144 657 ₽ | ⚠️ срок 20.05 |
