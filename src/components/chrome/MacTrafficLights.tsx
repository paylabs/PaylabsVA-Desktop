import React from 'react';
import { Tooltip } from '../ui/Tooltip';

interface MacTrafficLightsProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

/**
 * Komponen 3 tombol traffic light macOS (Merah, Kuning, Hijau) dengan hover native
 */
export const MacTrafficLights: React.FC<MacTrafficLightsProps> = ({
  onClose,
  onMinimize,
  onMaximize,
}) => {
  return (
    <div className="mac-traffic-lights-container no-drag">
      <Tooltip content="Tutup" shortcut="⌘W" position="bottom" align="start" delay={300}>
        <button
          type="button"
          className="mac-traffic-light close"
          onClick={onClose}
          aria-label="Tutup Window"
        >
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
            <path d="M3.5 3.5L8.5 8.5M8.5 3.5L3.5 8.5" stroke="#4d0000" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </Tooltip>

      <Tooltip content="Minimalkan" shortcut="⌘M" position="bottom" align="start" delay={300}>
        <button
          type="button"
          className="mac-traffic-light minimize"
          onClick={onMinimize}
          aria-label="Minimalkan Window"
        >
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
            <path d="M2.5 6H9.5" stroke="#704800" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      </Tooltip>

      <Tooltip content="Maksimalkan / Layar Penuh" position="bottom" align="start" delay={300}>
        <button
          type="button"
          className="mac-traffic-light maximize"
          onClick={onMaximize}
          aria-label="Maksimalkan Window"
        >
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
            <path d="M3.2 8.5V5.8L6.2 8.8L3.2 8.5ZM8.8 3.5V6.2L5.8 3.2L8.8 3.5Z" fill="#004d00" />
          </svg>
        </button>
      </Tooltip>
    </div>
  );
};
