/**
 * @file MarkdownRenderer.tsx
 * @description Komponen parser & renderer Markdown ringan tanpa dependensi eksternal,
 * aman dari XSS (merender elemen React asli), dan bergaya Apple HIG.
 */

import React from 'react';

export interface MarkdownRendererProps {
  content?: string;
  className?: string;
}

/**
 * Render teks inline dengan parsing bold (**teks**) dan inline code (`teks`)
 */
function renderInlineText(text: string): React.ReactNode {
  // Regex untuk memecah teks berdasarkan `inline code` dan **bold**
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return tokens.map((token, idx) => {
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code key={idx} className="md-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong key={idx} className="md-bold">
          {token.slice(2, -2)}
        </strong>
      );
    }
    return token;
  });
}

/**
 * Render baris blok kode (```lang ... ```)
 */
function renderCodeBlock(lines: string[], key: number): React.ReactNode {
  return (
    <pre key={key} className="md-code-block">
      <code>{lines.join('\n')}</code>
    </pre>
  );
}

/**
 * Parsing konten markdown baris demi baris menjadi elemen React
 */
function parseMarkdownToElements(raw: string): React.ReactNode[] {
  const lines = raw.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="md-list">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Toggle Code Block
    if (trimmed.startsWith('```')) {
      flushList();
      if (inCodeBlock) {
        elements.push(renderCodeBlock(codeBuffer, idx));
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // List item (-, *, •)
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, '');
      currentList.push(
        <li key={`li-${idx}`} className="md-list-item">
          {renderInlineText(itemText)}
        </li>
      );
      return;
    }

    // Bukan list item, flush list yang sedang terkumpul
    flushList();

    if (!trimmed) {
      return;
    }

    // Heading 1-4
    if (trimmed.startsWith('#### ')) {
      elements.push(<h5 key={idx} className="md-h4">{renderInlineText(trimmed.slice(5))}</h5>);
    } else if (trimmed.startsWith('### ')) {
      elements.push(<h4 key={idx} className="md-h3">{renderInlineText(trimmed.slice(4))}</h4>);
    } else if (trimmed.startsWith('## ')) {
      elements.push(<h3 key={idx} className="md-h2">{renderInlineText(trimmed.slice(3))}</h3>);
    } else if (trimmed.startsWith('# ')) {
      elements.push(<h2 key={idx} className="md-h1">{renderInlineText(trimmed.slice(2))}</h2>);
    } else {
      // Paragraf biasa
      elements.push(
        <p key={idx} className="md-paragraph">
          {renderInlineText(trimmed)}
        </p>
      );
    }
  });

  flushList();
  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(renderCodeBlock(codeBuffer, lines.length));
  }

  return elements;
}

/**
 * Komponen Renderer Markdown
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content = '',
  className = '',
}) => {
  if (!content.trim()) {
    return <div className="text-subtle text-xs italic">Tidak ada catatan rilis.</div>;
  }

  return (
    <div className={`macos-markdown-body ${className}`}>
      {parseMarkdownToElements(content)}
    </div>
  );
};
