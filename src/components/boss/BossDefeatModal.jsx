import { BOSSES } from '../../data/bosses';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';
import { COLORS, FONTS, SIZES } from '../../styles/theme';

export default function BossDefeatModal({ bossKey, onStartNext, onClose }) {
  const boss = BOSSES[bossKey];
  if (!boss) return null;

  return (
    <PixelModal onClose={onClose} title="VICTORY!">
      <div style={{ textAlign: 'center' }}>
        {/* Defeated boss */}
        <div style={{
          fontSize: 64,
          marginBottom: SIZES.spacing * 2,
          opacity: 0.5,
          filter: 'grayscale(0.5)',
        }}>
          {boss.emoji}
        </div>

        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontMd,
          color: COLORS.textPrimary,
          marginBottom: SIZES.spacing,
        }}>
          {boss.name} has been slain!
        </div>

        {/* Rewards */}
        <div style={{
          backgroundColor: COLORS.bgDarkest,
          border: `2px solid ${COLORS.gold}`,
          padding: SIZES.spacing * 2,
          marginBottom: SIZES.spacing * 2,
        }}>
          <div style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            color: COLORS.gold,
            marginBottom: SIZES.spacing,
          }}>
            REWARDS FOR ALL PARTY MEMBERS
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: SIZES.spacing * 3 }}>
            <div>
              <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontLg, color: COLORS.neonCyan }}>
                +{boss.rewards.xp}
              </div>
              <div style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.textMuted }}>XP</div>
            </div>
            <div>
              <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontLg, color: COLORS.gold }}>
                +{boss.rewards.gold}
              </div>
              <div style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.textMuted }}>GOLD</div>
            </div>
          </div>
        </div>

        <PixelButton variant="gold" onClick={onStartNext} style={{ width: '100%', padding: `${SIZES.spacing * 1.5}px 0` }}>
          SUMMON NEXT BOSS
        </PixelButton>

        <div style={{ marginTop: SIZES.spacing }}>
          <PixelButton variant="ghost" onClick={onClose} style={{ width: '100%' }}>
            LATER
          </PixelButton>
        </div>
      </div>
    </PixelModal>
  );
}
