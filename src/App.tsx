import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ToastProvider } from './components/ui/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { SchedulePage } from './pages/SchedulePage';
import { AppStoreProvider } from './store/AppStore';

export function App() {
  return (
    <AppStoreProvider>
      <ToastProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AppStoreProvider>
  );
}
