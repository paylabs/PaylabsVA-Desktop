/**
 * @file App.tsx
 * @description Komponen akar React yang merender AppShell desktop.
 */

import React from 'react';
import { AppShell } from './components/layout/AppShell';

/**
 * Komponen Utama Aplikasi
 */
export function App(): React.JSX.Element {
  return <AppShell />;
}

export default App;
