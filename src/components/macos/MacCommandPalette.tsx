/**
 * @file MacCommandPalette.tsx
 * @description Komponen Command Palette modal mengambang bergaya macOS Spotlight/Raycast (pencarian aksi terpusat).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { ActiveTab } from '../layout/Sidebar';
import {

  buildCommandItems,
  filterCommands,
} from './palette/commandPaletteItems';
import { CommandPaletteItem } from './palette/CommandPaletteItem';
import { CommandPaletteFooter } from './palette/CommandPaletteFooter';

import { HistoryRecord } from '../../types/paylabs';

export type { CommandItem } from './palette/commandPaletteItems';

export interface MacCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSettings?: () => void;
  onToggleTheme: () => void;
  history?: readonly HistoryRecord[];
  onSelectHistoryRecord?: (record: HistoryRecord) => void;
}

/**
 * Komponen Command Palette macOS Spotlight
 */
export const MacCommandPalette: React.FC<MacCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenSettings,
  onToggleTheme,
  history,
  onSelectHistoryRecord,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = buildCommandItems({
    onSelectTab,
    onOpenSettings,
    onToggleTheme,
    history,
    onSelectHistoryRecord,
  });


  const filtered = filterCommands(commands, query);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].perform();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="macos-command-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      data-testid="command-palette-backdrop"
    >
      <div className="macos-command-modal">
        <div className="macos-command-header">
          <Search size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            className="macos-command-input"
            placeholder="Cari aksi, navigasi, atau fitur..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            aria-label="Input pencarian perintah"
          />
          <span className="macos-kbd" style={{ fontSize: 10, padding: '2px 7px' }}>ESC</span>
        </div>

        <div className="macos-command-body">
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
              Tidak ada aksi yang sesuai dengan "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => (
              <CommandPaletteItem
                key={item.id}
                item={item}
                isSelected={idx === selectedIndex}
                onSelect={() => {
                  item.perform();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              />
            ))
          )}
        </div>

        <CommandPaletteFooter />
      </div>
    </div>
  );
};
