import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import PixelButton from '../components/ui/PixelButton';
import PixelInput from '../components/ui/PixelInput';
import PixelCard from '../components/ui/PixelCard';
import { COLORS, FONTS, SIZES } from '../styles/theme';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (username.trim().length < 2) {
      setError('Name must be 2+ characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be 6+ characters');
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        displayName: username.trim(),
        email: email,
        hp: 50,
        maxHp: 50,
        xp: 0,
        level: 1,
        gold: 0,
        partyId: null,
        lastCron: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (err.code === 'auth/weak-password') {
        setError('Password too weak');
      } else {
        setError('Registration failed');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.bgDarkest,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SIZES.spacing * 2,
    }}>
      <div style={{ fontSize: 48, marginBottom: SIZES.spacing * 2 }}>🗡️</div>
      <h1 style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontLg,
        color: COLORS.gold,
        marginBottom: SIZES.spacing,
        textAlign: 'center',
      }}>
        CREATE CHARACTER
      </h1>
      <p style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
        marginBottom: SIZES.spacing * 4,
        letterSpacing: 2,
      }}>
        BEGIN YOUR QUEST
      </p>

      <PixelCard style={{ maxWidth: 380, width: '100%' }}>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: SIZES.spacing * 2 }}>
          <div>
            <label style={{
              fontFamily: FONTS.pixel,
              fontSize: SIZES.fontXs,
              color: COLORS.textSecondary,
              display: 'block',
              marginBottom: 4,
            }}>HERO NAME</label>
            <PixelInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="DragonSlayer"
            />
          </div>

          <div>
            <label style={{
              fontFamily: FONTS.pixel,
              fontSize: SIZES.fontXs,
              color: COLORS.textSecondary,
              display: 'block',
              marginBottom: 4,
            }}>EMAIL</label>
            <PixelInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@quest.com"
            />
          </div>

          <div>
            <label style={{
              fontFamily: FONTS.pixel,
              fontSize: SIZES.fontXs,
              color: COLORS.textSecondary,
              display: 'block',
              marginBottom: 4,
            }}>PASSWORD</label>
            <PixelInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6+ characters"
            />
          </div>

          {error && (
            <div style={{
              fontFamily: FONTS.pixel,
              fontSize: SIZES.fontXs,
              color: COLORS.fireRed,
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <PixelButton
            variant="gold"
            disabled={loading}
            style={{ width: '100%', padding: `${SIZES.spacing * 1.5}px 0` }}
          >
            {loading ? 'FORGING...' : 'FORGE CHARACTER'}
          </PixelButton>
        </form>

        <div style={{
          marginTop: SIZES.spacing * 2,
          textAlign: 'center',
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
        }}>
          <span style={{ color: COLORS.textMuted }}>Veteran? </span>
          <Link to="/login" style={{ color: COLORS.neonCyan, textDecoration: 'none' }}>
            LOG IN
          </Link>
        </div>
      </PixelCard>
    </div>
  );
}
