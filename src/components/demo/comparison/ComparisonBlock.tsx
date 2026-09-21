/**
 * @file ComparisonBlock.tsx
 * @description Komponen kartu komparasi checklist kepatuhan desain platform (macOS, iOS, Windows).
 */

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface ComparisonBlockProps {
  title: string;
  icon?: React.ReactNode;
  accentColor?: string;
  items: readonly string[];
}

/**
 * Blok kartu komparasi per platform
 */
export const ComparisonBlock: React.FC<ComparisonBlockProps> = ({
  title,
  icon,
  accentColor = 'var(--accent-secondary)',
  items,
}) => (
  <div className="comparison-card">
    <div className="comparison-card-header">
      {icon}
      <h3 className="comparison-card-title">{title}</h3>
    </div>
    <ul className="comparison-card-list">
      {items.map((item) => (
        <li key={item} className="comparison-card-item">
          <span style={{ flexShrink: 0, marginTop: 2, display: 'inline-flex' }}>
            <CheckCircle2 size={15} color={accentColor} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
