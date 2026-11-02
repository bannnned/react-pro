import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage, ProfilePage, ProtectedRoute, PublicPage } from 'features/authRouting';
import { RefExamplesPage } from 'pages/refExamples';
import { RegistrationPage } from 'pages/registration';
import { TaskPage } from 'pages/tasks';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/public" element={<PublicPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/refs" element={<RefExamplesPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/tasks" element={<TaskPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
