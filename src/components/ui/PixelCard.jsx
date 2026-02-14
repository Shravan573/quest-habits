import { CARD_STYLE } from '../../styles/theme';

export default function PixelCard({ children, style }) {
  return (
    <div style={{ ...CARD_STYLE, ...style }}>
      {children}
    </div>
  );
}
