import PixelCard from '../ui/PixelCard';
import HealthBar from '../ui/HealthBar';
import { COLORS, FONTS, SIZES } from '../../styles/theme';

export default function PartyMembers({ members, leaderId }) {
  const memberList = Object.entries(members || {});

  if (memberList.length === 0) {
    return (
      <div style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
        textAlign: 'center',
        padding: SIZES.spacing * 2,
      }}>
        No members yet
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {memberList.map(([uid, member]) => (
        <PixelCard key={uid} style={{ padding: SIZES.spacing }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SIZES.spacing }}>
            {/* Avatar placeholder */}
            <div style={{
              width: 32,
              height: 32,
              backgroundColor: COLORS.bgMedium,
              border: `2px solid ${uid === leaderId ? COLORS.gold : COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
            }}>
              ⚔️
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SIZES.spacing }}>
                <span style={{
                  fontFamily: FONTS.pixel,
                  fontSize: SIZES.fontSm,
                  color: COLORS.textPrimary,
                }}>
                  {member.displayName}
                </span>
                {uid === leaderId && (
                  <span style={{
                    fontFamily: FONTS.pixel,
                    fontSize: 7,
                    color: COLORS.gold,
                  }}>
                    👑 LEADER
                  </span>
                )}
              </div>
              <div style={{
                fontFamily: FONTS.pixel,
                fontSize: 7,
                color: COLORS.textMuted,
                marginBottom: 4,
              }}>
                LV.{member.level}
              </div>
              <HealthBar current={member.hp} max={member.maxHp} height={6} showLabel={false} />
            </div>
          </div>
        </PixelCard>
      ))}
    </div>
  );
}
