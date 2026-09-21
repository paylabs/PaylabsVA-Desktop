/**
 * @file CustomSelect.tsx
 * @description Komponen Custom Select Dropdown desktop yang rounded dan beranimasi mulus dengan fitur pencarian real-time (searchable).
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  'aria-label'?: string;
  /** Mengaktifkan input pencarian opsi di dalam popover dropdown */
  searchable?: boolean;
  /** Placeholder teks untuk input pencarian (default: 'Cari opsi...') */
  searchPlaceholder?: string;
  /** Menandakan apakah input memiliki status error validasi */
  hasError?: boolean;
}

/**
 * Filter opsi select berdasarkan query pencarian (case-insensitive)
 */
function filterSelectOptions(options: readonly SelectOption[], query: string): SelectOption[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [...options];
  return options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(normalized) ||
      opt.value.toLowerCase().includes(normalized)
  );
}

/**
 * Komponen Custom Select Dropdown Universal dengan Dukungan Pencarian
 */
export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  disabled = false,
  'aria-label': ariaLabel = 'Dropdown selector',
  searchable = false,
  searchPlaceholder = 'Cari...',
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = useMemo(
    () => filterSelectOptions(options, searchQuery),
    [options, searchQuery]
  );

  const toggleOpen = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < 260 && spaceAbove > spaceBelow);
      setSearchQuery('');
      setFocusedIndex(0);
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && searchable) {
      // Fokus otomatis ke input pencarian saat popover terbuka
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyboardNavigation(e, {
      isOpen,
      setIsOpen,
      optionsLength: filteredOptions.length,
      focusedIndex,
      setFocusedIndex,
      onSelect: () => {
        if (filteredOptions[focusedIndex]) {
          onChange(filteredOptions[focusedIndex].value);
          setIsOpen(false);
        }
      },
    });
  };

  return (
    <div ref={containerRef} className="custom-select-wrapper" onKeyDown={handleKeyDown}>
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? 'is-open' : ''} ${hasError ? 'is-invalid' : ''}`}
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {selectedOption?.icon}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform var(--transition-fast)',
            color: 'var(--text-tertiary)',
          }}
        />
      </button>

      {isOpen && (
        <div
          className={`custom-select-popover ${openUpward ? 'open-upward' : ''}`}
          role="listbox"
          aria-label={ariaLabel}
        >
          {searchable && (
            <div className="custom-select-search-container" onClick={(e) => e.stopPropagation()}>
              <Search size={13} className="custom-select-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="custom-select-search-input"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFocusedIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
                    handleKeyDown(e);
                  } else if (e.key === 'Escape') {
                    e.stopPropagation();
                    setIsOpen(false);
                  }
                }}
                aria-label={searchPlaceholder}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="custom-select-search-clear"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Bersihkan pencarian"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          <div className="custom-select-options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isFocused = idx === focusedIndex;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`custom-select-option ${isSelected ? 'is-active' : ''} ${isFocused ? 'is-focused' : ''}`}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      {opt.icon}
                      <span>{opt.label}</span>
                    </span>
                    {isSelected && <Check size={14} color="var(--accent-primary)" />}
                  </button>
                );
              })
            ) : (
              <div className="custom-select-empty">
                <span>Tidak ada pilihan yang cocok</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface KeyNavParams {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  optionsLength: number;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  onSelect: () => void;
}

/**
 * Helper navigasi keyboard untuk CustomSelect
 */
function handleKeyboardNavigation(e: React.KeyboardEvent, p: KeyNavParams) {
  if (p.optionsLength === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!p.isOpen) p.setIsOpen(true);
    else p.setFocusedIndex((prev) => (prev + 1) % p.optionsLength);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (!p.isOpen) p.setIsOpen(true);
    else p.setFocusedIndex((prev) => (prev - 1 + p.optionsLength) % p.optionsLength);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (p.isOpen) p.onSelect();
    else p.setIsOpen(true);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    p.setIsOpen(false);
  }
}
