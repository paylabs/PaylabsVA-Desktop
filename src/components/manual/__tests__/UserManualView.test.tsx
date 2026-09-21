/**
 * @file UserManualView.test.tsx
 * @description Unit test untuk UserManualView guna memverifikasi rendering dokumentasi SNAP
 *   bebas AI slop, kelengkapan 9 bab teknis, tabel spesifikasi, dan interaksi daftar isi.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserManualView } from '../UserManualView';

describe('UserManualView Component', () => {
  it('should_render_formal_header_without_ai_slop_emojis', () => {
    // Arrange & Act
    render(<UserManualView />);

    // Assert - Header formal tanpa emoji informal
    expect(screen.getByText('Dokumentasi Operasional Paylabs VA')).toBeInTheDocument();
    expect(screen.getByText('Standar SNAP BI')).toBeInTheDocument();
    expect(screen.getByText('Tauri v2 Native')).toBeInTheDocument();
    expect(screen.queryByText('Download PDF')).not.toBeInTheDocument();
  });

  it('should_render_all_9_chapters_in_table_of_contents_and_sections', () => {
    // Arrange & Act
    render(<UserManualView />);

    // Assert - 9 Bab lengkap di Daftar Isi
    expect(screen.getByText('Daftar Isi Dokumentasi')).toBeInTheDocument();
    expect(screen.getByText('Arsitektur & Lingkungan')).toBeInTheDocument();
    expect(screen.getByText('Kredensial & Autentikasi')).toBeInTheDocument();
    expect(screen.getByText('Konfigurasi Endpoint')).toBeInTheDocument();
    expect(screen.getByText('Spesifikasi Pembuatan VA')).toBeInTheDocument();
    expect(screen.getByText('Monitoring & Audit Riwayat')).toBeInTheDocument();
    expect(screen.getByText('Spotlight Command Palette')).toBeInTheDocument();
    expect(screen.getByText('Sistem Desain & Tampilan')).toBeInTheDocument();
    expect(screen.getByText('Pintasan Keyboard Native')).toBeInTheDocument();
    expect(screen.getByText('Status Respon & Diagnostik')).toBeInTheDocument();
  });

  it('should_render_technical_snap_tables_and_response_codes', () => {
    // Arrange & Act
    render(<UserManualView />);

    // Assert - Field parameter SNAP terstandarisasi
    expect(screen.getByText('partnerServiceId')).toBeInTheDocument();
    expect(screen.getByText('customerNo')).toBeInTheDocument();
    expect(screen.getByText('virtualAccountName')).toBeInTheDocument();
    expect(screen.getByText('virtualAccountPhone')).toBeInTheDocument();

    // Assert - Kode respon resmi SNAP BI
    expect(screen.getByText('2002700')).toBeInTheDocument();
    expect(screen.getByText('4002700')).toBeInTheDocument();
    expect(screen.getByText('4012700')).toBeInTheDocument();
    expect(screen.getByText('4042700')).toBeInTheDocument();
    expect(screen.getByText('5002700')).toBeInTheDocument();
  });

  it('should_invoke_scrollIntoView_when_toc_item_is_clicked', () => {
    // Arrange
    const scrollMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollMock;

    render(<UserManualView />);

    // Act - Klik bab "Kredensial & Autentikasi" di TOC
    const tocItem = screen.getByRole('button', { name: /02.*Kredensial & Autentikasi/i });
    fireEvent.click(tocItem);

    // Assert
    expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });
});
