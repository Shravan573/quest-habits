import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './contexts/AuthContext';
import { PartyProvider } from './contexts/PartyContext';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BossArenaPage from './pages/BossArenaPage';
import PartyPage from './pages/PartyPage';
import { useDailyReset } from './hooks/useDailyReset';
import { COLORS, FONTS } from './styles/theme';

function AppContent() {
  useDailyReset();

  return (
    <PartyProvider>
      <Routes>
        <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
        <Route path="/boss" element={<AppShell><BossArenaPage /></AppShell>} />
        <Route path="/party" element={<AppShell><PartyPage /></AppShell>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </PartyProvider>
  );
}

export default function App() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: COLORS.bgDarkest,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.pixel,
        color: COLORS.neonGreen,
        fontSize: 12,
      }}>
        LOADING...
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return <AppContent />;
}
