/**
 * @file InfoCard.tsx
 * @description Komponen kartu ringkasan status platform overview.
 */

import React from 'react';

export interface InfoCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

/**
 * Kartu metrik platform individual
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  icon,
  description,
}) => (
  <div
    style={{
      background: 'var(--bg-surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-card)',
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-card)',
    }}
  >
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</span>
        {icon}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', lineHeight: 1.4, wordBreak: 'break-word' }}>
      {description}
    </div>
  </div>
);
