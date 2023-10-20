import { defineConfig } from 'vite'
import { join } from 'path'
import { spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import react from '@vitejs/plugin-react-swc'

const LOCAL_NETWORK = "local";
const NETWORK = process.env.DFX_NETWORK || LOCAL_NETWORK;

const loadEnv = () => {
  let canisterIDsPath;
  if (NETWORK === LOCAL_NETWORK) {
    canisterIDsPath = join(__dirname, '.dfx/local/canister_ids.json');
  } else {
    canisterIDsPath = join(__dirname, 'canister_ids.json');
  }

  if (!existsSync(canisterIDsPath)) {
    spawnSync('dfx', ['canister', 'create', '--all'], { cwd: __dirname });

    if (!existsSync(canisterIDsPath)) {
      throw new Error('Cannot find canister_ids.json. Make sure that dfx is installed and that you ran dfx start.')
    }
  }

  const canisterIDs = JSON.parse(readFileSync(canisterIDsPath, { encoding: 'utf8' }))

  return Object.fromEntries(
    Object.entries(canisterIDs).map(([name, ids]) => [
      `process.env.${name.toUpperCase()}_CANISTER_ID`,
      JSON.stringify(ids[NETWORK] || ids[LOCAL_NETWORK]),
    ]),
  )
};



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    ...loadEnv(),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
      },
    },
  }
})
