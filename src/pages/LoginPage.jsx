import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import PixelButton from '../components/ui/PixelButton';
import PixelInput from '../components/ui/PixelInput';
import PixelCard from '../components/ui/PixelCard';
import { COLORS, FONTS, SIZES } from '../styles/theme';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.code === 'auth/invalid-credential'
        ? 'Wrong email or password'
        : 'Login failed. Try again.');
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
      <div style={{ fontSize: 48, marginBottom: SIZES.spacing * 2 }}>⚔️</div>
      <h1 style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXl,
        color: COLORS.gold,
        marginBottom: SIZES.spacing,
        textAlign: 'center',
      }}>
        QUEST HABITS
      </h1>
      <p style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
        marginBottom: SIZES.spacing * 4,
        letterSpacing: 2,
      }}>
        SLAY YOUR HABITS
      </p>

      <PixelCard style={{ maxWidth: 380, width: '100%' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: SIZES.spacing * 2 }}>
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
              placeholder="********"
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
            {loading ? 'ENTERING...' : 'ENTER DUNGEON'}
          </PixelButton>
        </form>

        <div style={{
          marginTop: SIZES.spacing * 2,
          textAlign: 'center',
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
        }}>
          <span style={{ color: COLORS.textMuted }}>New hero? </span>
          <Link to="/register" style={{ color: COLORS.neonCyan, textDecoration: 'none' }}>
            CREATE CHARACTER
          </Link>
        </div>
      </PixelCard>
    </div>
  );
}
