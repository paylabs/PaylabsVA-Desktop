/**
 * @file Sidebar.tsx
 * @description Komponen sidebar navigasi modern dan konsisten untuk desktop workspace dengan dukungan mode responsif/collapsible.
 */

import React from 'react';
import {
  CreditCard,
  History,
  ChevronLeft,
  ChevronRight,
  Compass,
  BookOpen,
  Layers,
} from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export type ActiveTab = 'va-generator' | 'static-va' | 'va-history' | 'user-manual';

export interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  /** Callback untuk memulai onboarding tour */
  onStartTour?: () => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: 'va-generator', label: 'Dynamic VA', icon: <CreditCard size={18} /> },
  { id: 'static-va', label: 'Static VA', icon: <Layers size={18} /> },
  { id: 'va-history', label: 'Riwayat VA', icon: <History size={18} /> },
  { id: 'user-manual', label: 'Panduan', icon: <BookOpen size={18} /> },
];



/**
 * Komponen Navigasi Sidebar Responsif Desktop
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed = false,
  onToggleCollapse,
  onStartTour,
}) => {
  return (
    <aside className={`app-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div className="sidebar-header-row">
          <span
            className="sidebar-header-label"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
            }}
          >
            Navigation
          </span>
          {onToggleCollapse && (
            <Tooltip
              content={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
              position="right"
              delay={150}
            >
              <button
                type="button"
                className="sidebar-toggle-btn"
                onClick={onToggleCollapse}
                aria-label={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </Tooltip>
          )}
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const navButton = (
            <button
              id={`sidebar-nav-${item.id}`}
              type="button"
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
              aria-label={item.label}
            >
              <span
                className="sidebar-nav-icon"
                style={{
                  color: isActive ? 'var(--accent-primary)' : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <span className="sidebar-nav-label">{item.label}</span>
            </button>
          );

          return isCollapsed ? (
            <Tooltip key={item.id} content={item.label} position="right" delay={150}>
              {navButton}
            </Tooltip>
          ) : (
            <React.Fragment key={item.id}>
              {navButton}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
        {(() => {
          const tourButton = (
            <button
              type="button"
              className="sidebar-nav-item tour-trigger-btn"
              onClick={onStartTour}
              aria-label="Take a Tour"
            >
              <span
                className="sidebar-nav-icon"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                }}
              >
                <Compass size={18} />
              </span>
              <span className="sidebar-nav-label">Take a Tour</span>
            </button>
          );

          return isCollapsed ? (
            <Tooltip content="Take a Tour" position="right" delay={150}>
              {tourButton}
            </Tooltip>
          ) : (
            tourButton
          );
        })()}
      </div>
    </aside>
  );
};
