import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { exec } from 'child_process'

// https://vite.dev/config/
export default defineConfig({
  base: '/nexus/',
  plugins: [
    react(),
    {
      name: 'nexus-bridge',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith('/api/launcher')) {
            const url = new URL(req.url, `http://${req.headers.host}`)
            const app = url.searchParams.get('app')
            
            if (app === 'notepad') {
              exec('notepad.exe')
            } else if (app === 'excel') {
              exec('start excel')
            } else if (app === 'word') {
              exec('start winword')
            } else if (app === 'vscode') {
              exec('code')
            } else if (app === 'chrome') {
              exec('start chrome')
            }
            
            res.end(JSON.stringify({ status: 'launched', app }))
            return
          }
          next()
        })
      }
    }
  ],
})
