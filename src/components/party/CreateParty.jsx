import { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePartyContext } from '../../contexts/PartyContext';
import PixelButton from '../ui/PixelButton';
import PixelInput from '../ui/PixelInput';
import PixelCard from '../ui/PixelCard';
import { COLORS, FONTS, SIZES } from '../../styles/theme';

export default function CreateParty() {
  const { user, profile } = useAuthContext();
  const { createParty } = usePartyContext();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Enter a party name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createParty(user.uid, profile.displayName, name.trim(), profile.level, profile.hp, profile.maxHp);
    } catch (err) {
      setError(err.message || 'Failed to create party');
    }
    setLoading(false);
  };

  return (
    <PixelCard>
      <div style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontMd,
        color: COLORS.gold,
        marginBottom: SIZES.spacing * 2,
        textAlign: 'center',
      }}>
        ⚔️ CREATE PARTY
      </div>
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: SIZES.spacing * 2 }}>
        <div>
          <label style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            color: COLORS.textSecondary,
            display: 'block',
            marginBottom: 4,
          }}>PARTY NAME</label>
          <PixelInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dragon Slayers"
          />
        </div>
        {error && (
          <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontXs, color: COLORS.fireRed, textAlign: 'center' }}>
            {error}
          </div>
        )}
        <PixelButton variant="gold" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'FORGING...' : 'CREATE PARTY'}
        </PixelButton>
      </form>
    </PixelCard>
  );
}
