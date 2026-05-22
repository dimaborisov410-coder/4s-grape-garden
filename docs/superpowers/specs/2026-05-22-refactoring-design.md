# Рефакторинг 4S Grape Garden Dashboard

**Дата:** 2026-05-22  
**Проект:** vineyard-deploy  
**Цель:** Разбить монолитный index.html на управляемые части, вынести данные в JSON, создать сборщик

---

## Контекст

Проект — статический HTML-дашборд системы орошения 4S Grape Garden (56,7 га, Крым).  
Деплой: GitHub Pages (`git push`).  
Рабочий каталог: `C:\Users\user\Desktop\vineyard-deploy\`

Текущие проблемы:
- `index.html` ~326 кб, 13 вкладок в одном файле — трудно найти нужное место
- CSS и JS продублированы в каждом из 8 HTML-файлов
- Финансовые данные, состав бригады, статусы материалов захардкожены в HTML — обновление рискованно

---

## Архитектура после рефакторинга

### Структура папок

```
vineyard-deploy/
├── src/
│   ├── data/
│   │   ├── finance.json       # Транши, расходы, счета к оплате
│   │   ├── crew.json          # Бригады, имена, ставки, дни
│   │   ├── materials.json     # Статусы материалов (❌⚠️✅)
│   │   └── tasks.json         # Задачи и горящие вопросы
│   ├── shared/
│   │   └── style.css          # Общие CSS-переменные и компоненты
│   └── tabs/
│       ├── overview.html      # page-overview — Главная
│       ├── blocks.html        # page-blocks — Блоки
│       ├── plantings.html     # page-plantings — Лоза
│       ├── equipment.html     # page-equip — Оборудование
│       ├── map.html           # page-map — Карта
│       ├── finance.html       # page-finance — Финансы
│       ├── tasks.html         # page-tasks — Задачи
│       ├── build.html         # page-build — Монтаж
│       ├── crew.html          # page-crew — Бригада
│       ├── smeta.html         # page-smeta — Смета
│       ├── docs-tab.html      # page-docs — Документы
│       ├── qa.html            # page-qa — Вопросы
│       └── ops.html           # page-ops — Оперативка
├── build.js                   # Сборщик (Node.js)
├── update.bat                 # Деплой: node build.js && git push
│
├── index.html                 # ВЫХОД: генерируется build.js
├── docs.html                  # ВЫХОД: генерируется build.js
├── daily.html                 # ВЫХОД: генерируется build.js
├── field-map.html             # ВЫХОД: генерируется build.js
├── routine.html               # ВЫХОД: генерируется build.js
├── calc.html                  # ВЫХОД: генерируется build.js
├── montage.html               # ВЫХОД: генерируется build.js
└── schedule.html              # ВЫХОД: генерируется build.js
```

---

## Данные (JSON)

### finance.json
```json
{
  "tranches": [
    { "amount": 10000000, "date": "2026-05-18", "status": "paid" },
    { "amount": 20000000, "date": "2026-05-22", "status": "paid" }
  ],
  "expenses": [
    { "name": "СТИЛЕКС трубы ПЭ (счёт 290)", "amount": 700000, "status": "paid", "date": "2026-05-18" },
    { "name": "Авто Lada Granta ИП Парамонов (счёт 125)", "amount": 58900, "status": "paid" },
    { "name": "Озон товары бытовка (счёт 545)", "amount": 15054, "status": "paid" },
    { "name": "Биотуалет ИП Сазыкин (счёт 86)", "amount": 14000, "status": "paid" },
    { "name": "Бытовки × 2 Крымтехкаркас", "amount": null, "status": "paid", "note": "сумма не уточнена" }
  ],
  "pending": [
    { "name": "Ёмкости ПЭ 10000 л × 8 шт. (КОИ52)", "amount": 671040, "due": "2026-05-15", "overdue": true }
  ]
}
```

### crew.json
```json
{
  "brigades": [
    {
      "name": "Бр.А",
      "contractor": "ГС",
      "task": "магистраль/НС",
      "members": ["Примачок", "Темников", "Швец-Роговой", "Васильев", "Рыков"]
    },
    {
      "name": "Бр.Б",
      "contractor": "ГС",
      "task": "земля/латераль",
      "members": ["Прусаков", "Борисов Д.", "Борисов А.", "Браковенко"]
    },
    {
      "name": "Бр.В",
      "contractor": "СУЛАНЖ",
      "task": "капельная лента",
      "members": ["Костров", "Моисеенко", "Божко", "Высидалко"]
    }
  ]
}
```

### materials.json
```json
{
  "items": [
    { "name": "Насосы Masdaf", "status": "missing", "note": "запрос подан КвадроГрупп, доставка 10–14 дн." },
    { "name": "Ёмкости ПЭ 10 000 л × 8 шт.", "status": "missing", "note": "счёт КОИ52 не оплачен, просрочен 15.05" },
    { "name": "ТУ на электроснабжение 45–56 кВт", "status": "missing", "note": "не получены" },
    { "name": "Капельная трубка METZER", "status": "partial", "note": "50 000 м придут 29.05, нужно 217 000 м, дефицит 167 000 м" },
    { "name": "Крючки Irritec 16 мм", "status": "partial", "note": "62 000 шт. есть, нужно ~217 000 шт., дефицит 155 000 шт." },
    { "name": "Трубы ПЭ СТИЛЕКС", "status": "ok", "note": "оплачено 700 000 ₽, поставка ожидается" },
    { "name": "Бытовки × 2", "status": "ok", "note": "оплачены, Крымтехкаркас" },
    { "name": "Биотуалет, Озон, аренда авто", "status": "ok", "note": "оплачены 18.05" }
  ]
}
```

### tasks.json
```json
{
  "urgent": [
    { "text": "Оплатить ёмкости КОИ52 — 671 040 ₽", "responsible": "Надежда", "overdue": true },
    { "text": "Получить ТУ на электроснабжение 45–56 кВт", "responsible": "Шпилёв" },
    { "text": "Уточнить статус насосов Masdaf у КвадроГрупп", "responsible": "Яковлев" },
    { "text": "Уточнить сумму за бытовки Крымтехкаркас", "responsible": "Шпилёв" }
  ]
}
```

---

## Сборщик (build.js)

Node.js скрипт выполняет:
1. Читает `src/shared/style.css`
2. Читает все JSON из `src/data/`
3. Читает все вкладки из `src/tabs/`
4. Собирает `index.html` — подставляет CSS, вставляет вкладки, инжектирует данные как `window.DATA`
5. Для каждого остального файла (`daily.html`, `docs.html` и др.) — вставляет общий CSS

---

## Как меняется процесс обновления

| Было | Стало |
|------|-------|
| Ищу нужное место в 3000+ строках | Открываю нужный JSON или файл вкладки |
| Обновляю финансы — риск сломать HTML | Меняю цифру в `finance.json` |
| Обновляю статус материала — ищу иконку ❌ в куче кода | Меняю `"status": "missing"` → `"status": "ok"` |
| Общие стили в 8 местах | В одном `style.css` |

Деплой остаётся прежним: `update.bat`

---

## Ограничения

- Никаких фреймворков, только Node.js (уже установлен)
- Финальные HTML-файлы самодостаточны (не подгружают JSON в браузере)
- Визуальный результат идентичен текущему
