/**
 * @file ArchitectureSection.tsx
 * @description Tab Architecture untuk menjelaskan keamanan IPC, arsitektur Tauri v2, dan integrasi Rust-React.
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface ArchPoint {
  title: string;
  desc: string;
}

const ARCH_POINTS: readonly ArchPoint[] = [
  {
    title: 'Zero Web Overhead',
    desc: 'Backend Rust murni menggunakan Webview native (WebKit di macOS, WebView2 di Windows) tanpa Chromium bundler yang berat.',
  },
  {
    title: 'Isolated Safe IPC',
    desc: 'Komunikasi antara frontend React dan sistem operasi dibatasi oleh allowlist IPC Tauri yang ketat tanpa akses langsung ke Node.js runtime.',
  },
  {
    title: 'Native Window Dragging',
    desc: 'Penggeseran jendela dilakukan melalui instruksi IPC start_dragging_window di level kernel OS untuk performa 60 FPS bebas stutter.',
  },
];

/**
 * Tab Architecture & Safe IPC Overview
 */
export const ArchitectureSection: React.FC = () => (
  <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: 20 }}>
    <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <ShieldCheck size={18} color="var(--accent-success)" />
      <span>Arsitektur & Keamanan Desktop (Tauri v2 + React)</span>
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
      {ARCH_POINTS.map((pt) => (
        <div
          key={pt.title}
          style={{
            padding: 14,
            background: 'var(--bg-surface-2)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            {pt.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {pt.desc}
          </div>
        </div>
      ))}
    </div>
  </div>
);
