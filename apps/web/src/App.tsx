import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { ConnectionBadge } from './components/ConnectionBadge';
import { DayPlanPage } from './pages/DayPlanPage';
import { MachineLinesPage } from './pages/MachineLinesPage';
import { OverviewPage } from './pages/OverviewPage';
import { UploadsPage } from './pages/UploadsPage';
import { WeekPlanPage } from './pages/WeekPlanPage';

const TABS = [
  { to: '/overview', label: 'Overview' },
  { to: '/machine-lines', label: 'Machine lines' },
  { to: '/uploads', label: 'Uploads' },
  { to: '/week-plan', label: 'Week plan' },
  { to: '/day-plan', label: 'Day plan' },
];

export function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <strong className="brand">Auto Week &amp; Day Plan</strong>
        <nav>
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {t.label}
            </NavLink>
          ))}
        </nav>
        <ConnectionBadge />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/machine-lines" element={<MachineLinesPage />} />
          <Route path="/uploads" element={<UploadsPage />} />
          <Route path="/week-plan" element={<WeekPlanPage />} />
          <Route path="/day-plan" element={<DayPlanPage />} />
        </Routes>
      </main>
    </div>
  );
}
