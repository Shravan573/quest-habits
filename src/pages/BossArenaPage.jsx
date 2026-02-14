import { useState, useEffect, useRef } from 'react';
import { usePartyContext } from '../contexts/PartyContext';
import { useBoss } from '../hooks/useBoss';
import { BOSSES } from '../data/bosses';
import BossSprite from '../components/boss/BossSprite';
import BossHealthBar from '../components/boss/BossHealthBar';
import DamageNumber from '../components/boss/DamageNumber';
import DamageFeed from '../components/boss/DamageFeed';
import BossDefeatModal from '../components/boss/BossDefeatModal';
import PartyMembers from '../components/party/PartyMembers';
import PixelButton from '../components/ui/PixelButton';
import PixelCard from '../components/ui/PixelCard';
import { COLORS, FONTS, SIZES } from '../styles/theme';

export default function BossArenaPage() {
  const { party, loading, startBoss } = usePartyContext();
  const { startNextBoss } = useBoss(party);
  const [hit, setHit] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [lastDefeatedBoss, setLastDefeatedBoss] = useState(null);
  const prevHpRef = useRef(null);

  // Detect damage dealt to boss (HP changes from other players too)
  useEffect(() => {
    if (!party?.activeBoss) return;
    const currentHp = party.activeBoss.currentHp;

    if (prevHpRef.current !== null && currentHp < prevHpRef.current) {
      const damageTaken = prevHpRef.current - currentHp;
      setHit(true);
      setTimeout(() => setHit(false), 300);

      setDamageNumbers((prev) => [
        ...prev.slice(-5),
        { id: Date.now(), amount: damageTaken, type: 'dealt' },
      ]);
    }

    prevHpRef.current = currentHp;
  }, [party?.activeBoss?.currentHp]);

  // Detect boss defeated
  useEffect(() => {
    if (!party?.activeBoss && prevHpRef.current !== null && prevHpRef.current > 0) {
      // Boss was just defeated
      const lastFeed = party?.damageFeed;
      if (lastFeed && lastFeed.length > 0) {
        // Try to find what boss was just defeated from the bossLevel
        const defeatedIndex = Math.min((party.bossLevel || 1) - 1, 6);
        const bossKeys = Object.keys(BOSSES);
        setLastDefeatedBoss(bossKeys[defeatedIndex] || 'slime_king');
        setShowDefeatModal(true);
      }
      prevHpRef.current = null;
    }
  }, [party?.activeBoss, party?.bossLevel]);

  const handleStartNext = async () => {
    await startNextBoss();
    setShowDefeatModal(false);
    setLastDefeatedBoss(null);
  };

  if (loading) {
    return (
      <div style={{
        padding: SIZES.spacing * 4,
        textAlign: 'center',
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
      }}>
        LOADING...
      </div>
    );
  }

  // No party
  if (!party) {
    return (
      <div style={{
        padding: SIZES.spacing * 4,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: SIZES.spacing * 2 }}>🐉</div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontMd,
          color: COLORS.textSecondary,
          marginBottom: SIZES.spacing,
        }}>
          NO PARTY
        </div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
          color: COLORS.textMuted,
        }}>
          Join or create a party to fight bosses together!
        </div>
      </div>
    );
  }

  // No active boss
  if (!party.activeBoss) {
    const bossIndex = Math.min(party.bossLevel || 0, 6);
    const nextBossKey = Object.keys(BOSSES)[bossIndex];
    const nextBoss = BOSSES[nextBossKey];

    return (
      <div style={{
        padding: SIZES.spacing * 2,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontLg,
          color: COLORS.gold,
          marginBottom: SIZES.spacing * 2,
        }}>
          BOSS ARENA
        </div>

        <PixelCard style={{ marginBottom: SIZES.spacing * 2 }}>
          <div style={{ fontSize: 64, marginBottom: SIZES.spacing }}>
            {nextBoss?.emoji || '🐉'}
          </div>
          <div style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontMd,
            color: COLORS.textPrimary,
            marginBottom: 4,
          }}>
            {nextBoss?.name || 'Unknown Boss'}
          </div>
          <div style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            color: COLORS.textMuted,
            marginBottom: SIZES.spacing,
          }}>
            {nextBoss?.description}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: SIZES.spacing * 3,
            marginBottom: SIZES.spacing * 2,
          }}>
            <div>
              <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontXs, color: COLORS.fireRed }}>
                {nextBoss?.maxHp} HP
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontXs, color: COLORS.fireOrange }}>
                {nextBoss?.attackPower} ATK
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontXs, color: COLORS.neonCyan }}>
                LV.{nextBoss?.level}
              </div>
            </div>
          </div>
        </PixelCard>

        <PixelButton
          variant="gold"
          onClick={startBoss}
          style={{ width: '100%', padding: `${SIZES.spacing * 2}px 0`, fontSize: SIZES.fontMd }}
        >
          ⚔️ SUMMON BOSS
        </PixelButton>

        {/* Boss defeated modal */}
        {showDefeatModal && lastDefeatedBoss && (
          <BossDefeatModal
            bossKey={lastDefeatedBoss}
            onStartNext={handleStartNext}
            onClose={() => setShowDefeatModal(false)}
          />
        )}
      </div>
    );
  }

  // Active boss — battle view
  const bossDef = BOSSES[party.activeBoss.bossKey];

  return (
    <div style={{ padding: SIZES.spacing * 2 }}>
      {/* Arena Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: SIZES.spacing,
      }}>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
          color: COLORS.textMuted,
          letterSpacing: 2,
        }}>
          BOSS ARENA
        </div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontLg,
          color: bossDef?.glowColor || COLORS.fireRed,
          textShadow: `0 0 10px ${bossDef?.glowColor || COLORS.fireRed}44`,
        }}>
          {party.activeBoss.name}
        </div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: 7,
          color: COLORS.textMuted,
        }}>
          LV.{party.activeBoss.level} · ATK {party.activeBoss.attackPower}
        </div>
      </div>

      {/* Boss Sprite Area */}
      <div style={{
        position: 'relative',
        backgroundColor: COLORS.bgDarkest,
        border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
        padding: `${SIZES.spacing * 3}px 0`,
        marginBottom: SIZES.spacing * 2,
        minHeight: 120,
        overflow: 'hidden',
        // Subtle background pattern
        backgroundImage: `radial-gradient(circle at 50% 100%, ${bossDef?.glowColor || '#ff000022'} 0%, transparent 60%)`,
      }}>
        <BossSprite
          bossKey={party.activeBoss.bossKey}
          scale={7}
          hit={hit}
        />

        {/* Floating damage numbers */}
        {damageNumbers.map((dn) => (
          <DamageNumber key={dn.id} amount={dn.amount} type={dn.type} id={dn.id} />
        ))}
      </div>

      {/* Boss HP Bar */}
      <div style={{ marginBottom: SIZES.spacing * 2 }}>
        <BossHealthBar currentHp={party.activeBoss.currentHp} maxHp={party.activeBoss.maxHp} />
      </div>

      {/* Info text */}
      <div style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: SIZES.spacing * 2,
        padding: `0 ${SIZES.spacing}px`,
      }}>
        Complete your habits, dailies, and to-dos to deal damage!
      </div>

      {/* Damage Feed */}
      <PixelCard style={{ marginBottom: SIZES.spacing * 2 }}>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
          color: COLORS.textSecondary,
          marginBottom: SIZES.spacing,
        }}>
          BATTLE LOG
        </div>
        <DamageFeed feed={party.damageFeed} />
      </PixelCard>

      {/* Party Members */}
      <div style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
        color: COLORS.textSecondary,
        marginBottom: SIZES.spacing,
      }}>
        PARTY STATUS
      </div>
      <PartyMembers members={party.members} leaderId={party.leaderId} />

      {/* Boss defeated modal */}
      {showDefeatModal && lastDefeatedBoss && (
        <BossDefeatModal
          bossKey={lastDefeatedBoss}
          onStartNext={handleStartNext}
          onClose={() => setShowDefeatModal(false)}
        />
      )}
    </div>
  );
}
