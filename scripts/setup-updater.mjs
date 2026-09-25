/**
 * @file setup-updater.mjs
 * @description Skrip otomasi penyiapan kunci Ed25519 dan pendaftaran ke GitHub Secrets
 * untuk fitur auto-update Paylabs VA Desktop (Tauri v2).
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const REPO_NAME = 'paylabs/PaylabsVA-Desktop';
const TAURI_KEY_DIR = join(homedir(), '.tauri');
const PRIVATE_KEY_PATH = join(TAURI_KEY_DIR, 'paylabs-va.key');
const PUBLIC_KEY_PATH = `${PRIVATE_KEY_PATH}.pub`;
const TAURI_CONF_PATH = resolve(process.cwd(), 'src-tauri', 'tauri.conf.json');

/**
 * Mencari path binary GitHub CLI (gh)
 * @returns {string} Path binary gh
 */
function getGhBinary() {
  const defaultWinPath = 'C:\\Program Files\\GitHub CLI\\gh.exe';
  if (existsSync(defaultWinPath)) {
    return defaultWinPath;
  }
  return 'gh';
}

/**
 * Memastikan keypair Ed25519 telah dibuat
 * @returns {string} Public key string
 */
function ensureKeyPair() {
  console.log('🔑 [1/3] Memeriksa pasangan kunci Ed25519...');
  if (!existsSync(PRIVATE_KEY_PATH) || !existsSync(PUBLIC_KEY_PATH)) {
    console.log('⚙️ Membuat kunci penandatanganan baru via Tauri CLI...');
    execSync(`npx @tauri-apps/cli signer generate --ci -w "${PRIVATE_KEY_PATH}" -f`, {
      stdio: 'inherit',
    });
  }

  const pubKeyContent = readFileSync(PUBLIC_KEY_PATH, 'utf-8').trim();
  console.log('✅ Kunci penandatanganan siap.');
  return pubKeyContent;
}

/**
 * Menyinkronkan public key ke tauri.conf.json
 * @param {string} pubKey - Public key string
 */
function syncTauriConfig(pubKey) {
  console.log('📝 [2/3] Menyinkronkan konfigurasi ke tauri.conf.json...');
  const rawConfig = readFileSync(TAURI_CONF_PATH, 'utf-8');
  const config = JSON.parse(rawConfig);

  config.bundle = config.bundle || {};
  config.bundle.createUpdaterArtifacts = true;

  config.plugins = config.plugins || {};
  config.plugins.updater = {
    pubkey: pubKey,
    endpoints: [
      `https://github.com/${REPO_NAME}/releases/latest/download/latest.json`,
    ],
  };

  writeFileSync(TAURI_CONF_PATH, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  console.log('✅ tauri.conf.json berhasil diperbarui.');
}

/**
 * Mendaftarkan private key ke GitHub Repository Secrets via gh CLI
 * @param {string} ghBin - Path binary gh
 */
function registerGitHubSecret(ghBin) {
  console.log('🚀 [3/3] Memeriksa otentikasi GitHub CLI...');
  const authCheck = spawnSync(ghBin, ['auth', 'status'], { encoding: 'utf-8' });

  if (authCheck.status !== 0) {
    console.log('\n⚠️ GitHub CLI belum terhubung. Menjalankan otentikasi...');
    console.log('👉 Silakan ikuti instruksi di layar (pilih GitHub.com -> HTTPS -> Login with a web browser):');
    spawnSync(ghBin, ['auth', 'login', '--hostname', 'github.com', '--web'], { stdio: 'inherit' });
  }

  console.log(`📤 Mengirim TAURI_SIGNING_PRIVATE_KEY ke repositori ${REPO_NAME}...`);
  const privateKey = readFileSync(PRIVATE_KEY_PATH, 'utf-8');
  const secretResult = spawnSync(
    ghBin,
    ['secret', 'set', 'TAURI_SIGNING_PRIVATE_KEY', '--repo', REPO_NAME],
    {
      input: privateKey,
      encoding: 'utf-8',
    }
  );

  if (secretResult.status === 0) {
    console.log('🎉 SUKSES! Secret TAURI_SIGNING_PRIVATE_KEY berhasil disimpan di GitHub Secrets!');
  } else {
    console.error('❌ Gagal menyetel secret otomatis:', secretResult.stderr);
    console.log('💡 Anda dapat menyalin isi file berikut secara manual jika perlu:');
    console.log(`   ${PRIVATE_KEY_PATH}`);
  }
}

/**
 * Titik masuk utama eksekusi otomasi
 */
function main() {
  console.log('====================================================');
  console.log('🤖 Paylabs VA Desktop — Auto-Update One-Click Setup');
  console.log('====================================================\n');

  try {
    const pubKey = ensureKeyPair();
    syncTauriConfig(pubKey);
    const ghBin = getGhBinary();
    registerGitHubSecret(ghBin);
    console.log('\n✨ Seluruh konfigurasi Auto-Update telah selesai disiapkan.');
  } catch (err) {
    console.error('\n❌ Terjadi kesalahan saat setup:', err.message);
    process.exit(1);
  }
}

main();
