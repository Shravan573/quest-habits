import { useState } from 'react';
import PixelCard from '../ui/PixelCard';
import { COLORS, FONTS, SIZES } from '../../styles/theme';

export default function InviteCode({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PixelCard style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
        color: COLORS.textSecondary,
        marginBottom: SIZES.spacing,
      }}>
        INVITE CODE
      </div>
      <div
        onClick={handleCopy}
        style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontTitle,
          color: COLORS.neonCyan,
          letterSpacing: 8,
          padding: SIZES.spacing * 2,
          backgroundColor: COLORS.bgDarkest,
          border: `2px solid ${COLORS.neonCyan}`,
          cursor: 'pointer',
          marginBottom: SIZES.spacing,
          textShadow: `0 0 10px ${COLORS.neonCyan}`,
        }}
      >
        {code}
      </div>
      <div style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
        color: copied ? COLORS.neonGreen : COLORS.textMuted,
      }}>
        {copied ? 'COPIED!' : 'CLICK TO COPY'}
      </div>
    </PixelCard>
  );
}
