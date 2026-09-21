/**
 * @file IosSwitch.tsx
 * @description Komponen Toggle Switch native Apple iOS dengan warna aktif hijau #34c759 dan animasi spring.
 */

import React from 'react';

export interface IosSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

/**
 * Komponen Saklar iOS HIG (Apple Green Switch)
 */
export const IosSwitch: React.FC<IosSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  'aria-label': ariaLabel = 'Toggle Switch',
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`ios-switch ${checked ? 'is-active' : ''}`}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <span className="ios-switch-thumb" />
    </button>
  );
};
