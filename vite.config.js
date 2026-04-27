import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/nexus/',
  plugins: [
    react(),
    {
      name: 'app-launcher-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const requestUrl = req.url || '';
          
          // More lenient check for the launcher API
          if (requestUrl.includes('api/launcher')) {
            console.log(`[Nexus Bridge] Match found: ${requestUrl}`);

            // Handle CORS preflight
            if (req.method === 'OPTIONS') {
              res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
              });
              res.end();
              return;
            }

            try {
              const logFile = path.join(process.cwd(), 'bridge.log');
              const log = (msg) => {
                const timestamp = new Date().toISOString();
                try { fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`); } catch (e) {}
                console.log(`\x1b[35m[Nexus Bridge]\x1b[0m ${msg}`);
              };

              log(`Request Method: ${req.method} | URL: ${requestUrl}`);

              // Robustly extract the 'app' parameter without requiring a full URL object
              const queryString = requestUrl.split('?')[1] || '';
              const params = new URLSearchParams(queryString);
              const rawApp = params.get('app');
              
              if (!rawApp) {
                log(`Error: Missing 'app' parameter in ${requestUrl}`);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No app specified' }));
                return;
              }

              // Sanitize input
              const app = rawApp.toLowerCase().trim().replace(/[^a-zA-Z0-9.\-_ /:\\]/g, '');
              
              let command = '';
              switch (app) {
                case 'notepad': 
                case 'notes':
                  command = 'start notepad'; 
                  break;
                case 'excel': 
                case 'spreadsheet':
                  command = 'start excel'; 
                  break;
                case 'word':
                case 'winword': 
                case 'document':
                  command = 'start winword'; 
                  break;
                case 'vscode':
                case 'code': 
                case 'vs code':
                  command = 'start code'; 
                  break;
                case 'chrome': 
                case 'browser':
                case 'google chrome':
                  command = 'start chrome'; 
                  break;
                case 'edge':
                case 'msedge':
                case 'microsoft edge':
                  command = 'start msedge';
                  break;
                case 'spotify':
                case 'music':
                  command = 'start spotify';
                  break;
                case 'calc':
                case 'calculator':
                  command = 'start calc';
                  break;
                case 'terminal':
                case 'cmd':
                case 'command prompt':
                  command = 'start cmd';
                  break;
                case 'powershell':
                case 'ps':
                  command = 'start powershell';
                  break;
                default: 
                  command = `start "" "${app}"`;
              }

              log(`Executing: ${command}`);
              
              exec(command, { shell: true }, (error, stdout, stderr) => {
                if (error) {
                  log(`EXEC_ERROR: ${error.message}`);
                } else if (stderr) {
                  log(`EXEC_STDERR: ${stderr}`);
                } else {
                  log(`EXEC_SUCCESS: ${app}`);
                }
              });

              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ 
                status: 'success', 
                app, 
                timestamp: new Date().toISOString()
              }));
              return;
            } catch (err) {
              console.error(`[Nexus Bridge] Critical Error: ${err.message}`);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Server Error', details: err.message }));
              return;
            }
          }
          next();
        });
      }
    }
  ],
})
