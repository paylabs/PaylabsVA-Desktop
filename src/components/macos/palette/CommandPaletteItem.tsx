/**
 * @file CommandPaletteItem.tsx
 * @description Komponen baris aksi individu di dalam daftar Command Palette.
 */

import React from 'react';
import { CommandItem } from './commandPaletteItems';

export interface CommandPaletteItemProps {
  item: CommandItem;
  isSelected: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
}

/**
 * Baris item perintah Spotlight
 */
export const CommandPaletteItem: React.FC<CommandPaletteItemProps> = ({
  item,
  isSelected,
  onSelect,
  onMouseEnter,
}) => (
  <button
    type="button"
    className={`macos-command-item ${isSelected ? 'is-selected' : ''}`}
    onClick={onSelect}
    onMouseEnter={onMouseEnter}
  >
    <div className="macos-command-item-left">
      <div className="macos-command-icon-wrapper">
        {item.icon}
      </div>
      <div>
        <div className="macos-command-item-title">{item.title}</div>
        <div className="macos-command-item-category">{item.category}</div>
      </div>
    </div>
    <div className="macos-command-item-right">
      {item.shortcutHint && <span className="macos-kbd">{item.shortcutHint}</span>}
      {isSelected && (
        <span className="macos-command-action-hint">
          <span>Pilih</span>
          <span className="macos-kbd" style={{ fontSize: 10 }}>↵</span>
        </span>
      )}
    </div>
  </button>
);
