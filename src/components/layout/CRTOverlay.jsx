export default function CRTOverlay() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999,
      background: `repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.12) 0px,
        rgba(0, 0, 0, 0.12) 1px,
        transparent 1px,
        transparent 3px
      )`,
      boxShadow: 'inset 0 0 120px rgba(0,0,0,0.4)',
    }} />
  );
}
