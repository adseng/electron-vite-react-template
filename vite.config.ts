import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {

  return {
    plugins:
      [
        react(),
        mode === 'electron' ? electron({
          entry: ['electron/main.ts', 'electron/preload.ts']
        }) : null
      ],
  }
})
