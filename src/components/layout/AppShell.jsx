import NavBar from './NavBar';
import CRTOverlay from './CRTOverlay';
import { useAuthContext } from '../../contexts/AuthContext';
import { CLASSES } from '../../data/classes';
import { COLORS, FONTS, SIZES } from '../../styles/theme';
import HealthBar from '../ui/HealthBar';
import StatBar from '../ui/StatBar';

export default function AppShell({ children }) {
  const { profile } = useAuthContext();
  const playerClass = profile?.class ? CLASSES[profile.class] : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.bgDarkest, paddingBottom: 70 }}>
      <CRTOverlay />

      {/* Top Player Stats Bar */}
      {profile && (
        <div style={{
          backgroundColor: COLORS.bgDark,
          padding: `${SIZES.spacing}px ${SIZES.spacing * 2}px`,
          borderBottom: `${SIZES.borderWidth}px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: SIZES.spacing * 2,
        }}>
          {/* Avatar + Name + Level */}
          <div style={{ display: 'flex', alignItems: 'center', gap: SIZES.spacing }}>
            <div style={{
              width: 36,
              height: 36,
              backgroundColor: COLORS.bgMedium,
              border: `2px solid ${playerClass?.color || COLORS.neonGreen}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>
              {playerClass?.emoji || '⚔️'}
            </div>
            <div>
              <div style={{
                fontFamily: FONTS.pixel,
                fontSize: SIZES.fontXs,
                color: COLORS.neonGreen,
              }}>
                LV.{profile.level}
              </div>
              <div style={{
                fontFamily: FONTS.pixel,
                fontSize: SIZES.fontSm,
                color: COLORS.textPrimary,
              }}>
                {profile.displayName}
              </div>
            </div>
          </div>

          {/* HP + XP bars */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <HealthBar current={profile.hp} max={profile.maxHp} height={10} showLabel={false} />
            <StatBar
              label=""
              value={profile.xp}
              max={100 * profile.level}
              color={COLORS.gold}
            />
          </div>

          {/* Gold */}
          <div style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontSm,
            color: COLORS.gold,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <span>🪙</span>
            {profile.gold}
          </div>
        </div>
      )}

      {/* Page Content */}
      {children}

      <NavBar />
    </div>
  );
}
