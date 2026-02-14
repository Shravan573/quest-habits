import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthContext } from '../contexts/AuthContext';
import { CLASSES, getTotalSkillPointsSpent } from '../data/classes';
import PixelButton from '../components/ui/PixelButton';
import PixelCard from '../components/ui/PixelCard';
import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../styles/theme';

export default function SkillTreePage() {
  const { user, profile } = useAuthContext();
  const [upgrading, setUpgrading] = useState(null);

  if (!profile?.class) return null;

  const classDef = CLASSES[profile.class];
  const skills = profile.skills || {};
  const availablePoints = (profile.skillPoints || 0);

  const canUpgrade = (skill) => {
    const currentLevel = skills[skill.id] || 0;
    if (currentLevel >= skill.maxLevel) return false;
    const cost = skill.cost[currentLevel];
    if (cost > availablePoints) return false;
    if (skill.requires) {
      const reqLevel = skills[skill.requires] || 0;
      if (reqLevel < (skill.requiresLevel || 1)) return false;
    }
    return true;
  };

  const handleUpgrade = async (skill) => {
    if (!canUpgrade(skill)) return;
    const currentLevel = skills[skill.id] || 0;
    const cost = skill.cost[currentLevel];

    setUpgrading(skill.id);
    const newSkills = { ...skills, [skill.id]: currentLevel + 1 };
    await updateDoc(doc(db, 'users', user.uid), {
      skills: newSkills,
      skillPoints: availablePoints - cost,
    });
    setUpgrading(null);
  };

  return (
    <div style={{ padding: SIZES.spacing * 2 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: SIZES.spacing * 2 }}>
        <div style={{ fontSize: 36 }}>{classDef.emoji}</div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontLg,
          color: classDef.color,
          marginBottom: 4,
        }}>
          {classDef.name.toUpperCase()}
        </div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontSm,
          color: COLORS.gold,
        }}>
          ⭐ {availablePoints} SKILL POINT{availablePoints !== 1 ? 'S' : ''} AVAILABLE
        </div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: 7,
          color: COLORS.textMuted,
          marginTop: 4,
        }}>
          Earn skill points by leveling up
        </div>
      </div>

      {/* Skill Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SIZES.spacing }}>
        {classDef.skills.map((skill) => {
          const currentLevel = skills[skill.id] || 0;
          const isMaxed = currentLevel >= skill.maxLevel;
          const canUp = canUpgrade(skill);
          const cost = !isMaxed ? skill.cost[currentLevel] : 0;
          const isLocked = skill.requires && (skills[skill.requires] || 0) < (skill.requiresLevel || 1);
          const isUltimate = skill.maxLevel === 1 && skill.requires;

          return (
            <PixelCard key={skill.id} style={{
              padding: SIZES.spacing,
              opacity: isLocked ? 0.4 : 1,
              borderColor: isMaxed ? COLORS.gold : isUltimate ? classDef.color : COLORS.border,
              backgroundColor: isMaxed ? `${COLORS.gold}08` : COLORS.bgDark,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SIZES.spacing }}>
                {/* Skill Icon */}
                <div style={{
                  width: 40,
                  height: 40,
                  backgroundColor: COLORS.bgDarkest,
                  border: `2px solid ${isMaxed ? COLORS.gold : isLocked ? COLORS.textMuted : classDef.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}>
                  {isLocked ? '🔒' : skill.emoji}
                </div>

                {/* Skill Info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: FONTS.pixel,
                    fontSize: SIZES.fontSm,
                    color: isMaxed ? COLORS.gold : COLORS.textPrimary,
                    marginBottom: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: SIZES.spacing,
                  }}>
                    {skill.name}
                    {isUltimate && (
                      <span style={{
                        fontFamily: FONTS.pixel,
                        fontSize: 7,
                        color: COLORS.bgDarkest,
                        backgroundColor: classDef.color,
                        padding: '1px 4px',
                      }}>
                        ULTIMATE
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: FONTS.pixel,
                    fontSize: 7,
                    color: COLORS.textMuted,
                    marginBottom: 4,
                  }}>
                    {skill.description}
                  </div>

                  {/* Level pips */}
                  <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    {Array.from({ length: skill.maxLevel }).map((_, i) => (
                      <div key={i} style={{
                        width: 12,
                        height: 8,
                        backgroundColor: i < currentLevel ? classDef.color : '#222',
                        border: '1px solid #111',
                      }} />
                    ))}
                    <span style={{
                      fontFamily: FONTS.pixel,
                      fontSize: 7,
                      color: COLORS.textMuted,
                      marginLeft: 4,
                    }}>
                      {currentLevel}/{skill.maxLevel}
                    </span>
                  </div>

                  {isLocked && (
                    <div style={{
                      fontFamily: FONTS.pixel,
                      fontSize: 7,
                      color: COLORS.fireRed,
                      marginTop: 4,
                    }}>
                      Requires: {classDef.skills.find((s) => s.id === skill.requires)?.name} LV.{skill.requiresLevel}
                    </div>
                  )}
                </div>

                {/* Upgrade Button */}
                {!isMaxed && !isLocked && (
                  <PixelButton
                    variant={canUp ? 'gold' : 'ghost'}
                    disabled={!canUp || upgrading === skill.id}
                    onClick={() => handleUpgrade(skill)}
                    style={{ flexShrink: 0, padding: '6px 10px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: SIZES.fontXs }}>UP</div>
                      <div style={{ fontSize: 7, color: canUp ? COLORS.bgDarkest : COLORS.textMuted }}>
                        ⭐{cost}
                      </div>
                    </div>
                  </PixelButton>
                )}

                {isMaxed && (
                  <div style={{
                    fontFamily: FONTS.pixel,
                    fontSize: SIZES.fontXs,
                    color: COLORS.gold,
                    flexShrink: 0,
                  }}>
                    MAX ✓
                  </div>
                )}
              </div>
            </PixelCard>
          );
        })}
      </div>
    </div>
  );
}
