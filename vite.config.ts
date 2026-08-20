import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function remoraVersion(): Plugin {
  const version =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.npm_package_version ||
    String(Date.now())
  const payload = JSON.stringify({
    version,
    builtAt: new Date().toISOString(),
  })

  return {
    name: 'remora-version',
    config() {
      return {
        define: {
          __REMORA_VERSION__: JSON.stringify(version),
        },
      }
    },
    configureServer(server) {
      server.middlewares.use('/version.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        res.end(payload)
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: payload,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), remoraVersion()],
})
