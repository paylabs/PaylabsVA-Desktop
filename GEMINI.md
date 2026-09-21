# 🎯 Antigravity Desktop Project Guidelines

Pedoman dan standar pengembangan untuk aplikasi desktop **Antigravity Desktop** berbasis **Tauri v2 + React TypeScript**.

---

## 🛠️ Tech Stack & Konvensi

- **Desktop Framework**: Tauri v2 (Rust backend, Safe IPC architecture)
- **Frontend Core**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS Variables & Design Tokens terpusat (`src/styles/tokens.css`)
- **Testing**: Vitest + React Testing Library (pola AAA)

---

## 📐 Standar Desain & UX Lintas Platform (Windows & macOS)

Semua pengembangan fitur visual wajib mengikuti aturan di [`.agents/rules/tauri-styling.md`](file:///c:/project/antigravity/.agents/rules/tauri-styling.md):

1. **Kanvas & Frame**:
   - `decorations: false`, `transparent: true`, `shadow: false` di `tauri.conf.json`.
   - Sudut jendela membulat `border-radius: 12px;` dengan border tipis halus `border: 1px solid var(--border-subtle)`.
   - Konten 100% solid opaque tanpa blur transparan pada container utama.
2. **Titlebar Adaptif**:
   - macOS: Traffic lights (🔴🟡🟢) di kiri atas dengan hover SVG mikro Apple HIG.
   - Windows: Fluent controls di kanan atas dengan close hover merah `#e81123`.
   - Native drag via IPC `start_dragging_window` + double click maximize.
3. **Shortcuts & Proteksi**:
   - Abstraksi token `Mod` (`⌘` untuk macOS, `Ctrl` untuk Windows).
   - Disabled right-click context menu webview untuk pengalaman software native desktop.
4. **Tema & Data Persistence**:
   - Light/Dark mode tersimpan persisten di `localStorage` dengan key `antigravity_desktop_theme`.
5. **Konsistensi Window Chrome & Controls**:
   - Seluruh action controls di titlebar (Search pill, Theme toggle, Style switcher) wajib memiliki tinggi tetap yang seragam `26px` (`--titlebar-btn-height`) bebas glitch lonjakan tinggi saat beralih tema (Light/Dark mode).
6. **Zero-Shadow Popovers & macOS Toast Banner**:
   - Dropdown select, popover, dan tooltip wajib bebas bayangan (`box-shadow: none !important;`) untuk mencegah overlap dengan outline melengkung jendela desktop 12px.
   - Toast notification mengadopsi standar Apple Notification Banner di kanan atas (*top-right*) dengan translucency `blur(24px)`, squircle icon 32x32px, dan tombol close bulat mikro.
7. **Sidebar Collapsible Zero-Shift Geometry**:
   - Ikon menu wajib terkunci absolut di koordinat X yang sama (`21px`) tanpa pergeseran horizontal (`justify-content: flex-start` konstan, padding kiri tetap).
   - Tombol saat collapsed menyusut menjadi bujur sangkar `38px x 38px` (*icon-only*).
   - Margin sidebar saat collapsed wajib simetris identik `12px` di semua sisi (atas, bawah, kiri, kanan).
   - Staged transition: teks memudar hilang duluan sebelum collapse menciut, dan saat expand melebar penuh duluan baru teks meluncur masuk secara halus.
8. **MCP Server Tauri Bridge (`tauri-plugin-mcp-bridge`)**:
   - Plugin MCP bridge aktif secara eksklusif pada mode debug (`#[cfg(debug_assertions)]`) dan terikat ke `127.0.0.1` (*localhost only*).
   - Menyediakan automasi UI, monitoring IPC real-time, window state, dan console logging untuk AI assistant tanpa mencemari build rilis produksi.
   - Eksekusi cepat via `npm run tauri:mcp` (`npx -y @hypothesi/tauri-mcp-server`).

---

## 📚 Skill Terkait

Gunakan skill [`.agents/skills/tauri-desktop-style/SKILL.md`](file:///c:/project/antigravity/.agents/skills/tauri-desktop-style/SKILL.md) untuk panduan teknis langkah demi langkah penambahan IPC command, window management, integrasi MCP server, dan validasi QA.
