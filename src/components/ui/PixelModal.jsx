import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../../styles/theme';

export default function PixelModal({ children, onClose, title }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: SIZES.spacing * 2,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: COLORS.bgDark,
          padding: SIZES.spacing * 3,
          maxWidth: 440,
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          ...PIXEL_BORDER,
        }}
      >
        {title && (
          <div style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontLg,
            color: COLORS.gold,
            marginBottom: SIZES.spacing * 2,
            textAlign: 'center',
          }}>
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
