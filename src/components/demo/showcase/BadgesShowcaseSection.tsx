/**
 * @file BadgesShowcaseSection.tsx
 * @description Bagian demonstrasi status badges, tags, dan indicators solid.
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

/**
 * Section demonstrasi badges status
 */
export const BadgesShowcaseSection: React.FC = () => (
  <div className="comparison-container">
    <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>
      Status Badges &amp; Tags
    </h2>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999, backgroundColor: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        Primary Active
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999, backgroundColor: 'rgba(34, 197, 94, 0.12)', color: 'var(--accent-success)', border: '1px solid rgba(34, 197, 94, 0.25)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <CheckCircle2 size={12} />
        <span>Verified Stable</span>
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999, backgroundColor: 'rgba(234, 179, 8, 0.12)', color: 'var(--accent-warning)', border: '1px solid rgba(234, 179, 8, 0.25)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <AlertTriangle size={12} />
        <span>Pending Review</span>
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999, backgroundColor: 'rgba(2, 132, 199, 0.12)', color: 'var(--accent-secondary)', border: '1px solid rgba(2, 132, 199, 0.25)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Info size={12} />
        <span>Modular Architecture</span>
      </span>
    </div>
  </div>
);
