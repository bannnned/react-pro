import { createBrowserRouter } from 'react-router-dom';
import { RegistrationPage } from 'pages/registration';
import { TaskPage } from 'pages/tasks';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RegistrationPage />,
  },
  {
    path: '/tasks',
    element: <TaskPage />,
  },
]);
