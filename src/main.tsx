/**
 * @file main.tsx
 * @description Titik masuk utama aplikasi React desktop dengan proteksi disabled context menu.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { setupContextMenuGuard } from './utils/disableContextMenu';

// Nonaktifkan klik kanan bawaan browser untuk pengalaman native desktop
setupContextMenuGuard();

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
