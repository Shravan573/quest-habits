import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../../styles/theme';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'QUESTS', icon: '⚔️' },
  { path: '/boss', label: 'BOSS', icon: '🐉' },
  { path: '/shop', label: 'SHOP', icon: '🏪' },
  { path: '/skills', label: 'SKILLS', icon: '⭐' },
  { path: '/party', label: 'PARTY', icon: '👥' },
];

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: COLORS.bgDark,
      display: 'flex',
      zIndex: 50,
      ...PIXEL_BORDER,
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: 'none',
    }}>
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1,
              padding: `${SIZES.spacing}px 0`,
              background: active ? COLORS.bgMedium : 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{
              fontFamily: FONTS.pixel,
              fontSize: 6,
              color: active ? COLORS.neonGreen : COLORS.textMuted,
              letterSpacing: 1,
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
