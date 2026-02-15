import { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePartyContext } from '../../contexts/PartyContext';
import PixelButton from '../ui/PixelButton';
import PixelInput from '../ui/PixelInput';
import PixelCard from '../ui/PixelCard';
import { COLORS, FONTS, SIZES } from '../../styles/theme';

export default function JoinParty() {
  const { user, profile } = useAuthContext();
  const { joinParty } = usePartyContext();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      await joinParty(user.uid, profile.displayName, profile.level, profile.hp, profile.maxHp, code.trim());
    } catch (err) {
      setError(err.message || 'Failed to join party');
    }
    setLoading(false);
  };

  return (
    <PixelCard>
      <div style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontMd,
        color: COLORS.neonCyan,
        marginBottom: SIZES.spacing * 2,
        textAlign: 'center',
      }}>
        👥 JOIN PARTY
      </div>
      <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: SIZES.spacing * 2 }}>
        <div>
          <label style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            color: COLORS.textSecondary,
            display: 'block',
            marginBottom: 4,
          }}>INVITE CODE</label>
          <PixelInput
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            style={{ textAlign: 'center', letterSpacing: 4, fontSize: SIZES.fontLg }}
          />
        </div>
        {error && (
          <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontXs, color: COLORS.fireRed, textAlign: 'center' }}>
            {error}
          </div>
        )}
        <PixelButton variant="gold" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'JOINING...' : 'JOIN PARTY'}
        </PixelButton>
      </form>
    </PixelCard>
  );
}
