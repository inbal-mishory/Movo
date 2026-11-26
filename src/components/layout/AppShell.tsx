import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="shell">
      <Header />
      <div className="shell__body">
        <Sidebar />
        <main className="shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
