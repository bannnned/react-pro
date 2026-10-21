import { createBrowserRouter } from 'react-router-dom';
import { RefExamplesPage } from 'pages/refExamples';
import { RegistrationPage } from 'pages/registration';
import { TaskPage } from 'pages/tasks';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RefExamplesPage />,
  },
  {
    path: '/registration',
    element: <RegistrationPage />,
  },
  {
    path: '/tasks',
    element: <TaskPage />,
  },
]);
