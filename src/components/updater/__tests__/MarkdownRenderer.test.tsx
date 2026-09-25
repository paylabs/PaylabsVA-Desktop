/**
 * @file MarkdownRenderer.test.tsx
 * @description Unit test untuk komponen MarkdownRenderer (Apple HIG typography).
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownRenderer } from '../MarkdownRenderer';

describe('MarkdownRenderer Component', () => {
  it('should_render_fallback_when_content_is_empty', () => {
    // Arrange & Act
    render(<MarkdownRenderer content="" />);

    // Assert
    expect(screen.getByText('Tidak ada catatan rilis.')).toBeDefined();
  });

  it('should_render_headings_and_paragraphs_properly', () => {
    // Arrange
    const content = `
# Judul Rilis Utama
## Subjudul Fitur
### Poin Penting
Ini adalah paragraf penjelasan singkat mengenai pembaruan.
    `;

    // Act
    render(<MarkdownRenderer content={content} />);

    // Assert
    expect(screen.getByText('Judul Rilis Utama')).toBeDefined();
    expect(screen.getByText('Subjudul Fitur')).toBeDefined();
    expect(screen.getByText('Poin Penting')).toBeDefined();
    expect(screen.getByText(/Ini adalah paragraf penjelasan singkat/i)).toBeDefined();
  });

  it('should_render_bullet_lists_correctly', () => {
    // Arrange
    const content = `
- Fitur StaticMandiriVA
- In-App Auto-Update
- Perbaikan UI Banner
    `;

    // Act
    render(<MarkdownRenderer content={content} />);

    // Assert
    expect(screen.getByText('Fitur StaticMandiriVA')).toBeDefined();
    expect(screen.getByText('In-App Auto-Update')).toBeDefined();
    expect(screen.getByText('Perbaikan UI Banner')).toBeDefined();
  });

  it('should_render_bold_and_inline_code_tokens', () => {
    // Arrange
    const content = 'Gunakan token **Mod** atau `Ctrl` di Windows.';

    // Act
    render(<MarkdownRenderer content={content} />);

    // Assert
    const boldEl = screen.getByText('Mod');
    expect(boldEl.tagName.toLowerCase()).toBe('strong');

    const codeEl = screen.getByText('Ctrl');
    expect(codeEl.tagName.toLowerCase()).toBe('code');
  });

  it('should_render_fenced_code_blocks', () => {
    // Arrange
    const content = '```bash\nsudo xattr -cr "/Applications/Paylabs VA.app"\n```';

    // Act
    const { container } = render(<MarkdownRenderer content={content} />);

    // Assert
    const preEl = container.querySelector('pre');
    expect(preEl).not.toBeNull();
    expect(preEl?.textContent).toContain('sudo xattr -cr');
  });
});
