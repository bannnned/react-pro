# LESSON-1 — Архитектура React-приложений

Ветка: `lesson-1`

## Запуск

```bash
npm ci && npm run dev
npm run build
npm run lint
```

## Чеклист

- [x] Проект на React и TypeScript создан через Vite — 1 балл
- [x] Слои `app`, `entities`, `features`, `shared`, `pages`, `widgets` настроены по FSD — 1 балл
- [x] ESLint, Prettier и абсолютные импорты настроены — 1 балл
- [x] Описана сущность `Task` — 1 балл
- [x] Реализован презентационный `TaskCard` — 1 балл
- [x] Стили `TaskCard` вынесены в CSS-модуль — 1 балл
- [x] `useTasks` фильтрует и удаляет задачи — 1 балл
- [x] `TaskList` отображает отфильтрованные задачи — 1 балл
- [x] Состояние хранится в хуке, данные и обработчики передаются через props — 1 балл
- [x] Страница `TaskPage` и виджет `TaskWidget` подключены к маршруту — 1 балл
- [x] Код разделён на небольшие модули с публичными API — 1 балл
- [x] `FilterButton` вынесен в `shared/ui` — 1 бонусный балл

## Ключевые файлы

- `src/app/router.tsx` — маршрут страницы задач
- `src/entities/task/` — тип и карточка задачи
- `src/widgets/taskList/` — хук, фильтры и список
- `src/widgets/task/` — композиционный виджет
- `src/pages/tasks/` — страница задач

## Не сделано / вопросы

- Нет.
