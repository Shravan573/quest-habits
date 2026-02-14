import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../../styles/theme';

const TABS = [
  { key: 'habits', label: 'HABITS', icon: '🔄' },
  { key: 'dailies', label: 'DAILIES', icon: '📅' },
  { key: 'todos', label: 'TO-DOS', icon: '✅' },
];

export default function TaskTabs({ activeTab, onTabChange }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: SIZES.spacing * 2 }}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={{
            flex: 1,
            padding: `${SIZES.spacing}px 0`,
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            border: `${SIZES.borderWidth}px solid ${activeTab === tab.key ? COLORS.neonGreen : COLORS.border}`,
            backgroundColor: activeTab === tab.key ? 'rgba(57, 255, 20, 0.1)' : COLORS.bgDark,
            color: activeTab === tab.key ? COLORS.neonGreen : COLORS.textMuted,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <span style={{ fontSize: 16 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
