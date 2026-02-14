import { useState, useEffect, useRef } from 'react';
import { usePartyContext } from '../contexts/PartyContext';
import { useEncounter } from '../hooks/useEncounter';
import { BOSSES, BOSS_ORDER } from '../data/bosses';
import { BOSS_MINIONS } from '../data/minions';
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
  const { party, loading } = usePartyContext();
  const { startEncounter, getCurrentTarget } = useEncounter(party);
  const [hit, setHit] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [lastDefeatedBoss, setLastDefeatedBoss] = useState(null);
  const prevHpRef = useRef(null);
  const prevPhaseRef = useRef(null);

  const encounter = party?.encounter;
  const target = getCurrentTarget();

  // Detect HP changes for hit animation + floating damage numbers
  useEffect(() => {
    if (!target?.data) { prevHpRef.current = null; return; }
    const currentHp = target.data.currentHp;

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
  }, [target?.data?.currentHp]);

  // Detect encounter victory
  useEffect(() => {
    if (!encounter) return;
    if (encounter.phase === 'victory' && prevPhaseRef.current === 'boss') {
      const defeatedIndex = Math.min((party.bossLevel || 1) - 1, BOSS_ORDER.length - 1);
      setLastDefeatedBoss(BOSS_ORDER[defeatedIndex]);
      setShowDefeatModal(true);
    }
    prevPhaseRef.current = encounter.phase;
  }, [encounter?.phase, party?.bossLevel]);

  const handleStartEncounter = async () => {
    await startEncounter();
  };

  const handleStartNext = async () => {
    await startEncounter();
    setShowDefeatModal(false);
    setLastDefeatedBoss(null);
    setDamageNumbers([]);
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

  // No active encounter — show summon screen
  if (!encounter || encounter.phase === 'victory') {
    const bossIndex = Math.min(party.bossLevel || 0, BOSS_ORDER.length - 1);
    const nextBossKey = BOSS_ORDER[bossIndex];
    const nextBoss = BOSSES[nextBossKey];
    const minions = BOSS_MINIONS[nextBossKey] || [];

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
            marginBottom: SIZES.spacing,
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

          {/* Minion wave preview */}
          {minions.length > 0 && (
            <div style={{
              borderTop: `1px solid ${COLORS.border}`,
              paddingTop: SIZES.spacing,
              marginTop: SIZES.spacing,
            }}>
              <div style={{
                fontFamily: FONTS.pixel,
                fontSize: 7,
                color: COLORS.textMuted,
                marginBottom: SIZES.spacing,
              }}>
                {minions.length} MINION{minions.length > 1 ? 'S' : ''} GUARD THIS BOSS
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: SIZES.spacing,
                flexWrap: 'wrap',
              }}>
                {minions.map((m, i) => (
                  <div key={i} style={{
                    backgroundColor: COLORS.bgDarkest,
                    border: `1px solid ${COLORS.border}`,
                    padding: '4px 6px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 16 }}>{m.emoji}</div>
                    <div style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.textMuted }}>
                      {m.maxHp}HP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </PixelCard>

        <PixelButton
          variant="gold"
          onClick={handleStartEncounter}
          style={{ width: '100%', padding: `${SIZES.spacing * 2}px 0`, fontSize: SIZES.fontMd }}
        >
          ⚔️ BEGIN ENCOUNTER
        </PixelButton>

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

  // Active encounter — battle view
  const isMinionPhase = encounter.phase === 'minions';
  const isBossPhase = encounter.phase === 'boss';
  const bossDef = BOSSES[encounter.boss.bossKey];

  const currentTarget = target?.data;
  const targetGlow = isMinionPhase
    ? (currentTarget?.glowColor || COLORS.neonGreen)
    : (bossDef?.glowColor || COLORS.fireRed);

  // For minion wave progress
  const totalMinions = encounter.minions?.length || 0;
  const defeatedMinions = encounter.minions?.filter(m => m.defeated).length || 0;

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
          {isMinionPhase ? 'MINION WAVE' : 'BOSS ARENA'}
        </div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontLg,
          color: targetGlow,
          textShadow: `0 0 10px ${targetGlow}44`,
        }}>
          {currentTarget?.name || 'Unknown'}
        </div>
        {isMinionPhase && (
          <div style={{
            fontFamily: FONTS.pixel,
            fontSize: 7,
            color: COLORS.textMuted,
          }}>
            WAVE {defeatedMinions + 1}/{totalMinions} · Boss: {encounter.boss.name}
          </div>
        )}
        {isBossPhase && (
          <div style={{
            fontFamily: FONTS.pixel,
            fontSize: 7,
            color: COLORS.textMuted,
          }}>
            LV.{encounter.boss.level} · ATK {encounter.boss.attackPower}
          </div>
        )}
      </div>

      {/* Minion wave progress dots */}
      {isMinionPhase && totalMinions > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          marginBottom: SIZES.spacing,
        }}>
          {encounter.minions.map((m, i) => (
            <div key={i} style={{
              width: 12,
              height: 12,
              border: `1px solid ${m.defeated ? COLORS.neonGreen : COLORS.border}`,
              backgroundColor: m.defeated
                ? COLORS.neonGreen
                : i === encounter.currentMinionIndex
                  ? targetGlow
                  : COLORS.bgDarkest,
              opacity: m.defeated ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 7,
            }}>
              {m.defeated ? '✓' : ''}
            </div>
          ))}
        </div>
      )}

      {/* Sprite Area */}
      <div style={{
        position: 'relative',
        backgroundColor: COLORS.bgDarkest,
        border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
        padding: `${SIZES.spacing * 3}px 0`,
        marginBottom: SIZES.spacing * 2,
        minHeight: 120,
        overflow: 'hidden',
        backgroundImage: `radial-gradient(circle at 50% 100%, ${targetGlow}22 0%, transparent 60%)`,
      }}>
        {isMinionPhase ? (
          <BossSprite
            pixels={currentTarget?.pixels}
            glowColor={currentTarget?.glowColor}
            scale={8}
            hit={hit}
          />
        ) : (
          <BossSprite
            bossKey={encounter.boss.bossKey}
            scale={7}
            hit={hit}
          />
        )}

        {/* Floating damage numbers */}
        {damageNumbers.map((dn) => (
          <DamageNumber key={dn.id} amount={dn.amount} type={dn.type} id={dn.id} />
        ))}
      </div>

      {/* HP Bar */}
      <div style={{ marginBottom: SIZES.spacing }}>
        <BossHealthBar
          currentHp={currentTarget?.currentHp || 0}
          maxHp={currentTarget?.maxHp || 1}
        />
      </div>

      {/* XP/Gold reward preview for current target */}
      {currentTarget && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: SIZES.spacing * 2,
          marginBottom: SIZES.spacing * 2,
        }}>
          {isMinionPhase && (
            <>
              <span style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.neonCyan }}>
                +{currentTarget.xp} XP
              </span>
              <span style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.gold }}>
                +{currentTarget.gold} 🪙
              </span>
            </>
          )}
          {isBossPhase && encounter.boss.rewards && (
            <>
              <span style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.neonCyan }}>
                +{encounter.boss.rewards.xp} XP
              </span>
              <span style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.gold }}>
                +{encounter.boss.rewards.gold} 🪙
              </span>
            </>
          )}
        </div>
      )}

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
