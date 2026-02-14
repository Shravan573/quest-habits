import { useAuthContext } from '../contexts/AuthContext';
import { usePartyContext } from '../contexts/PartyContext';
import CreateParty from '../components/party/CreateParty';
import JoinParty from '../components/party/JoinParty';
import InviteCode from '../components/party/InviteCode';
import PartyMembers from '../components/party/PartyMembers';
import PixelButton from '../components/ui/PixelButton';
import PixelCard from '../components/ui/PixelCard';
import { COLORS, FONTS, SIZES } from '../styles/theme';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function PartyPage() {
  const { user, profile } = useAuthContext();
  const { party, loading, leaveParty, startBoss } = usePartyContext();

  const handleLeave = async () => {
    if (!user) return;
    await leaveParty(user.uid);
  };

  const handleLogout = async () => {
    await signOut(auth);
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

  // No party — show create/join options
  if (!party) {
    return (
      <div style={{ padding: SIZES.spacing * 2, display: 'flex', flexDirection: 'column', gap: SIZES.spacing * 2 }}>
        <div style={{
          textAlign: 'center',
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontLg,
          color: COLORS.gold,
          marginBottom: SIZES.spacing,
        }}>
          👥 PARTY
        </div>
        <div style={{
          textAlign: 'center',
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
          color: COLORS.textSecondary,
          marginBottom: SIZES.spacing * 2,
        }}>
          Join forces to slay bosses together!
        </div>
        <CreateParty />
        <div style={{
          textAlign: 'center',
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
          color: COLORS.textMuted,
          padding: `${SIZES.spacing}px 0`,
        }}>
          — OR —
        </div>
        <JoinParty />

        {/* Logout */}
        <div style={{ marginTop: SIZES.spacing * 4, textAlign: 'center' }}>
          <PixelButton variant="ghost" onClick={handleLogout}>
            LOGOUT
          </PixelButton>
        </div>
      </div>
    );
  }

  // In a party
  return (
    <div style={{ padding: SIZES.spacing * 2, display: 'flex', flexDirection: 'column', gap: SIZES.spacing * 2 }}>
      {/* Party Header */}
      <PixelCard style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontLg,
          color: COLORS.gold,
          marginBottom: 4,
        }}>
          ⚔️ {party.name}
        </div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
          color: COLORS.textMuted,
        }}>
          {party.memberIds.length} member{party.memberIds.length !== 1 ? 's' : ''}
           · Boss Level {party.bossLevel}
        </div>
      </PixelCard>

      {/* Invite Code */}
      <InviteCode code={party.inviteCode} />

      {/* Start Boss Button (if no active boss) */}
      {!party.activeBoss && (
        <PixelButton
          variant="gold"
          onClick={startBoss}
          style={{ width: '100%', padding: `${SIZES.spacing * 2}px 0`, fontSize: SIZES.fontMd }}
        >
          🐉 SUMMON BOSS
        </PixelButton>
      )}

      {/* Members */}
      <div style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        marginTop: SIZES.spacing,
      }}>
        PARTY MEMBERS
      </div>
      <PartyMembers members={party.members} leaderId={party.leaderId} />

      {/* Leave Party */}
      <div style={{ marginTop: SIZES.spacing * 2 }}>
        <PixelButton variant="danger" onClick={handleLeave} style={{ width: '100%' }}>
          LEAVE PARTY
        </PixelButton>
      </div>

      {/* Logout */}
      <div style={{ marginTop: SIZES.spacing, textAlign: 'center' }}>
        <PixelButton variant="ghost" onClick={handleLogout}>
          LOGOUT
        </PixelButton>
      </div>
    </div>
  );
}
