import { useState } from 'react';
import { INPUT_BASE, COLORS } from '../../styles/theme';

export default function PixelInput({ value, onChange, placeholder, type = 'text', style }) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...INPUT_BASE,
        borderColor: focused ? COLORS.neonGreen : COLORS.border,
        ...style,
      }}
    />
  );
}
