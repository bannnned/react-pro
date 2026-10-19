# LESSON-3 — RTK Query и управление задачами

Ветка: lesson-3

## Запуск

```bash
npm ci && npm run dev
npm run build
npm run lint
```

## Чеклист

- [x] Создан общий `baseApi` с `reducerPath`, `baseQuery` и тегом `Tasks` — 1 балл
- [x] `tasksApi` добавляет `getTasks` через `injectEndpoints` и экспортирует `useGetTasksQuery` — 2 балла
- [x] `baseApi.reducer` и `baseApi.middleware` подключены в store один раз — 1 балл
- [x] Задачи загружаются с JSONPlaceholder и отображаются через `TaskList` и `TaskCard` — 3 балла
- [x] В `useTasks` данные копируются в локальный `useState` через `useEffect` — 2 балла
- [x] `removeTask` удаляет задачу только из локального состояния — 2 балла
- [x] После локального удаления задача исчезает из интерфейса — 1 балл

Ключевые файлы:

- `src/shared/api/baseApi.ts`
- `src/entities/task/api/tasksApi.ts`
- `src/app/store.ts`
- `src/widgets/taskList/model/useTasks.ts`

## Не сделано / вопросы

- Нет.
