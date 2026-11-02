import { baseApi } from 'shared/api';
import type { Task } from '../model/types';

type TasksResponse = Task[] | { todos: Task[] };

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<Task[], void>({
      query: () => 'todos',
      transformResponse: (response: TasksResponse) =>
        Array.isArray(response) ? response : response.todos,
      providesTags: ['Tasks'],
    }),
  }),
});

export const { useGetTasksQuery } = tasksApi;
